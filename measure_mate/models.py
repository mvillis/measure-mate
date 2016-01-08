from django.db import models


class Template(models.Model):
    class Meta:
        verbose_name_plural = "Templates"

    name = models.CharField(max_length=256, unique=True)
    short_desc = models.CharField(max_length=256)

    def __unicode__(self):
        return self.name


class Attribute(models.Model):
    class Meta:
        verbose_name_plural = "Attributes"
        unique_together = ("template", "name")
        ordering = ['rank', 'pk']

    name = models.CharField(max_length=256)
    desc = models.TextField()
    desc_class = models.TextField(default="")
    template = models.ForeignKey(Template, related_name='attributes')
    rank = models.IntegerField(default=1)

    def __unicode__(self):
        return (self.template.name + " - " +
                self.name)


class Rating(models.Model):
    class Meta:
        verbose_name_plural = "Ratings"
        unique_together = ("attribute", "name")
        ordering = ['rank', 'pk']

    attribute = models.ForeignKey(Attribute, related_name='ratings')
    name = models.CharField(max_length=256)
    desc = models.TextField()
    desc_class = models.TextField(default="")
    rank = models.IntegerField(default=1)

    def __unicode__(self):
        return (self.attribute.name + " - " +
                self.name)


class Tag(models.Model):
    class Meta:
        verbose_name_plural = "Tags"
        ordering = ['name']

    name = models.CharField(max_length=256, unique=True)

    def __unicode__(self):
        return self.name


class Assessment(models.Model):
    class Meta:
        verbose_name_plural = "Assessments"
        ordering = ['-pk']

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    template = models.ForeignKey(Template, related_name="assessments")
    tags = models.ManyToManyField(Tag,)

    def __unicode__(self):
        return self.created.strftime('%Y-%m-%d %H:%M%Z') + " - " + self.template.name


class Measurement(models.Model):
    class Meta:
        unique_together = ("assessment", "rating")
        verbose_name_plural = "Measurements"

    assessment = models.ForeignKey(Assessment, related_name="measurements")
    rating = models.ForeignKey(Rating, related_name="measurements")
    observations = models.TextField()

    def __unicode__(self):
        return str(self.assessment) + " - " + str(self.rating)
