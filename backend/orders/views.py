"""
==================================================
  🧠 orders/views.py
==================================================
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Order
from .serializers import OrderSerializer
from .models import Order, Invoice
from designs.models import Material


class OrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders     = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'message': 'تم إنشاء الطلب ✅', 'order': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
            return Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return Response({'error': 'الطلب غير موجود'}, status=status.HTTP_404_NOT_FOUND)
class InvoiceView(APIView):
    """
    GET /api/orders/<id>/invoice/   → عرض الفاتورة
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            order   = Order.objects.get(pk=pk, user=request.user)
            invoice = order.invoice
            materials = order.materials.all()

            data = {
                'invoice_number': invoice.invoice_number,
                'date':           invoice.created_at,
                'customer':       request.user.username,
                'design':         order.design.title,
                'materials': [
                    {
                        'name':     m.material.name,
                        'type':     m.material.get_type_display(),
                        'price':    m.material.price,
                        'quantity': m.quantity,
                        'subtotal': m.subtotal,
                    }
                    for m in materials
                ],
                'fabric_cost': invoice.fabric_cost,
                'thread_cost': invoice.thread_cost,
                'sewing_cost': invoice.sewing_cost,
                'subtotal':    invoice.subtotal,
                'tax_percent': invoice.tax_percent,
                'tax_amount':  invoice.tax_amount,
                'total':       invoice.total,
            }
            return Response(data)
        except Order.DoesNotExist:
            return Response({'error': 'الطلب غير موجود'}, status=404)
        except Invoice.DoesNotExist:
            return Response({'error': 'الفاتورة غير موجودة بعد'}, status=404)


class MaterialListView(APIView):
    """
    GET /api/designs/materials/   → جلب كل المواد للزبون
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        fabric  = Material.objects.filter(type='fabric',  is_active=True)
        thread  = Material.objects.filter(type='thread',  is_active=True)
        sewing  = Material.objects.filter(type='sewing',  is_active=True)
        color   = Material.objects.filter(type='color',   is_active=True)

        def serialize(items):
            return [{'id': i.id, 'name': i.name, 'price': i.price, 'description': i.description} for i in items]

        return Response({
            'fabric': serialize(fabric),
            'thread': serialize(thread),
            'sewing': serialize(sewing),
            'color':  serialize(color),
        })
# ==================================================
#  orders/views.py — أضف هذا في نهاية الملف
# ==================================================
from .models import Order, Invoice, OrderMaterial
from designs.models import Material
from django.core.mail import send_mail
from django.conf import settings


class CreateOrderWithMaterialsView(APIView):
    """
    POST /api/orders/create/
    إنشاء طلب مع المواد المختارة + فاتورة تلقائية
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        design_id  = request.data.get('design_id')
        quantity   = request.data.get('quantity', 1)
        address    = request.data.get('address', '')
        materials  = request.data.get('materials', [])  # [{ material_id, quantity }]

        if not design_id or not address:
            return Response({'error': 'بيانات ناقصة'}, status=400)

        try:
            from designs.models import Design
            design = Design.objects.get(id=design_id)

            # إنشاء الطلب
            order = Order.objects.create(
                user     = request.user,
                design   = design,
                quantity = quantity,
                address  = address,
                total    = 0,  # سيُحسب بعدين
            )

            # إضافة المواد
            for m in materials:
                material = Material.objects.get(id=m['material_id'])
                OrderMaterial.objects.create(
                    order    = order,
                    material = material,
                    quantity = m.get('quantity', 1)
                )

            # إنشاء الفاتورة تلقائياً
            invoice = Invoice.objects.create(order=order)

            # تحديث الإجمالي
            order.total = invoice.total
            order.save()

            # إرسال الفاتورة على الإيميل
            self._send_invoice_email(request.user, invoice)

            return Response({
                'message':        'تم إنشاء الطلب والفاتورة ✅',
                'order_id':       order.id,
                'invoice_number': invoice.invoice_number,
                'invoice':        self._serialize_invoice(invoice),
            }, status=201)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def _serialize_invoice(self, invoice):
        return {
            'invoice_number': invoice.invoice_number,
            'date':           invoice.created_at.strftime('%Y-%m-%d'),
            'customer':       invoice.order.user.username,
            'email':          invoice.order.user.email,
            'design':         invoice.order.design.title,
            'quantity':       invoice.order.quantity,
            'design_price':   str(invoice.design_price),
            'materials': [
                {
                    'name':     m.material.name,
                    'category': m.material.category.name,
                    'price':    str(m.material.price),
                    'quantity': m.quantity,
                    'subtotal': str(m.subtotal),
                }
                for m in invoice.order.order_materials.all()
            ],
            'materials_total': str(invoice.materials_total),
            'subtotal':        str(invoice.subtotal),
            'tax_percent':     str(invoice.tax_percent),
            'tax_amount':      str(invoice.tax_amount),
            'total':           str(invoice.total),
            'notes':           invoice.notes,
        }

    def _send_invoice_email(self, user, invoice):
        try:
            subject = f"فاتورة طلبك #{invoice.invoice_number} — Fashion AI"
            message = f"""
مرحباً {user.username}،

تم استلام طلبك بنجاح ✅

رقم الفاتورة: {invoice.invoice_number}
التصميم: {invoice.order.design.title}
الإجمالي: {invoice.total} ر.س

شكراً لاختيارك Fashion AI
            """
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except:
            pass


class InvoiceDetailView(APIView):
    """
    GET /api/orders/<id>/invoice/
    جلب تفاصيل الفاتورة
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            order   = Order.objects.get(pk=pk, user=request.user)
            invoice = order.invoice
            return Response(CreateOrderWithMaterialsView()._serialize_invoice(invoice))
        except Order.DoesNotExist:
            return Response({'error': 'الطلب غير موجود'}, status=404)
        except Invoice.DoesNotExist:
            return Response({'error': 'الفاتورة غير موجودة'}, status=404)    