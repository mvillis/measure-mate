from django.test import TestCase

from measure_mate.tests.factories import *


class ActionTestCases(TestCase):
    def test_creation_of_action(self):
        """
        Create a action with all fields specified
        """
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        assessment = AssessmentFactory(template=template)
        rating = RatingFactory(attribute=attribute)
        target_rating = RatingFactory(attribute=attribute)
        measurement = MeasurementFactory(assessment=assessment, rating=rating, target_rating=target_rating)
        action = ActionFactory(assessment=assessment, measurement=measurement, rank=1, description='Take Action #1', key_metric='Check metric #1', review_date='2016-12-31')
        self.assertEqual(1, Action.objects.count())
        self.assertEqual("%s - %s - %d" % (str(assessment), str(measurement), action.id), str(action))

    def test_creation_of_action_no_measurement(self):
        """
        Should be able to create a action without a measurement
        """
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        assessment = AssessmentFactory(template=template)
        action = ActionFactory(assessment=assessment, rank=2, description='Take Action #2', key_metric='Check metric #2', review_date='2016-12-31')
        self.assertEqual(1, Action.objects.count())
        self.assertEqual("%s - %d" % (str(assessment), action.id), str(action))
