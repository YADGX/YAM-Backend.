from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    specialization = models.CharField(max_length=255, blank=True, null=True)
    scfhs_certificate_id = models.CharField(max_length=100, blank=True, null=True)
    is_approved = models.BooleanField(default=False)  

    def __str__(self):
        return f"{self.username} ({self.role})"

# -----------------------------------------------------------------------------------------------------------------------------------
class Request(models.Model):
    title = models.CharField(max_length=255)
    summary_comment = models.TextField()
    detailed_comment = models.TextField()
    posted_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('done', 'Done'), ('declined', 'Declined')],
        default='pending'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests')
    doctor = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_requests')

    def __str__(self):
        return f"Request '{self.title}' by {self.user.username}"

# -----------------------------------------------------------------------------------------------------------------------------------
class Review(models.Model):
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_reviews')
    request = models.ForeignKey(Request, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'request')  

    def __str__(self):
        return f"Review by {self.user.username} for {self.doctor.username} - Rating: {self.rating}"
