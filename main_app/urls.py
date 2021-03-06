from django.urls import path
from . import views

urlpatterns = [
    # Events
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('events/', views.events_index, name='index'),
    path('events/new', views.events_new, name='events_new'),
    path('events/new/<str:selected_date>/',
         views.events_new_selected, name="events_new_index"),
    path('events/<int:event_id>/edit', views.edit_event, name='edit_event'),
    path('events/<int:event_id>/remove_event',
         views.remove_event, name='remove_event'),
    path('events/get/<str:start_date>/<str:end_date>',
         views.get_events, name='get_events'),
    path('events/get-single/<str:start_date>',
         views.get_next_event, name='get_next_event'),
    # Friends
    path('profile/', views.friends_index, name='friends_index'),
    # Auth related paths
    path('accounts/signup', views.signup, name='signup'),
]
