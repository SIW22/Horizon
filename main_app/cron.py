from django.core.mail import send_mail

# recievers = []
# for user in Users.objects.all():
#     recievers.append(user.email)

def my_cron_job():
    send_mail(
    'Test email',
    'Good things are on the horizon! Be sure to check what events you have coming up',
    'noreply.autohorizon',
    'jochoa1011@gmail.com' # will get changed to recievers
    fail_silently=False,
)