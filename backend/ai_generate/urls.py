from django.urls import path
from .views import ChatDesignView, GenerateDesignView, GenerateVariationsView

urlpatterns = [
    path('chat/',       ChatDesignView.as_view()),
    path('generate/',   GenerateDesignView.as_view()),
    path('variations/', GenerateVariationsView.as_view()),
]