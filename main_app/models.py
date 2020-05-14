from django.db import models
from datetime import date
from django.contrib.auth.models import User

# Create your models here.

PERMISSIONS = (
    (1, 'Admin'),
    (2, 'Read/Write'),
    (3, 'Read')
)


class Event(models.Model):
    title = models.CharField(max_length=255)
    where = models.CharField(max_length=255)
    start_date = models.DateField()
    # If end date is blank, use start_date
    end_date = models.DateField()

    def __str__(self):
        return f"{self.title} - {self.start_date}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture_url = models.URLField(null=True)


class Profile_to_Event_rel(models.Model):

    class Event_Permissions(models.IntegerChoices):
        ADMIN = 1
        READWRITE = 2
        READ = 3

    profile_id = models.ForeignKey(Profile, on_delete=models.CASCADE)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    permission_level = models.IntegerField(choices=Event_Permissions.choices)
