from django.test import TestCase

from measure_mate.tests.factories import *


class MeasurementTestCases(TestCase):
    def test_creation_of_measurement(self):
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        assessment = AssessmentFactory(template=template)
        rating = RatingFactory(attribute=attribute)
        measurement = MeasurementFactory(assessment=assessment, rating=rating)
        self.assertEqual("%s - %s" % (str(assessment), str(rating)), str(measurement))
