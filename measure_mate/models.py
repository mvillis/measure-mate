import re

from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings


class Template(models.Model):
    class Meta:
        verbose_name_plural = "Templates"
        ordering = ['pk',]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256, unique=True)
    taggable = models.BooleanField(default=0)
    enabled = models.BooleanField(default=1)
    short_desc = models.CharField(max_length=256, verbose_name="Description")

    def __unicode__(self):
        return self.name


class Attribute(models.Model):
    class Meta:
        verbose_name_plural = "Attributes"
        unique_together = ("template", "name")
        ordering = ['template', 'rank', 'pk']

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256)
    template = models.ForeignKey(Template, related_name='attributes')
    rank = models.IntegerField(default=1)
    desc = models.TextField(verbose_name="Description")
    desc_class = models.CharField(max_length=256, default="", blank=True, verbose_name="Description CSS Class")

    def __unicode__(self):
        return str(self.template) + " - " + self.name


class Rating(models.Model):
    class Meta:
        verbose_name_plural = "Ratings"
        unique_together = ("attribute", "name")
        ordering = ['attribute', 'rank', 'pk']

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256)
    attribute = models.ForeignKey(Attribute, related_name='ratings')
    rank = models.IntegerField(default=1)
    colour = models.CharField(max_length=256, null=True, blank=True)
    desc = models.TextField(verbose_name="Description")
    desc_class = models.CharField(max_length=256, default="", blank=True, verbose_name="Description CSS Class")

    def __unicode__(self):
        return str(self.attribute) + " - " + self.name


tag_re = re.compile(r'^[a-z0-9][a-z0-9_-]*[a-z0-9]$')
validate_tag = RegexValidator(
    regex = tag_re,
    message = _(u"Enter a valid 'slug' consisting of lowercase letters, numbers, underscores or hyphens; starting and ending with letters or numbers."),
    code = 'invalid',
)


class Tag(models.Model):
    class Meta:
        verbose_name_plural = "Tags"
        ordering = ['name']

    id = models.AutoField(primary_key=True)
    name = models.SlugField(unique=True, validators=[validate_tag])

    def __unicode__(self):
        return self.name


class Team(models.Model):
    class Meta:
        verbose_name_plural = "Teams"
        ordering = ['pk']

    id = models.AutoField(primary_key=True, verbose_name="Team ID")
    name = models.CharField(max_length=256, unique=True)
    short_desc = models.CharField(max_length=256, verbose_name="Description")
    tags = models.ManyToManyField(Tag,)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name


class Assessment(models.Model):
    class Meta:
        verbose_name_plural = "Assessments"
        ordering = ['-pk']

    STATUS_CHOICES = (
        ('TODO', 'To Do'),
        ('DONE', 'Done'),
    )

    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, related_name="assessments")
    template = models.ForeignKey(Template, related_name="assessments")
    status = models.CharField(
        max_length=128,
        choices=STATUS_CHOICES,
        default='TODO',
        blank=False,
    )
    tags = models.ManyToManyField(Tag,)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return str(self.team) + " - " + str(self.template) + " - " + str(self.id)


class Measurement(models.Model):
    class Meta:
        unique_together = ("assessment", "rating")
        verbose_name_plural = "Measurements"

    assessment = models.ForeignKey(Assessment, related_name="measurements")
    rating = models.ForeignKey(Rating, related_name="measurements")
    target_rating = models.ForeignKey(Rating, blank=True, null=True, related_name="target_measurements")
    observations = models.TextField(null=True, blank=True)
    action = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return str(self.assessment) + " - " + self.rating.attribute.name + " - " + self.rating.name

    def clean(self):
        if self.assessment.template.id != self.rating.attribute.template.id:
            raise ValidationError(_('Measurement attributes must be for the same template as the assessment'))
        if self.target_rating is not None and self.assessment.template.id != self.target_rating.attribute.template.id:
            raise ValidationError(_('Measurement ratings must be for the same template as the assessment'))


class Announcement(models.Model):
    class Meta:
        verbose_name_plural = "Announcements"

    STYLE_CHOICES = (
        ('Default', 'default'),
        ('Primary', 'primary'),
        ('Success', 'success'),
        ('Info', 'success'),
        ('Warning', 'warning'),
        ('Danger', 'danger'),
    )

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50, unique=True)
    enabled = models.BooleanField(default=1)
    style = models.CharField(max_length=50, choices=STYLE_CHOICES, default='warning')
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return str(self.title)
