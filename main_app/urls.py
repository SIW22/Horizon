from django.urls import path
from . import views

urlpatterns = [
path('', views.home, name='home'),
path('events/', views.events_index, name='index'),
#Auth related paths
path('accounts/signup', views.signup, name='signup')
]