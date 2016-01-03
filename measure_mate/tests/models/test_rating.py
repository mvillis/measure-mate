from django.test import TestCase

from measure_mate.tests.factories import *


class RatingTestCases(TestCase):
    def test_creation_of_rating(self):
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        rating = RatingFactory(attribute=attribute, rank=1)
        self.assertEqual("%s - %s - %s" % (attribute.name, 1, rating.name), str(rating))
