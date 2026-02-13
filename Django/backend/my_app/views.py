# my_app/views.py
from rest_framework import generics
from .models import Item
from .serializers import ItemSerializer
from .permissions import IsAdminOrReadOnly

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# 1. Custom Serializer to include "is_admin" in the response
class MyTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add the user's admin status to the response
        data['is_admin'] = self.user.is_staff 
        data['username'] = self.user.username
        return data

# 2. The View the frontend will call
class LoginView(TokenObtainPairView):
    serializer_class = MyTokenSerializer
class ItemListCreateView(generics.ListCreateAPIView):
    # REMOVE authentication_classes = [] 
    # Use SessionAuthentication to recognize the logged-in admin
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

# my_app/views.py
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# my_app/views.py
@method_decorator(csrf_exempt, name='dispatch')
class ItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    # Use your new custom class instead of the standard SessionAuthentication
    queryset = Item.objects.all()
    serializer_class = ItemSerializer



# my_app/views.py
from rest_framework.decorators import api_view, permission_classes, authentication_classes # Add this
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication # Add this import




# my_app/views.py
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user is not None:
        login(request, user)
        get_token(request) # Ensure CSRF cookie is sent
        return Response({"username": user.username, "is_admin": user.is_staff})
    return Response({"detail": "Invalid credentials"}, status=401)




@api_view(['POST'])
@authentication_classes([]) # This skips the CSRF check during logout
@permission_classes([AllowAny]) # Allows the request to reach the logout logic
def logout_view(request):
    logout(request)
    return Response({"detail": "Logged out successfully"})
