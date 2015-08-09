from django.db import models


class Discipline(models.Model):
    name = models.CharField(max_length=256)
    short_desc = models.CharField(max_length=256)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Disciplines"


class Capability(models.Model):
    class Meta:
        verbose_name_plural = "Capabilities"

    name = models.CharField(max_length=256)
    desc = models.TextField()
    discipline = models.ForeignKey(Discipline, related_name='capabilities')

    def __str__(self):
        return self.discipline.name + " - " + self.name


class Level(models.Model):
    class Meta:
        unique_together = ("name", "rank", "capability")
        verbose_name_plural = "Levels"

    capability = models.ForeignKey(Capability, related_name='levels')
    name = models.CharField(max_length=256)
    desc = models.TextField()
    rank = models.IntegerField(default=1)

    def __str__(self):
        return (self.capability.name + " - " +
                str(self.rank) + " - " +
                self.name)
