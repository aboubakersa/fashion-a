"""
==================================================
  🔗 orders/urls.py
==================================================
"""
from django.urls import path
from .views import OrderListView, OrderDetailView
from .views import OrderListView, OrderDetailView, InvoiceView, CreateOrderWithMaterialsView, InvoiceDetailView

urlpatterns = [
    path('',          OrderListView.as_view()),    # GET/POST /api/orders/
    path('<int:pk>/', OrderDetailView.as_view()),  
    path('<int:pk>/invoice/', InvoiceView.as_view()),
    path('create/',             CreateOrderWithMaterialsView.as_view()),
    path('<int:pk>/invoice/',   InvoiceDetailView.as_view()),             # ← أضف    # ← أضف# GET      /api/orders/1/
]
