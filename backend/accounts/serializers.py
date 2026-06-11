"""
==================================================
  📦 accounts/serializers.py
  تحويل بيانات المستخدم لـ JSON والعكس
==================================================
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """تسجيل مستخدم جديد"""
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        # التحقق أن كلمتا المرور متطابقتان
        if data['password'] != data['password2']:
            raise serializers.ValidationError("كلمتا المرور غير متطابقتين")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """تسجيل الدخول"""
    email    = serializers.EmailField()
    password = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    """عرض وتعديل بيانات المستخدم"""
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'phone', 'avatar', 'created_at']
        read_only_fields = ['id', 'email', 'created_at']
