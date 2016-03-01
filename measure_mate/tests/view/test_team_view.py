from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status

from measure_mate.tests.factories import TeamFactory, TagFactory


class TeamViewTestCases(TestCase):
    def test_assessment_view(self):

        team = TeamFactory(tags=[TagFactory()])
        response = self.client.get(reverse('team', args=[team.id]))

        self.assertTemplateUsed(response, 'team.html')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
