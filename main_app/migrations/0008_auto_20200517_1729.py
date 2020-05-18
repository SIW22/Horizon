# Generated by Django 3.0.6 on 2020-05-17 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0007_auto_20200517_1539'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactForm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('message', models.TextField()),
                ('sender', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=10)),
                ('cc_myself', models.BooleanField(blank=True)),
                ('time', models.DateTimeField(auto_now_add=True, db_index=True)),
            ],
        ),
        migrations.AlterField(
            model_name='profile',
            name='friends',
            field=models.ManyToManyField(related_name='_profile_friends_+', to='main_app.Profile'),
        ),
    ]