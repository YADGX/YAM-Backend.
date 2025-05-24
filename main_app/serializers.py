from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Request, Review

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'specialization', 'scfhs_certificate_id')
        
    def validate(self, data):
        if data['role'] == 'doctor':
            if not data.get('specialization'):
                raise serializers.ValidationError({"specialization": "This field is required for doctors."})
            if not data.get('scfhs_certificate_id'):
                raise serializers.ValidationError({"scfhs_certificate_id": "This field is required for doctors."})
        return data

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role'],
            specialization=validated_data.get('specialization'),
            scfhs_certificate_id=validated_data.get('scfhs_certificate_id'),
            is_approved=False if validated_data['role'] == 'doctor' else True
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'specialization', 'scfhs_certificate_id', 'is_approved')


# -----------------------------------------------------------------------------------------------------------------

class RequestSerializer(serializers.ModelSerializer):
    # Show username instead of user ID for clarity in API responses
    user = serializers.ReadOnlyField(source='user.username')
    # Show doctor's username instead of ID in responses
    doctor = serializers.ReadOnlyField(source='doctor.username')

    class Meta:
        model = Request
        fields = '__all__'
        read_only_fields = ('user', 'status', 'doctor', 'posted_date')

    # Explicit create method to allow easy future customization if needed
    def create(self, validated_data):
        request = Request.objects.create(**validated_data)
        return request


# -------------------------------------------------------------------------------------------------------------------

class ReviewSerializer(serializers.ModelSerializer):
    # Show usernames instead of IDs for better readability
    user = serializers.ReadOnlyField(source='user.username')
    doctor = serializers.ReadOnlyField(source='doctor.username')

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user', 'doctor', 'request', 'created_at')

    # Validate rating to ensure it is between 1 and 5
    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


# -------------------------------------------------------------------------------------------------------------------- Admin

class DoctorRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'specialization', 'scfhs_certificate_id', 'is_approved']
