"""
==================================================
  🧠 accounts/views.py
  المنطق الخاص بالمستخدمين
==================================================
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model

from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer

User = get_user_model()


def get_tokens(user):
    """إنشاء JWT Token للمستخدم"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }


class RegisterView(APIView):
    """
    POST /api/auth/register/
    إنشاء حساب جديد
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user   = serializer.save()
            tokens = get_tokens(user)
            return Response({
                'message': 'تم إنشاء الحساب بنجاح ✅',
                'tokens':  tokens,
                'user':    UserProfileSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    POST /api/auth/login/
    تسجيل الدخول
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user:
                tokens = get_tokens(user)
                return Response({
                    'message': 'تم تسجيل الدخول ✅',
                    'tokens':  tokens,
                    'user':    UserProfileSerializer(user).data
                })
            return Response({'error': 'الإيميل أو كلمة المرور خاطئة'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    تسجيل الخروج
    """
    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'تم تسجيل الخروج ✅'})
        except Exception:
            return Response({'error': 'خطأ في تسجيل الخروج'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """
    GET  /api/auth/profile/  → عرض البيانات
    PUT  /api/auth/profile/  → تعديل البيانات
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'تم تحديث البيانات ✅', 'user': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# ==================================================
#  accounts/views.py — أضف هذا في نهاية الملف
#  إحصائيات لوحة المدير
# ==================================================
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta


class AdminStatsView(APIView):
    """
    GET /api/auth/admin/stats/
    إحصائيات كاملة للمدير فقط
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        from orders.models import Order, Invoice
        from designs.models import Design

        today     = timezone.now()
        last_30   = today - timedelta(days=30)
        last_7    = today - timedelta(days=7)

        # ===== إحصائيات عامة =====
        total_users    = User.objects.count()
        new_users_30   = User.objects.filter(date_joined__gte=last_30).count()
        total_orders   = Order.objects.count()
        new_orders_7   = Order.objects.filter(created_at__gte=last_7).count()
        total_revenue  = Invoice.objects.aggregate(t=Sum('order__total'))['t'] or 0
        revenue_30     = Order.objects.filter(created_at__gte=last_30).aggregate(t=Sum('total'))['t'] or 0
        total_designs  = Design.objects.filter(status='published').count()

        # ===== الطلبات حسب الحالة =====
        orders_by_status = dict(
            Order.objects.values_list('status').annotate(c=Count('id'))
        )

        # ===== آخر 7 أيام (مبيعات يومية) =====
        daily_sales = []
        for i in range(7):
            day   = today - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0)
            day_end   = day.replace(hour=23, minute=59, second=59)
            revenue = Order.objects.filter(
                created_at__range=[day_start, day_end]
            ).aggregate(t=Sum('total'))['t'] or 0
            daily_sales.append({
                'date':    day.strftime('%Y-%m-%d'),
                'revenue': float(revenue),
                'orders':  Order.objects.filter(created_at__range=[day_start, day_end]).count()
            })

        # ===== أكثر التصاميم مبيعاً =====
        top_designs = Order.objects.values(
            'design__title'
        ).annotate(
            count=Count('id'),
            revenue=Sum('total')
        ).order_by('-count')[:5]

        # ===== آخر الطلبات =====
        recent_orders = Order.objects.select_related('user', 'design').order_by('-created_at')[:10]
        recent_orders_data = [
            {
                'id':       o.id,
                'customer': o.user.email,
                'design':   o.design.title,
                'total':    str(o.total),
                'status':   o.status,
                'date':     o.created_at.strftime('%Y-%m-%d'),
            }
            for o in recent_orders
        ]

        return Response({
            'overview': {
                'total_users':   total_users,
                'new_users_30':  new_users_30,
                'total_orders':  total_orders,
                'new_orders_7':  new_orders_7,
                'total_revenue': float(total_revenue),
                'revenue_30':    float(revenue_30),
                'total_designs': total_designs,
            },
            'orders_by_status': orders_by_status,
            'daily_sales':      daily_sales,
            'top_designs':      list(top_designs),
            'recent_orders':    recent_orders_data,
        })
