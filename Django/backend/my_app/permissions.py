# my_app/permissions.py
# my_app/permissions.py
from rest_framework import permissions

# my_app/permissions.py
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # This will print to your runserver terminal
        print(f"DEBUG: User: {request.user}, Is Staff: {getattr(request.user, 'is_staff', False)}")
        
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)
