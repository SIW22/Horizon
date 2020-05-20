from django.contrib import admin
from .models import Event, Profile, Profile_to_Event_rel

# Register your models here.
admin.site.register(Event)
admin.site.register(Profile)
admin.site.register(Profile_to_Event_rel)
