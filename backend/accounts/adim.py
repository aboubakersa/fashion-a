
# ==================================================
#  accounts/admin.py — استبدل كل محتوى الملف بهذا
# ==================================================
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display  = ['email', 'username', 'orders_count', 'is_active', 'date_joined']
    list_filter   = ['is_active', 'is_staff', 'date_joined']
    search_fields = ['email', 'username']
    ordering      = ['-date_joined']

    fieldsets = UserAdmin.fieldsets + (
        ('معلومات إضافية', {'fields': ('phone', 'avatar')}),
    )

    def orders_count(self, obj):
        count = obj.orders.count()
        return format_html('<strong>{}</strong> طلب', count)
    orders_count.short_description = 'الطلبات'
