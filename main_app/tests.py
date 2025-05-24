from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from .models import User, Request, Review
from rest_framework_simplejwt.tokens import RefreshToken

class UserTests(APITestCase):

    def test_user_registration_and_login(self):
        signup_url = reverse('user-signup')
        user_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "Testpass123!",
            "role": "user"
        }
        signup_response = self.client.post(signup_url, user_data, format='json')
        self.assertEqual(signup_response.status_code, status.HTTP_201_CREATED)
        
        login_url = reverse('user-login')
        login_data = {
            "username": "testuser",
            "password": "Testpass123!"
        }
        login_response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.data)
        self.assertIn('refresh', login_response.data)
        self.assertEqual(login_response.data['user']['username'], 'testuser')

class DoctorTests(APITestCase):

    def setUp(self):
        self.admin = User.objects.create_superuser(username='admin', email='admin@example.com', password='adminpass')

    def test_doctor_registration_and_rejection_before_approval(self):
        signup_url = reverse('user-signup')
        doctor_data = {
            "username": "doc1",
            "email": "doc1@example.com",
            "password": "Docpass123!",
            "role": "doctor",
            "specialization": "Cardiology",
            "scfhs_certificate_id": "SCFHS0001"
        }
        response = self.client.post(signup_url, doctor_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data.get('is_approved', True))  

        login_url = reverse('user-login')
        login_data = {
            "username": "doc1",
            "password": "Docpass123!"
        }
        login_response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_approve_doctor(self):
        doctor = User.objects.create_user(
            username="doc2",
            email="doc2@example.com",
            password="Docpass123!",
            role="doctor",
            specialization="Dermatology",
            scfhs_certificate_id="SCFHS0002",
            is_approved=False
        )
        
        # توليد توكن ادمن
        refresh = RefreshToken.for_user(self.admin)
        token = str(refresh.access_token)
        
        # الموافقة على الطبيب
        approve_url = reverse('accept-doctor', kwargs={'doctor_id': doctor.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        approve_response = self.client.put(approve_url)
        self.assertEqual(approve_response.status_code, status.HTTP_200_OK)
        
        # تحديث الطبيب
        doctor.refresh_from_db()
        self.assertTrue(doctor.is_approved)

    def test_admin_can_decline_doctor(self):
        doctor = User.objects.create_user(
            username="doc3",
            email="doc3@example.com",
            password="Docpass123!",
            role="doctor",
            specialization="Neurology",
            scfhs_certificate_id="SCFHS0003",
            is_approved=False
        )
        
        refresh = RefreshToken.for_user(self.admin)
        token = str(refresh.access_token)
        
        decline_url = reverse('decline-doctor', kwargs={'doctor_id': doctor.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        decline_response = self.client.put(decline_url)
        self.assertEqual(decline_response.status_code, status.HTTP_200_OK)
        
        # تأكد ان الطبيب تم حذفه
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(id=doctor.id)
            
# ----------------------------------------------------------------------------------------------------------------------------------------------------
class RequestTests(APITestCase):
    def setUp(self):
        # يتم تشغيلها قبل كل اختبار لتعريف المستخدم وإعداد التوكن
        self.user, created = User.objects.get_or_create(username='testuser')
        if created:
            self.user.set_password('testpass')
            self.user.save()
        self.token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_request(self):
        url = reverse('create-request')
        data = {
            "title": "Test Request",
            "summary_comment": "Summary of request",
            "detailed_comment": "Detailed comment about the request"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user'], self.user.username)
        self.assertEqual(response.data['title'], data['title'])


        
# ----------------------------------------------------------------------------------------------------------------------------------------------------
class UserRequestsListTests(APITestCase):
    def setUp(self):
        # انشاء مستخدم وتسجيل الدخول
        self.user = User.objects.create_user(username='testuser', password='Testpass123!', role='user', is_approved=True)
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # انشاء طلبين خاصين بالمستخدم
        Request.objects.create(title="Request 1", summary_comment="Summary 1", detailed_comment="Details 1", user=self.user)
        Request.objects.create(title="Request 2", summary_comment="Summary 2", detailed_comment="Details 2", user=self.user)
        
    def test_list_user_requests(self):
        url = reverse('user-requests')  # حسب urls.py path 'requests/my/' باسم user-requests
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # نتأكد أنه جاب الطلبين
        titles = [req['title'] for req in response.data]
        self.assertIn("Request 1", titles)
        self.assertIn("Request 2", titles)

# ----------------------------------------------------------------------------------------------------------------------------------------------------
class UserRequestModifyTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='Testpass123!', role='user', is_approved=True)
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # إنشاء طلب بــ status pending
        self.request_obj = Request.objects.create(
            title="Editable Request",
            summary_comment="Summary",
            detailed_comment="Details",
            user=self.user,
            status='pending'
        )
    
    def test_update_request_pending(self):
        url = reverse('user-request-detail', kwargs={'pk': self.request_obj.pk})
        data = {
            "title": "Updated Title",
            "summary_comment": "Updated Summary",
            "detailed_comment": "Updated Details"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.request_obj.refresh_from_db()
        self.assertEqual(self.request_obj.title, "Updated Title")
    
    def test_delete_request_pending(self):
        url = reverse('user-request-detail', kwargs={'pk': self.request_obj.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Request.DoesNotExist):
            Request.objects.get(pk=self.request_obj.pk)
    
    def test_update_request_accepted_forbidden(self):
        self.request_obj.status = 'accepted'
        self.request_obj.save()
        url = reverse('user-request-detail', kwargs={'pk': self.request_obj.pk})
        data = {
            "title": "Try Update"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)  # لأنه لم يعد في queryset التعديل
    
    def test_delete_request_accepted_forbidden(self):
        self.request_obj.status = 'accepted'
        self.request_obj.save()
        url = reverse('user-request-detail', kwargs={'pk': self.request_obj.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)  # حذف ممنوع، الطلب غير موجود ضمن queryset

# ----------------------------------------------------------------------------------------------------------------------------------------------------
class ReviewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='Testpass123!', role='user', is_approved=True)
        self.doctor = User.objects.create_user(username='doc1', password='Docpass123!', role='doctor', is_approved=True)
        self.request_obj = Request.objects.create(
            title="Completed Request",
            summary_comment="Summary",
            detailed_comment="Details",
            user=self.user,
            doctor=self.doctor,
            status='done'
        )
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_create_review_success(self):
        url = reverse('create-review')
        data = {
            "rating": 5,
            "comment": "Great doctor!",
            "request": self.request_obj.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['rating'], 5)
    
    def test_create_review_fail_if_request_not_done(self):
        self.request_obj.status = 'accepted'
        self.request_obj.save()
        url = reverse('create-review')
        data = {
            "rating": 4,
            "comment": "Good doctor",
            "request": self.request_obj.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_create_review_fail_duplicate(self):
        # إنشاء مراجعة أولى بنجاح
        Review.objects.create(
            rating=5,
            comment="First review",
            user=self.user,
            doctor=self.doctor,
            request=self.request_obj
        )
        url = reverse('create-review')
        data = {
            "rating": 3,
            "comment": "Second review",
            "request": self.request_obj.id
        }
        response = self.client.post(url, data, format='json')
        # يجب أن تفشل لأنه ممنوع تقييم نفس الطلب مرتين
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# ----------------------------------------------------------------------------------------------------------------------------------------------------