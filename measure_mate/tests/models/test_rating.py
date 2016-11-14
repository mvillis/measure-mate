from django.test import TestCase

from measure_mate.tests.factories import TemplateFactory, AttributeFactory, RatingFactory


class RatingTestCases(TestCase):
    def test_creation_of_rating(self):
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        rating = RatingFactory(attribute=attribute, rank=1)
        rating.clean()
        self.assertEqual("%s - %s - %s" % (template.name, attribute.name, rating.name), str(rating))
