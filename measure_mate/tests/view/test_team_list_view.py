from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status

from measure_mate.tests.factories import TeamFactory, TagFactory


class TeamListViewTestCases(TestCase):
    def test_team_list_view(self):

        team = TeamFactory(tags=[TagFactory()])
        response = self.client.get(reverse('team-showlist'))

        self.assertTemplateUsed(response, 'team_list.html')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
