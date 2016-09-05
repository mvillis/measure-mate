from django.test import TestCase

from measure_mate.models import Measurement
from measure_mate.tests.factories import TemplateFactory, AttributeFactory, AssessmentFactory, RatingFactory, MeasurementFactory


class MeasurementTestCases(TestCase):
    def test_creation_of_measurement(self):
        """
        Create a measurement with all fields specified
        """
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        assessment = AssessmentFactory(template=template)
        rating = RatingFactory(attribute=attribute)
        target_rating = RatingFactory(attribute=attribute)
        measurement = MeasurementFactory(assessment=assessment, rating=rating, target_rating=target_rating)
        self.assertEqual(1, Measurement.objects.count())
        self.assertEqual("%s - %s" % (str(assessment), str(rating)), str(measurement))

    def test_creation_of_measurement_no_target(self):
        """
        Should be able to create a measurement without a target_rating
        """
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        assessment = AssessmentFactory(template=template)
        rating = RatingFactory(attribute=attribute)
        measurement = MeasurementFactory(assessment=assessment, rating=rating)
        self.assertEqual(1, Measurement.objects.count())
        self.assertEqual("%s - %s" % (str(assessment), str(rating)), str(measurement))
