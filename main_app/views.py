from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django.core import serializers
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
    profile = Profile.objects.get(user=request.user)
    events = Event.objects.filter(profile_to_event_rel__profile_id=profile.id)
    return render(request, 'events/index.html', {'events': events})


@login_required
def get_events(request, start_date, end_date):
    profile = Profile.objects.get(user=request.user)
    events = Event.objects.filter(profile_to_event_rel__profile_id=profile.id).filter(
        Q(start_date__gte=start_date) & Q(end_date__lte=end_date))
    events_json = serializers.serialize('json', events)
    return JsonResponse(events_json, safe=False)


@login_required
def events_new(request):
    if request.method == 'POST':
        form = EventForm(request.POST)
        if form.is_valid():
            event = form.save()
            profile = Profile.objects.get(user=request.user)
            new_rel = Profile_to_Event_rel(
                profile_id=profile, event_id=event, permission_level=1)
            new_rel.save()
            return redirect('index')
    else:
        form = EventForm()
        context = {'form': form}
        return render(request, 'events/new.html', context)


@login_required
def edit_event(request, event_id):
    event = Event.objects.get(id=event_id)
    if request.method == 'POST':
        form = EventForm(request.POST, instance=event)
        if form.is_valid():
            event = form.save()
            return redirect('index')
    else:
        form = EventForm(instance=event)
        context = {"event": event, "form": form}
    return render(request, 'events/edit.html', context)


@login_required
def remove_event(request, event_id):
    if request.method == 'DELETE':
        event = Event.objects.get(id=event_id)
        event.delete()
        return JsonResponse({"status": 200, "eventId": event_id})
    else:
        return JsonResponse({"status": 401, "message": "Whoops - it borked"})


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
