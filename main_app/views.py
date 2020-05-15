from django.shortcuts import render, redirect
from .models import Event, Profile, Profile_to_Event_rel
from .forms import EventForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm

# Create your views here.


def home(request):
    return render(request, 'home.html')

@login_required 
def events_index(request):
    profile = Profile.objects.get(user = request.user)
    events = Event.objects.filter(profile_to_event_rel__profile_id=profile.id)
    return render(request, 'events/index.html', {'events': events})

@login_required
def events_new(request):
    if request.method == 'POST':
        form = EventForm(request.POST)
        if form.is_valid():
            event = form.save()
            profile = Profile.objects.get(user = request.user)
            new_rel = Profile_to_Event_rel(profile_id=profile, event_id=event, permission_level=1)
            new_rel.save()
            return redirect('index')
        
    else:
        form = EventForm()
        context = {'form': form}
        return render(request, 'events/new.html', context)

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # This creates our new Profile linked to the User object
            new_profile = Profile(user=user)
            new_profile.save()
            login(request, user)
            return redirect('login')  
        else:
            pass
    form = UserCreationForm()
    context = {'form': form}
    return render(request, 'registration/signup.html', context)
