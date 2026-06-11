# ==================================================
#  designs/admin.py — استبدل كل محتوى الملف بهذا
# ==================================================
from django.contrib import admin
from django.utils.html import format_html
from .models import Design, Category, Material, MaterialCategory


@admin.register(MaterialCategory)
class MaterialCategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'icon', 'materials_count', 'order']
    list_editable = ['order']

    def materials_count(self, obj):
        return obj.materials.count()
    materials_count.short_description = 'عدد المواد'


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display  = ['name', 'price', 'is_active']
    list_filter   = ['is_active']
    list_editable = ['is_active']
    search_fields = ['name']
    list_per_page = 20

    def price_display(self, obj):
        return format_html('<strong style="color:#c9a84c">{} ر.س</strong>', obj.price)
    price_display.short_description = 'السعر'


@admin.register(Design)
class DesignAdmin(admin.ModelAdmin):
    list_display  = ['title', 'user_email', 'price', 'status', 'likes_count', 'created_at']
    list_filter   = ['status', 'category']
    list_editable = ['status']
    search_fields = ['title', 'user__email']
    date_hierarchy = 'created_at'

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'المستخدم'

    def likes_count(self, obj):
        return obj.likes.count()
    likes_count.short_description = 'الإعجابات'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']

