# myapp/models.py
from django.db import models

class Item(models.Model):
    # CharField is for short text (like a title)
    name = models.CharField(max_length=100)
    
    # TextField is for longer content (like a description)
    description = models.TextField(blank=True, null=True)
    
    # BooleanField is great for 'completed' or 'active' status
    is_completed = models.BooleanField(default=False)
    
    # DateTimeField with auto_now_add sets the time exactly when created
    created_at = models.DateTimeField(auto_now_add=True)

    # This helper makes the item readable in the Django Admin panel
    def __str__(self):
        return self.name
