"""
==================================================
  🛒 orders/models.py
  جدول الطلبات
==================================================
"""
from django.db import models
from django.conf import settings
from designs.models import Design


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',   'قيد الانتظار'),
        ('confirmed', 'مؤكد'),
        ('shipped',   'تم الشحن'),
        ('delivered', 'تم التوصيل'),
        ('cancelled', 'ملغي'),
    ]

    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    design     = models.ForeignKey(Design, on_delete=models.CASCADE)
    quantity   = models.PositiveIntegerField(default=1)
    total      = models.DecimalField(max_digits=10, decimal_places=2)
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    address    = models.TextField()                             # ⚠️ عنوان التوصيل
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"طلب #{self.id} - {self.user.email}"

    def save(self, *args, **kwargs):
        # حساب السعر الإجمالي تلقائياً
        self.total = self.design.price * self.quantity
        super().save(*args, **kwargs)
class Invoice(models.Model):
    """فاتورة الطلب"""
    order          = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='invoice')
    invoice_number = models.CharField(max_length=20, unique=True)
    fabric_cost    = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    thread_cost    = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sewing_cost    = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_cost     = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_percent    = models.DecimalField(max_digits=5,  decimal_places=2, default=15)
    created_at     = models.DateTimeField(auto_now_add=True)

    @property
    def subtotal(self):
        return self.fabric_cost + self.thread_cost + self.sewing_cost + self.other_cost

    @property
    def tax_amount(self):
        return self.subtotal * (self.tax_percent / 100)

    @property
    def total(self):
        return self.subtotal + self.tax_amount

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            import uuid
            self.invoice_number = f"INV-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)        




# ==================================================
#  orders/models.py — أضف هذا في نهاية الملف
# ==================================================

class OrderMaterial(models.Model):
    """المواد التي اختارها الزبون"""
    order    = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='order_materials')
    material = models.ForeignKey('designs.Material', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    @property
    def subtotal(self):
        return self.material.price * self.quantity


class Invoice(models.Model):
    """الفاتورة الكاملة"""
    order          = models.OneToOneField('Order', on_delete=models.CASCADE, related_name='invoice')
    invoice_number = models.CharField(max_length=20, unique=True)
    tax_percent    = models.DecimalField(max_digits=5, decimal_places=2, default=15)
    notes          = models.TextField(blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    @property
    def materials_total(self):
        return sum(m.subtotal for m in self.order.order_materials.all())

    @property
    def design_price(self):
        return self.order.design.price * self.order.quantity

    @property
    def subtotal(self):
        return self.materials_total + self.design_price

    @property
    def tax_amount(self):
        return round(self.subtotal * (self.tax_percent / 100), 2)

    @property
    def total(self):
        return self.subtotal + self.tax_amount

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            import uuid
            self.invoice_number = f"INV-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"فاتورة {self.invoice_number}"