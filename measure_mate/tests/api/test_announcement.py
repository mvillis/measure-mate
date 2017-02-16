from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from measure_mate.models import Announcement
from measure_mate.tests.factories import AnnouncementFactory


class AnnouncementAPITestCases(APITestCase):
    def test_list_announcements(self):
        """
        List all announcements and check that all fields are returned
        """
        announcement = AnnouncementFactory()
        announcement2 = AnnouncementFactory()

        url = reverse('announcement-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], announcement.id)
        self.assertEqual(response.data[0]['title'], announcement.title)
        self.assertEqual(response.data[1]['id'], announcement2.id)
        self.assertEqual(response.data[1]['title'], announcement2.title)
        self.assertEqual(len(response.data), Announcement.objects.count())

    def test_enabled_announcement(self):
        """
        List all enabled announcements
        """
        announcement = AnnouncementFactory(title="foo", enabled=False)
        announcement2 = AnnouncementFactory(title="bar")

        url = "%s?enabled=%s" % (reverse('announcement-list'), True)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], announcement2.id)
        self.assertEqual(response.data[0]['title'], announcement2.title)
        self.assertEqual(len(response.data), 1)
