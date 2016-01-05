from django.test import TestCase

from measure_mate.tests.factories import AssessmentFactory, TagFactory
from measure_mate.models import Assessment

class AssessmentTestCases(TestCase):
    def test_creation_of_assessment_with_two_tags(self):
        tag1 = TagFactory()
        tag2 = TagFactory()
        assessment = AssessmentFactory(tags=(tag1, tag2))
        self.assertEqual(2, len(assessment.tags.all()))

    def test_ordering_of_assessments(self):
        assessment1 = AssessmentFactory()
        assessment2 = AssessmentFactory()
        self.assertEqual(assessment2, Assessment.objects.first())
        
