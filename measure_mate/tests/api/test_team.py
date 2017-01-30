import six
import datetime

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from measure_mate.models import Team
from measure_mate.tests.factories import TeamFactory, TagFactory


class TeamAPITestCases(APITestCase):
    def test_team(self):
        """
        Fetch a team and check that all fields are returned
        """
        tag1 = TagFactory()
        tag2 = TagFactory()
        team = TeamFactory(tags=[tag1, tag2])

        url = reverse('team-detail', args=[team.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], team.id)
        self.assertEqual(response.data['name'], team.name)
        self.assertEqual(response.data['short_desc'], team.short_desc)
        self.assertEqual(datetime.datetime.strptime(response.data['created'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                         team.created.replace(tzinfo=None))
        self.assertEqual(datetime.datetime.strptime(response.data['updated'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                         team.updated.replace(tzinfo=None))
        self.assertEqual(len(response.data['tags']), 2)
        six.assertCountEqual(self, response.data['tags'], [tag1.id, tag2.id])

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

    def test_update_team(self):
        """
        Update an existing team's name and description
        """
        tag1 = TagFactory()
        tag2 = TagFactory()
        team = TeamFactory(tags=[tag1, tag2])

        tag3 = TagFactory()

        newtags = [tag1.id, tag3.id]

        url = reverse('team-detail', args=[team.id])
        data = {"id": team.id, "name": team.name + " updated", "short_desc": team.name + " updated", "tags": newtags}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], data['id'])
        self.assertEqual(response.data['name'], data['name'])
        self.assertEqual(response.data['short_desc'], data['short_desc'])
        self.assertEqual(len(response.data['tags']), 2)
        six.assertCountEqual(self, response.data['tags'], [tag1.id, tag3.id])