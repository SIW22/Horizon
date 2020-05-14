from django.shortcuts import render
from .models import Event
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm

# Create your views here.


def home(request):
    return render(request, 'home.html')


def events_index(request):
    events = Event.objects.all()
    return render(request, 'events/index.html', {'events': events})
