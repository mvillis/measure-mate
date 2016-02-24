import datetime
from time import timezone

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from measure_mate.models import Team
from measure_mate.tests.factories import TeamFactory, TagFactory


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
        self.assertEqual(response.data[0]['short_desc'], team.short_desc)
        self.assertEqual(datetime.datetime.strptime(response.data[0]['created'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                         team.created.replace(tzinfo=None))
        self.assertEqual(datetime.datetime.strptime(response.data[0]['updated'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                         team.updated.replace(tzinfo=None))

    def test_create_team(self):
        """
        Ensure we can create a new team object.
        """
        tag = TagFactory()

        url = reverse('team-list')
        data = {"name": "Test Team", "short_desc": "A team for testing with", "tags": [tag.id]}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)

    def test_fail_create_team(self):
        """
        Ensure that missing name returns a 400.
        """
        tag = TagFactory()

        url = reverse('team-list')
        data = {"short_desc": "A team for testing with", "tags": [tag.id]}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Team.objects.count(), 0)

    def test_fail_create_team_no_tag(self):
        """
        Ensure that request fails when no tag is specified.
        """
        tag = TagFactory()

        url = reverse('team-list')
        data = {"name": "Test Team", "short_desc": "A team for testing with"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Team.objects.count(), 0)


