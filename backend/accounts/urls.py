"""
==================================================
  🔗 accounts/urls.py
  روابط المستخدمين
==================================================
"""
from django.urls import path
from .views import RegisterView, LoginView, LogoutView, ProfileView, AdminStatsView



urlpatterns = [
    path('register/', RegisterView.as_view()),  # POST /api/auth/register/
    path('login/',    LoginView.as_view()),     # POST /api/auth/login/
    path('logout/',   LogoutView.as_view()),    # POST /api/auth/logout/
    path('profile/',  ProfileView.as_view()),
    path('admin/stats/',    AdminStatsView.as_view()),      # GET/PUT /api/auth/profile/
]
