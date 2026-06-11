


# ==================================================
#  orders/admin.py — استبدل كل محتوى الملف بهذا
# ==================================================
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum, Count
from django.utils import timezone
from .models import Order, Invoice, OrderMaterial


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display   = ['id', 'user_email', 'design_title', 'total_display', 'status_badge', 'created_at']
    list_filter    = ['status', 'created_at']
    list_editable  = ['status'] if False else []  # يتعدل من الصفحة التفصيلية
    search_fields  = ['user__email', 'design__title']
    date_hierarchy = 'created_at'
    readonly_fields = ['total']

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'الزبون'

    def design_title(self, obj):
        return obj.design.title
    design_title.short_description = 'التصميم'

    def total_display(self, obj):
        return format_html('<strong style="color:#27ae60">{} ر.س</strong>', obj.total)
    total_display.short_description = 'الإجمالي'

    def status_badge(self, obj):
        colors = {
            'pending':   '#f39c12',
            'confirmed': '#3498db',
            'shipped':   '#9b59b6',
            'delivered': '#27ae60',
            'cancelled': '#e74c3c',
        }
        labels = {
            'pending':   'انتظار',
            'confirmed': 'مؤكد',
            'shipped':   'شحن',
            'delivered': 'مُسلَّم',
            'cancelled': 'ملغي',
        }
        color = colors.get(obj.status, '#888')
        label = labels.get(obj.status, obj.status)
        return format_html(
            '<span style="background:{};color:#fff;padding:3px 10px;border-radius:12px;font-size:12px">{}</span>',
            color, label
        )
    status_badge.short_description = 'الحالة'


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display    = ['invoice_number', 'customer', 'total_display', 'created_at']
    readonly_fields = ['invoice_number', 'created_at']
    search_fields   = ['invoice_number', 'order__user__email']
    date_hierarchy  = 'created_at'

    def customer(self, obj):
        return obj.order.user.email
    customer.short_description = 'الزبون'

    def total_display(self, obj):
        return format_html('<strong style="color:#c9a84c">{} ر.س</strong>', obj.total)
    total_display.short_description = 'الإجمالي'

