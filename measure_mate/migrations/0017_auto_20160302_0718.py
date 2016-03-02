# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-03-02 07:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('measure_mate', '0016_auto_20160229_0240'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='attribute',
            options={'ordering': ['template', 'rank', 'pk'], 'verbose_name_plural': 'Attributes'},
        ),
        migrations.AlterModelOptions(
            name='rating',
            options={'ordering': ['attribute', 'rank', 'pk'], 'verbose_name_plural': 'Ratings'},
        ),
        migrations.AddField(
            model_name='rating',
            name='colour',
            field=models.CharField(max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='rating',
            name='name',
            field=models.CharField(max_length=256, verbose_name=b'Rating Name'),
        ),
    ]
