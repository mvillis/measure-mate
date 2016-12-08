from django.test import TestCase

from measure_mate.tests.factories import AnnouncementFactory


class AnnouncementTestCases(TestCase):
    def test_str_title_announcement(self):
        announcement = AnnouncementFactory()
        announcement.clean()
        self.assertEqual(announcement.title, str(announcement))
