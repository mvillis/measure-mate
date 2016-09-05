from django.test import TestCase

from measure_mate.tests.factories import TemplateFactory, AttributeFactory


class AttributeTestCases(TestCase):
    def test_creation_of_attribute(self):
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        self.assertEqual("%s - %s" % (template.name, attribute.name), str(attribute))
