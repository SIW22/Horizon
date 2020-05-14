from django.urls import path
from . import views

urlpatterns = [
path('', views.home, name='home'),
path('events/', views.events_index, name='index'),
path('events/new', views.events_new, name='events_new'),
#Auth related paths
path('accounts/signup', views.signup, name='signup')
]