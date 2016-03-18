from django.test import TestCase

from measure_mate.tests.factories import AssessmentFactory, TagFactory
from measure_mate.models import Assessment

class AssessmentTestCases(TestCase):

    def test_ordering_of_assessments(self):
        assessment1 = AssessmentFactory()
        assessment2 = AssessmentFactory()
        self.assertEqual(assessment2, Assessment.objects.first())
        
