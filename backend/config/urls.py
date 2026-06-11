"""
==================================================
  🔗 الروابط الرئيسية للمشروع
  كل app له ملف urls.py خاص به
==================================================
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # لوحة الإدارة
    path('admin/', admin.site.urls),

    # روابط كل App
    path('api/auth/',     include('accounts.urls')),      # /api/auth/register
    path('api/designs/',  include('designs.urls')),       # /api/designs/
    path('api/ai/',       include('ai_generate.urls')),   # /api/ai/generate
    path('api/orders/',   include('orders.urls')),        # /api/orders/
    
]

# تفعيل رفع الصور في وضع التطوير
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

