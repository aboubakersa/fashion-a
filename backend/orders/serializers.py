"""
==================================================
  📦 orders/serializers.py
==================================================
"""
from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Order
        fields = ['id', 'design', 'quantity', 'total', 'status', 'address', 'created_at']
        read_only_fields = ['id', 'total', 'created_at']
