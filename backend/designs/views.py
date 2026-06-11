"""
==================================================
  🧠 designs/views.py
  منطق التصاميم
==================================================
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Design, Category
from .serializers import DesignSerializer, CategorySerializer


class DesignListView(APIView):
    """
    GET  /api/designs/      → جلب كل التصاميم
    POST /api/designs/      → إضافة تصميم جديد
    """
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request):
        designs    = Design.objects.filter(status='published').order_by('-created_at')
        serializer = DesignSerializer(designs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DesignSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'message': 'تم إضافة التصميم ✅', 'design': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DesignDetailView(APIView):
    """
    GET    /api/designs/<id>/   → تفاصيل تصميم
    PUT    /api/designs/<id>/   → تعديل تصميم
    DELETE /api/designs/<id>/   → حذف تصميم
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Design.objects.get(pk=pk)
        except Design.DoesNotExist:
            return None

    def get(self, request, pk):
        design = self.get_object(pk)
        if not design:
            return Response({'error': 'التصميم غير موجود'}, status=status.HTTP_404_NOT_FOUND)
        return Response(DesignSerializer(design).data)

    def put(self, request, pk):
        design = self.get_object(pk)
        if not design:
            return Response({'error': 'التصميم غير موجود'}, status=status.HTTP_404_NOT_FOUND)
        if design.user != request.user:
            return Response({'error': 'غير مصرح لك'}, status=status.HTTP_403_FORBIDDEN)
        serializer = DesignSerializer(design, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'تم التعديل ✅', 'design': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        design = self.get_object(pk)
        if not design:
            return Response({'error': 'التصميم غير موجود'}, status=status.HTTP_404_NOT_FOUND)
        if design.user != request.user:
            return Response({'error': 'غير مصرح لك'}, status=status.HTTP_403_FORBIDDEN)
        design.delete()
        return Response({'message': 'تم الحذف ✅'})


class MyDesignsView(APIView):
    """
    GET /api/designs/my/   → تصاميمي أنا فقط
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        designs    = Design.objects.filter(user=request.user).order_by('-created_at')
        serializer = DesignSerializer(designs, many=True)
        return Response(serializer.data)
# ==================================================
#  designs/views.py — أضف هذا في نهاية الملف
# ==================================================
from .models import Material, MaterialCategory

class MaterialListView(APIView):
    """
    GET /api/designs/materials/
    جلب كل الفئات والمواد للزبون
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        categories = MaterialCategory.objects.prefetch_related('materials').all()
        data = []
        for cat in categories:
            materials = cat.materials.filter(is_active=True)
            data.append({
                'id':          cat.id,
                'name':        cat.name,
                'icon':        cat.icon,
                'description': cat.description,
                'materials': [
                    {
                        'id':          m.id,
                        'name':        m.name,
                        'description': m.description,
                        'price':       str(m.price),
                        'image':       request.build_absolute_uri(m.image.url) if m.image else None,
                    }
                    for m in materials
                ]
            })
        return Response(data)


