from django import forms
from .models import Event

class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ('title', 'where', 'start_date', 'end_date')

class EmailForm(forms.ModelForm):
    Email = forms.EmailField()
    
    def __str__(self):
        return self.Email

