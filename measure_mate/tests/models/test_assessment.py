from django.test import TestCase

from measure_mate.models import Assessment
from measure_mate.tests.factories import AssessmentFactory, TeamFactory, TemplateFactory


class AssessmentTestCases(TestCase):
    def test_creation_of_assessment(self):
        template = TemplateFactory()
        team = TeamFactory()
        assessment = AssessmentFactory(template=template, team=team)
        assessment.clean()
        self.assertEqual("%s - %s - %d" % (team.name, template.name, assessment.id), str(assessment))

    def test_ordering_of_assessments(self):
        assessment1 = AssessmentFactory()
        assessment2 = AssessmentFactory()
        self.assertEqual(assessment2, Assessment.objects.first())
