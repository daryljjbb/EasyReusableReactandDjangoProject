# myapp/urls.py
from django.urls import path
from .views import ItemListCreateView, login_view, logout_view, update_item


urlpatterns = [
    path('items/', ItemListCreateView.as_view(), name='item-list'), # matches request('GET', 'items/')
      # ADD THIS LINE: This matches the URL your React app is trying to hit
    path('items/update/<int:item_id>/', update_item, name='update-item'),
     
         # ADD THESE TWO LINES:
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'), # for updates/deletes
]
