import factory
from measure_mate.models import Template, Attribute, Assessment, Tag


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

    name = factory.Sequence(lambda n: 'tag%d' % n)


class AssessmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Assessment

    template = factory.SubFactory(TemplateFactory)

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            # A list of groups were passed in, use them
            for tag in extracted:
                self.tags.add(tag)
