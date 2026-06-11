"""
==================================================
  🔗 designs/urls.py
==================================================
"""
from django.urls import path
from .views import DesignListView, DesignDetailView, MyDesignsView, MaterialListView

urlpatterns = [
    path('',          DesignListView.as_view()),    # GET/POST /api/designs/
    path('my/',       MyDesignsView.as_view()),     # GET      /api/designs/my/
    path('<int:pk>/', DesignDetailView.as_view()), 
    path('materials/',  MaterialListView.as_view()),  # GET/PUT/DELETE /api/designs/1/
]
