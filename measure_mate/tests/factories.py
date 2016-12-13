import string

import factory
import factory.fuzzy

from measure_mate.models import Template, Attribute, Tag, Team, Assessment, Measurement, Rating, Announcement


class TemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Template
        django_get_or_create = ('name', 'short_desc')

    name = factory.Sequence(lambda n: 'Template %d' % n)
    short_desc = 'Test Template Short Description'


class AttributeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Attribute
        django_get_or_create = ('name', 'desc', 'template')

    name = factory.Sequence(lambda n: 'Attribute %d' % n)
    template = factory.SubFactory(TemplateFactory)
    desc = 'This is an attribute.'


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag

    name = factory.Sequence(lambda n: 'Tag-%d' % n)


class TeamFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Team

    name = factory.Sequence(lambda n: 'Team %d' % n)
    short_desc = 'Test Team Short Description'

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            # A list of groups were passed in, use them
            for tag in extracted:
                self.tags.add(tag)


class AssessmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Assessment

    template = factory.SubFactory(TemplateFactory)
    team = factory.SubFactory(TeamFactory)

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            # A list of groups were passed in, use them
            for tag in extracted:
                self.tags.add(tag)


class RatingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Rating

    attribute = factory.SubFactory(AttributeFactory)
    name = factory.Sequence(lambda n: 'Rating %d' % n)
    desc = "This is a really good description."
    rank = factory.Sequence(lambda n: n)


class MeasurementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Measurement

    assessment = factory.SubFactory(AssessmentFactory)
    rating = factory.SubFactory(RatingFactory)
    observations = factory.fuzzy.FuzzyText(length=256, chars=string.ascii_letters)


class AnnouncementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Announcement

    title = factory.Sequence(lambda n: 'Announcement-%d' % n)
    content = "This is the really good content for %s\n" % title
