# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Capability',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('desc', models.TextField()),
            ],
            options={
                'verbose_name_plural': 'Capabilities',
            },
        ),
        migrations.CreateModel(
            name='Discipline',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('short_desc', models.CharField(max_length=256)),
            ],
            options={
                'verbose_name_plural': 'Disciplines',
            },
        ),
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('desc', models.TextField()),
                ('rank', models.IntegerField(default=1)),
                ('capability', models.ForeignKey(related_name='levels', to='measure-mate.Capability')),
            ],
            options={
                'verbose_name_plural': 'Levels',
            },
        ),
        migrations.AddField(
            model_name='capability',
            name='discipline',
            field=models.ForeignKey(related_name='capabilities', to='measure-mate.Discipline'),
        ),
        migrations.AlterUniqueTogether(
            name='level',
            unique_together=set([('name', 'rank', 'capability')]),
        ),
    ]
