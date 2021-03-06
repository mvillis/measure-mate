# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-07 04:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('measure_mate', '0006_auto_20160107_0238'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='attribute',
            options={'ordering': ['rank', 'pk'], 'verbose_name_plural': 'Attributes'},
        ),
        migrations.AlterModelOptions(
            name='rating',
            options={'ordering': ['rank', 'pk'], 'verbose_name_plural': 'Ratings'},
        ),
        migrations.AlterModelOptions(
            name='tag',
            options={'ordering': ['name'], 'verbose_name_plural': 'Tags'},
        ),
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(max_length=256, unique=True),
        ),
        migrations.AlterField(
            model_name='template',
            name='name',
            field=models.CharField(max_length=256, unique=True),
        ),
        migrations.AlterUniqueTogether(
            name='attribute',
            unique_together=set([('template', 'name')]),
        ),
        migrations.AlterUniqueTogether(
            name='rating',
            unique_together=set([('attribute', 'name')]),
        ),
    ]
