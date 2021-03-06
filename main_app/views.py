from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django.core import serializers
from .models import Event, Profile, Profile_to_Event_rel
from .models import Event, Profile, Profile_to_Event_rel
from django.contrib.auth.models import User
from .forms import EventForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.core.mail import send_mail

# Create your views here.


def home(request):
    if(request.user):
        return redirect('index')
    else:
        return redirect('login')

# EVENT VIEWS


def about(request):
    return render(request, 'about.html')


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
def get_next_event(request, start_date):
    profile = Profile.objects.get(user=request.user)
    events = Event.objects.filter(
        profile_to_event_rel__profile_id=profile.id).filter(Q(start_date__gte=start_date))
    print(list(events)[0])
    events_json = serializers.serialize('json', list(events)[0])

    # return JsonResponse(events_json, safe=False)
    return JsonResponse({"status": 200}, safe=False)


@login_required
def events_new(request):
    if request.method == 'POST':
        form = EventForm(request.POST)
        if form.is_valid():
            event = form.save(commit=False)
            event.end_date = event.start_date
            event.save()
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
def events_new_selected(request, selected_date):
    if request.method == 'POST':
        form = EventForm(request.POST)
        if form.is_valid():
            event = form.save(commit=False)
            event.end_date = event.start_date
            event.save()
            profile = Profile.objects.get(user=request.user)
            new_rel = Profile_to_Event_rel(
                profile_id=profile, event_id=event, permission_level=1)
            new_rel.save()
            return redirect('index')
    else:
        print("You did it")
        data = {'start_date': selected_date}
        form = EventForm(initial=data)
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


# FRIEND REALTED VIEWS
@login_required
def friends_index(request):
    profile = Profile.objects.get(user=request.user)
    print(profile.id)
    friends = []
    for user in profile.friends.all():
        friends.append(User.objects.get(id=user.id))
    context = {'profile': profile, 'friends': friends}
    return render(request, 'profile/index.html', context=context)


# AUTH RELATED VIEWS


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
