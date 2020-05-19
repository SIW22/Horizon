from django.core.mail import send_mail

def my_cron_job():
    send_mail(
    'Test email',
    'Good things are on the horizon! Be sure to check what events you have coming up',
    'noreply.autohorizon',
    ['jochoa1011@gmail.com'],
    fail_silently=False,
)