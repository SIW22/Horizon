# Generated by Django 3.0.6 on 2020-05-18 17:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0010_auto_20200518_1637'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='friends',
            field=models.ManyToManyField(blank=True, related_name='_profile_friends_+', to='main_app.Profile'),
        ),
    ]
