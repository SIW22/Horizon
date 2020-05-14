from django.shortcuts import render, redirect
from .models import Event, Profile
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm

# Create your views here.


def home(request):
    return render(request, 'home.html')

@login_required
def events_index(request):
    events = Event.objects.all()
    return render(request, 'events/index.html', {'events': events})

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
