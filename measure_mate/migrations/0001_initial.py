# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assessment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'verbose_name_plural': 'Assessments',
            },
        ),
        migrations.CreateModel(
            name='Attribute',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('desc', models.TextField()),
            ],
            options={
                'verbose_name_plural': 'attributes',
            },
        ),
        migrations.CreateModel(
            name='Measurement',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('observations', models.TextField()),
                ('assessment', models.ForeignKey(related_name='measurements', to='measure_mate.Assessment', on_delete=models.CASCADE)),
            ],
            options={
                'verbose_name_plural': 'Measurements',
            },
        ),
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('desc', models.TextField()),
                ('rank', models.IntegerField(default=1)),
                ('attribute', models.ForeignKey(related_name='ratings', to='measure_mate.Attribute', on_delete=models.CASCADE)),
            ],
            options={
                'verbose_name_plural': 'Ratings',
            },
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
            ],
            options={
                'verbose_name_plural': 'Tags',
            },
        ),
        migrations.CreateModel(
            name='Template',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('short_desc', models.CharField(max_length=256)),
            ],
            options={
                'verbose_name_plural': 'Templates',
            },
        ),
        migrations.AddField(
            model_name='measurement',
            name='rating',
            field=models.ForeignKey(related_name='measurements', to='measure_mate.Rating', on_delete=models.PROTECT),
        ),
        migrations.AddField(
            model_name='attribute',
            name='discipline',
            field=models.ForeignKey(related_name='attributes', to='measure_mate.Template', on_delete=models.CASCADE),
        ),
        migrations.AddField(
            model_name='assessment',
            name='tags',
            field=models.ManyToManyField(to='measure_mate.Tag'),
        ),
        migrations.AddField(
            model_name='assessment',
            name='template',
            field=models.ForeignKey(related_name='assessments', to='measure_mate.Template', on_delete=models.PROTECT),
        ),
        migrations.AlterUniqueTogether(
            name='rating',
            unique_together=set([('name', 'rank', 'attribute')]),
        ),
    ]
