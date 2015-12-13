# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('measure_mate', '0002_auto_20150812_0859'),
    ]

    operations = [
        migrations.AddField(
            model_name='assessment',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 12, 14, 13, 27, 985913, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='assessment',
            name='updated',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 12, 14, 13, 41, 12594, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
    ]
