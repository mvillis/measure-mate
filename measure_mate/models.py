import re

from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _


class Template(models.Model):
    class Meta:
        verbose_name_plural = "Templates"

    id = models.AutoField(primary_key=True, verbose_name="Template ID")
    name = models.CharField(max_length=256, unique=True,
                            verbose_name="Template Name")
    short_desc = models.CharField(max_length=256)
    taggable = models.BooleanField(default=0)
    enabled = models.BooleanField(default=1)

    def __unicode__(self):
        return self.name


class Attribute(models.Model):
    class Meta:
        verbose_name_plural = "Attributes"
        unique_together = ("template", "name")
        ordering = ['template', 'rank', 'pk']

    id = models.AutoField(primary_key=True, verbose_name="Attribute ID")
    name = models.CharField(max_length=256, verbose_name="Attribute Name")
    desc = models.TextField()
    desc_class = models.CharField(max_length=256, default="", blank=True)
    template = models.ForeignKey(Template, related_name='attributes')
    rank = models.IntegerField(default=1)

    def __unicode__(self):
        return str(self.template) + " - " + self.name


class Rating(models.Model):
    class Meta:
        verbose_name_plural = "Ratings"
        unique_together = ("attribute", "name")
        ordering = ['attribute', 'rank', 'pk']

    id = models.AutoField(primary_key=True, verbose_name="Rating ID")
    attribute = models.ForeignKey(Attribute, related_name='ratings')
    name = models.CharField(max_length=256, verbose_name="Rating Name")
    desc = models.TextField()
    desc_class = models.CharField(max_length=256, default="", blank=True)
    rank = models.IntegerField(default=1)
    colour = models.CharField(max_length=256, null=True, blank=True)

    def __unicode__(self):
        return str(self.attribute) + " - " + self.name


# Throws a ValidationError if uppercase characters are found
uppercase_re = re.compile(r'[A-Z]')
validate_lowercase = RegexValidator(
    regex = uppercase_re,
    message = _(u"Enter a valid 'slug' consisting of lowercase letters, numbers, underscores or hyphens."),
    code = 'invalid',
    inverse_match = True
)


class Tag(models.Model):
    class Meta:
        verbose_name_plural = "Tags"
        ordering = ['name']

    id = models.AutoField(primary_key=True, verbose_name="Tag ID")
    name = models.SlugField(unique=True, verbose_name="Tag Name", validators=[validate_lowercase])

    def __unicode__(self):
        return self.name


class Team(models.Model):
    class Meta:
        verbose_name_plural = "Teams"
        ordering = ['pk']

    id = models.AutoField(primary_key=True, verbose_name="Team ID")
    name = models.CharField(max_length=256, unique=True, verbose_name="Team Name")
    short_desc = models.CharField(max_length=256)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag,)

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

    id = models.AutoField(primary_key=True, verbose_name="Assessment ID")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=128,
        choices=STATUS_CHOICES,
        default='TODO',
        blank=False,
    )
    template = models.ForeignKey(Template, related_name="assessments")
    tags = models.ManyToManyField(Tag,)
    team = models.ForeignKey(Team, related_name="assessments")

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
