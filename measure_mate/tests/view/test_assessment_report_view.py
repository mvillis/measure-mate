from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status

from measure_mate.tests.factories import AssessmentFactory, TagFactory


class AssessmentViewTestCases(TestCase):
    def test_assessment_report_view(self):

        assessment = AssessmentFactory(tags=[TagFactory()])
        response = self.client.get(reverse('assessment-report', args=[assessment.id]))

        self.assertTemplateUsed(response, 'assessment_report.html')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
