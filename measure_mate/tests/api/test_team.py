from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from measure_mate.models import Team
from measure_mate.tests.factories import TeamFactory


class TeamAPITestCases(APITestCase):
    def test_list_team(self):
        """
        List all teams and check that all fields are returned
        """
        team = TeamFactory()
        team2 = TeamFactory()

        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Team.objects.count())
        self.assertEqual(response.data[0]['id'], team.id)
        self.assertEqual(response.data[0]['name'], team.name)

