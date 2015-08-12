# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('measure-mate', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='attribute',
            old_name='discipline',
            new_name='template',
        ),
    ]
