# myapp/urls.py
from django.urls import path
from .views import ItemListCreateView, ItemDetailView, login_view, logout_view

urlpatterns = [
    path('items/', ItemListCreateView.as_view(), name='item-list'), # matches request('GET', 'items/')
    path('items/<int:pk>/', ItemDetailView.as_view(), name='item-detail'),
     
         # ADD THESE TWO LINES:
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'), # for updates/deletes
]
