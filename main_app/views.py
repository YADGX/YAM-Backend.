from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, RequestSerializer, ReviewSerializer, DoctorRequestSerializer
from .models import Review, User, Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import models
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.shortcuts import get_object_or_404


from main_app import serializers


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    
    def create(self, request, *args, **kwargs): # here 
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=response.data['username'])
        serialized_user = UserSerializer(user)
        return Response(serialized_user.data, status=status.HTTP_201_CREATED)

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role == 'doctor' and not user.is_approved:
            return Response({"detail": "Doctor registration pending admin approval"}, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        })
        
        
# ---------------------------------------------------------------------------------------------------------------------------------------------------
class RequestCreateView(generics.CreateAPIView):
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):   # also here
        request_id = self.request.data.get('request')
        try:
            request_obj = Request.objects.get(id=request_id, user=self.request.user, status='done')
        except Request.DoesNotExist:
            raise ValidationError("Request not completed or doesn't belong to you.")

        # تحقق اذا المراجعة موجودة مسبقًا
        if Review.objects.filter(user=self.request.user, request=request_obj).exists():
            raise ValidationError("You have already reviewed this request.")

        doctor = request_obj.doctor
        serializer.save(user=self.request.user, doctor=doctor, request=request_obj)

# ---------------------------------------------------------------------------------------------------------------------------------------------------
class UserRequestsListView(generics.ListAPIView):
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Request.objects.filter(user=self.request.user)
    
# ----------------------------------------------------------------------------------------------------------------------------------------------------
class UserRequestDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Request.objects.filter(user=self.request.user, status='pending')
    
# ----------------------------------------------------------------------------------------------------------------------------------------------------
class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer): #here
       request_id = self.request.data.get('request')
       try:
           request_obj = Request.objects.get(id=request_id, user=self.request.user, status='done')
       except Request.DoesNotExist:
           raise ValidationError("Request not completed or doesn't belong to you.")
       # تحقق إذا المراجعة موجودة مسبقاً لنفس المستخدم ولنفس الطلب
       if Review.objects.filter(user=self.request.user, request=request_obj).exists():
           raise ValidationError("You have already reviewed this request.")
       doctor = request_obj.doctor
       serializer.save(user=self.request.user, doctor=doctor, request=request_obj)

# ------------------------------------------------------------------------------------------------------------------------------------------------------ Admin
class DoctorRequestsView(APIView):
    permission_classes = [permissions.IsAdminUser]  # فقط الأدمن يقدر يشوفها

    def get(self, request):
        # نحصل على كل الأطباء اللي لم يتم الموافقة عليهم بعد
        pending_doctors = User.objects.filter(role='doctor', is_approved=False)
        serializer = DoctorRequestSerializer(pending_doctors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ApproveDoctorView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, doctor_id):
        try:
            doctor = User.objects.get(id=doctor_id, role='doctor')
            doctor.is_approved = True
            doctor.save()
            return Response({'detail': 'Doctor approved'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)


class DeclineDoctorView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, doctor_id):
        try:
            doctor = User.objects.get(id=doctor_id, role='doctor')
            doctor.delete()
            return Response({'detail': 'Doctor declined and deleted'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------- Req Accept
class DoctorPendingRequestsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RequestSerializer

    def get_queryset(self):
        user = self.request.user
        # نتأكد أن المستخدم طبيب
        if user.role != 'doctor':
            raise PermissionDenied("Only doctors can view these requests.")
        
        # نجلب الطلبات المفتوحة (pending) لكل الأطباء
        # أو الطلبات التي هذا الطبيب هو الذي قبلها (doctor=user)
        return Request.objects.filter(
            models.Q(status='pending') | models.Q(doctor=user)
        )
        

class AcceptRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = request.user
        # نتأكد أنه طبيب
        if user.role != 'doctor':
            return Response({"detail": "Only doctors can accept requests."}, status=status.HTTP_403_FORBIDDEN)
        
        # نتأكد أن الطبيب لا يملك طلب مفتوح (غير مكتمل)
        open_requests = Request.objects.filter(doctor=user, status='accepted')
        if open_requests.exists():
            return Response({"detail": "You must finish the current request before accepting a new one."}, status=status.HTTP_400_BAD_REQUEST)
        
        # نجلب الطلب حسب الـ pk واللي يكون حالته pending فقط
        request_obj = get_object_or_404(Request, pk=pk, status='pending')
        
        # نربط الطلب بهذا الطبيب ونغير الحالة إلى accepted
        request_obj.doctor = user
        request_obj.status = 'accepted'
        request_obj.save()

        return Response({"detail": "Request accepted successfully."}, status=status.HTTP_200_OK)
    
    

# ----------------------------------------------------------------------------------------------------------------------------------------------------------
class UpdateRequestStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            req = Request.objects.get(id=pk)
        except Request.DoesNotExist:
            return Response({'detail': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

        # تحقق أن الطبيب الحالي هو الذي قبل الطلب (مفتاح الأمان)
        if req.doctor != request.user:
            return Response({'detail': 'You are not authorized to update this request'}, status=status.HTTP_403_FORBIDDEN)

        # تحديث الحالة
        new_status = request.data.get('status')
        if new_status not in ['pending', 'accepted', 'done', 'declined']:
            return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        req.status = new_status
        req.save()

        return Response({'detail': f'Request status updated to {new_status}'}, status=status.HTTP_200_OK)

