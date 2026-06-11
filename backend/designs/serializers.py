"""
==================================================
  📦 designs/serializers.py
==================================================
"""
from rest_framework import serializers
from .models import Design, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name']


class DesignSerializer(serializers.ModelSerializer):
    user     = serializers.StringRelatedField(read_only=True)
    category = CategorySerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model  = Design
        fields = ['id', 'user', 'category', 'title', 'description',
                  'image', 'ai_image', 'price', 'status', 'likes_count', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_likes_count(self, obj):
        return obj.likes.count()
