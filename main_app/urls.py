from django.urls import path
from .views import UserRegisterView, UserLoginView, RequestCreateView, UserRequestsListView, UserRequestDetailView, ReviewCreateView, DoctorRequestsView, ApproveDoctorView, DeclineDoctorView, DoctorPendingRequestsView, AcceptRequestView, UpdateRequestStatusView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # User routes
    path('users/signup/', UserRegisterView.as_view(), name='user-signup'),
    path('users/login/', UserLoginView.as_view(), name='user-login'),

    # JWT Token routes
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # REQ
    path('requests/', RequestCreateView.as_view(), name='create-request'),
    
    # REQ View
    path('requests/my/', UserRequestsListView.as_view(), name='user-requests'),

    # REQ Edit, Delete
    path('requests/<int:pk>/', UserRequestDetailView.as_view(), name='user-request-detail'),
    
    # User Review
    path('reviews/', ReviewCreateView.as_view(), name='create-review'),

    # Admin Review
    path('doctor-requests/', DoctorRequestsView.as_view(), name='doctor-requests'),
    path('accept-doctor/<int:doctor_id>/', ApproveDoctorView.as_view(), name='accept-doctor'),
    path('decline-doctor/<int:doctor_id>/', DeclineDoctorView.as_view(), name='decline-doctor'),
    
    # Doctor Pending Requests
    path('doctor/requests/', DoctorPendingRequestsView.as_view(), name='doctor-pending-requests'),
    path('doctor/requests/accept/<int:pk>/', AcceptRequestView.as_view(), name='accept-request'),
    
    # Update Statue
    path('requests/<int:pk>/update-status/', UpdateRequestStatusView.as_view(), name='update-request-status'),



]
