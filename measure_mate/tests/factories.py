import factory
from measure_mate.models import Template, Attribute


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
