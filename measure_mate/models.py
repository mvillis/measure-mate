from __future__ import unicode_literals

import re
import sys

from builtins import str, object
from future.utils import python_2_unicode_compatible

from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _


@python_2_unicode_compatible
class Template(models.Model):
    class Meta(object):
        verbose_name_plural = "Templates"
        ordering = ['pk', ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256, unique=True)
    taggable = models.BooleanField(default=0)
    enabled = models.BooleanField(default=1, db_index=True)
    short_desc = models.CharField(max_length=256, verbose_name="Description")

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class Attribute(models.Model):
    class Meta(object):
        verbose_name_plural = "Attributes"
        unique_together = ("template", "name")
        ordering = ['template', 'rank', 'pk']

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256)
    template = models.ForeignKey(Template, related_name='attributes', on_delete=models.CASCADE)
    rank = models.IntegerField(default=1, db_index=True)
    desc = models.TextField(verbose_name="Description")
    desc_class = models.CharField(max_length=256, default="", blank=True, verbose_name="Description CSS Class")

    def __str__(self):
        return str(self.template) + " - " + self.name


@python_2_unicode_compatible
class Rating(models.Model):
    class Meta(object):
        verbose_name_plural = "Ratings"
        unique_together = ("attribute", "name")
        ordering = ['attribute', 'rank', 'pk']

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256)
    attribute = models.ForeignKey(Attribute, related_name='ratings', on_delete=models.CASCADE)
    rank = models.IntegerField(default=1, db_index=True)
    colour = models.CharField(max_length=256, null=True, blank=True)
    desc = models.TextField(verbose_name="Description")
    desc_class = models.CharField(max_length=256, default="", blank=True, verbose_name="Description CSS Class")

    def __str__(self):
        return str(self.attribute) + " - " + self.name


tag_re = re.compile(r'^[a-z0-9][a-z0-9_-]*[a-z0-9]$')
validate_tag = RegexValidator(
    regex=tag_re,
    message=_(
        u"Enter a valid 'slug' consisting of lowercase letters, numbers, underscores or hyphens; starting and ending with letters or numbers."),
    code='invalid',
)


@python_2_unicode_compatible
class Tag(models.Model):
    class Meta(object):
        verbose_name_plural = "Tags"
        ordering = ['name']

    id = models.AutoField(primary_key=True)
    name = models.SlugField(unique=True, validators=[validate_tag], db_index=True)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class Team(models.Model):
    class Meta(object):
        verbose_name_plural = "Teams"
        ordering = ['pk']

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256, unique=True)
    short_desc = models.CharField(max_length=256, verbose_name="Description")
    tags = models.ManyToManyField(Tag, )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class Assessment(models.Model):
    class Meta(object):
        verbose_name_plural = "Assessments"
        ordering = ['-pk']

    STATUS_CHOICES = (
        ('TODO', 'To Do'),
        ('DONE', 'Done'),
    )

    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, related_name="assessments", db_index=True, on_delete=models.CASCADE)
    template = models.ForeignKey(Template, related_name="assessments", on_delete=models.PROTECT)
    status = models.CharField(
        max_length=128,
        choices=STATUS_CHOICES,
        default='TODO',
        blank=False,
    )
    tags = models.ManyToManyField(Tag, )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.team) + " - " + str(self.template) + " - " + str(self.id)


@python_2_unicode_compatible
class Measurement(models.Model):
    class Meta(object):
        unique_together = (("assessment", "attribute"),)
        verbose_name_plural = "Measurements"

    assessment = models.ForeignKey(Assessment, related_name="measurements", on_delete=models.CASCADE)
    attribute = models.ForeignKey(Attribute, related_name="measurements", on_delete=models.PROTECT)
    rating = models.ForeignKey(Rating, related_name="measurements", on_delete=models.PROTECT)
    target_rating = models.ForeignKey(Rating, blank=True, null=True, related_name="target_measurements", on_delete=models.PROTECT)
    observations = models.TextField(null=True, blank=True)
    action = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.assessment) + " - " + self.rating.attribute.name + " - " + self.rating.name

    def clean(self):
        if self.assessment.template.id != self.attribute.template.id:
            raise ValidationError(_('Measurement attributes must be for the same template as the assessment'))

        if self.attribute.id != self.rating.attribute.id:
            raise ValidationError(_('Measurement rating must be for the same attribute'))
        if self.assessment.template.id != self.rating.attribute.template.id:
            raise ValidationError(_('Measurement ratings must be for the same template as the assessment'))

        if self.target_rating is not None:
            if self.attribute.id != self.target_rating.attribute.id:
                raise ValidationError(_('Measurement target rating must be for the same attribute'))
            if self.assessment.template.id != self.target_rating.attribute.template.id:
                raise ValidationError(_('Measurement target ratings must be for the same template as the assessment'))


@python_2_unicode_compatible
class Announcement(models.Model):
    class Meta(object):
        verbose_name_plural = "Announcements"

    STYLE_CHOICES = (
        ('default', 'Default'),
        ('primary', 'Primary'),
        ('success', 'Success'),
        ('info', 'Success'),
        ('warning', 'Warning'),
        ('danger', 'Danger'),
    )

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50, unique=True)
    enabled = models.BooleanField(default=1, db_index=True)
    style = models.CharField(max_length=50, choices=STYLE_CHOICES, default='warning')
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.title)
