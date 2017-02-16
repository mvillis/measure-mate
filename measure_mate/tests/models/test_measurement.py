from builtins import str
from django.test import TestCase
from django.core.exceptions import ValidationError

from measure_mate.models import Measurement
from measure_mate.tests.factories import TemplateFactory, AttributeFactory, AssessmentFactory, RatingFactory, \
    MeasurementFactory


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
        measurement.clean()
        self.assertEqual(1, Measurement.objects.count())
        self.assertEqual("%s - %s - %s" % (str(assessment), attribute.name, rating.name), str(measurement))

    def test_creation_of_measurement_no_target(self):
        """
        Should be able to create a measurement without a target_rating
        """
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        assessment = AssessmentFactory(template=template)
        rating = RatingFactory(attribute=attribute)
        measurement = MeasurementFactory(assessment=assessment, rating=rating)
        measurement.clean()
        self.assertEqual(1, Measurement.objects.count())
        self.assertEqual("%s - %s - %s" % (str(assessment), attribute.name, rating.name), str(measurement))

    def test_fail_measurement_with_rating_from_different_template(self):
        """
        Don't create measurements referring to rating from a different template than the assessment
        """
        template1 = TemplateFactory()
        attribute1 = AttributeFactory(template=template1)
        rating1 = RatingFactory(attribute=attribute1)

        assessment = AssessmentFactory(template=template1)

        template2 = TemplateFactory()
        attribute2 = AttributeFactory(template=template2)
        rating2 = RatingFactory(attribute=attribute2)

        measurement1 = MeasurementFactory(assessment=assessment, rating=rating2)
        self.assertRaises(ValidationError, measurement1.clean)

        measurement2 = MeasurementFactory(assessment=assessment, rating=rating1, target_rating=rating2)
        self.assertRaises(ValidationError, measurement2.clean)