# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-29 02:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('measure_mate', '0023_auto_20160321_1300'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action',
            name='review_date',
            field=models.DateField(null=True),
        ),
    ]
