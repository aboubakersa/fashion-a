"""
==================================================
  👗 designs/models.py
  جداول التصاميم في قاعدة البيانات
==================================================
"""
from django.db import models
from django.conf import settings


class Category(models.Model):
    """فئات الملابس — مثال: فساتين، بناطيل، قمصان"""
    name       = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Design(models.Model):
    """التصميم الواحد"""

    STATUS_CHOICES = [
        ('draft',     'مسودة'),
        ('published', 'منشور'),
        ('archived',  'مؤرشف'),
    ]

    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='designs')
    category    = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image       = models.ImageField(upload_to='designs/')       # صورة التصميم
    ai_image    = models.ImageField(upload_to='ai_designs/', blank=True)  # صورة الذكاء الاصطناعي
    price       = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class DesignLike(models.Model):
    """إعجابات التصاميم"""
    user      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    design    = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='likes')
    liked_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'design']  # إعجاب واحد فقط لكل مستخدم
class Material(models.Model):
    """المواد التي يضيفها المدير"""
    TYPE_CHOICES = [
        ('fabric',  'قماش'),
        ('thread',  'خيط'),
        ('sewing',  'طريقة خياطة'),
        ('color',   'لون'),
    ]
    type        = models.CharField(max_length=20, choices=TYPE_CHOICES)
    name        = models.CharField(max_length=100)   # مثال: حرير، قطن
    Category    = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True,related_name="materials")
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    image       = models.ImageField(upload_to='materials/', blank=True)
    is_active   = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.get_type_display()} — {self.name}"


class OrderMaterial(models.Model):
    """المواد التي اختارها الزبون في طلبه"""
    order    = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='materials')
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    @property
    def subtotal(self):
        return self.material.price * self.quantity     
# ==================================================
#  designs/models.py — أضف هذا في نهاية الملف
# ==================================================

class MaterialCategory(models.Model):
    """فئات المواد — المدير يضيفها"""
    name        = models.CharField(max_length=100)   # مثال: أقمشة، خيوط، خياطة
    icon        = models.CharField(max_length=10, blank=True)  # إيموجي
    description = models.TextField(blank=True)
    order       = models.PositiveIntegerField(default=0)  # ترتيب الظهور

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class OrderMaterial(models.Model):
    """المواد — المدير يضيفها ويحدد أسعارها"""
    category    = models.ForeignKey(MaterialCategory, on_delete=models.CASCADE, related_name='materials')
    name        = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    image       = models.ImageField(upload_to='materials/', blank=True)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category.name} — {self.name} ({self.price} ر.س)"


