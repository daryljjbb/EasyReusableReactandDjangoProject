from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from .models import Item
from .serializers import ItemSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

# --- 1. SECURITY BYPASS ---
# This class allows us to use Admin permissions without fighting with CSRF tokens
class UnsafeSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return 
    
class MyTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # This sends is_admin back to React so we know what to show
        data['is_admin'] = self.user.is_staff 
        data['username'] = self.user.username
        return data


# --- 2. LOGIN / LOGOUT ---
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([]) 
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user is not None:
        # 1. Generate the JWT Token (The Digital ID Card)
        refresh = RefreshToken.for_user(user)
        
        # 2. Return the token + user info to React
        return Response({
            "token": str(refresh.access_token), # React will save this
            "username": user.username, 
            "is_admin": user.is_staff 
        })
    
    return Response({"detail": "Invalid credentials"}, status=401)

@api_view(['POST'])
@authentication_classes([]) 
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return Response({"detail": "Logged out successfully"})

# --- 3. DATA VIEWS (LIST & DETAIL) ---
class ItemListCreateView(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    # Anyone can see the list
    permission_classes = [AllowAny]

# --- 4. THE EDIT VIEW (The one causing the 403) ---
@api_view(['PUT'])
@authentication_classes([JWTAuthentication]) # Look for the "Digital ID Card"
@permission_classes([IsAdminUser])
def update_item(request, item_id):
    try:
        item = Item.objects.get(id=item_id)
        new_name = request.data.get('name')
        
        if not new_name:
            return Response({"error": "Name is required"}, status=400)
            
        item.name = new_name
        item.save()
        return Response({"message": "Updated successfully!", "new_name": item.name})
    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)