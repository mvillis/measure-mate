# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-12-02 01:58
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('measure_mate', '0030_auto_20161114_0702'),
    ]

    operations = [
        migrations.CreateModel(
            name='Announcement',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name=b'Announcement ID')),
                ('title', models.CharField(max_length=50, unique=True, verbose_name=b'Announcement Title')),
                ('enabled', models.BooleanField(default=1, verbose_name=b'Announcement Enabled')),
                ('content', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Announcements',
            },
        ),
    ]
