from django.test import TestCase
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.utils.timezone import utc
from rest_framework import status
import datetime


class ExportViewTestCases(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.superuser = User.objects.create(
            id=100,
            password='sha1$995a3$6011485ea3834267d719b4c801409b8b1ddd0158',
            last_login=datetime.datetime(2007, 5, 30, 13, 20, 10, tzinfo=utc),
            is_superuser=True, username='super', first_name='Super',
            last_name='User', email='super@example.com', is_staff=True,
            is_active=True, date_joined=datetime.datetime(2007, 5, 30, 13, 20, 10, tzinfo=utc)
        )

    def test_export_view(self):
        self.client.force_login(self.superuser)
        response = self.client.get(reverse('export'))
        self.assertTemplateNotUsed(response, 'index.html')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertRegexpMatches(response['Content-Disposition'], r'^attachment;')
        self.assertRegexpMatches(response['Content-Disposition'], r'filename=.*\.xlsx?')
        self.assertRegexpMatches(response['Content-Type'], r'spreadsheet|excel')

    def test_export_view_noauth(self):
        response = self.client.get(reverse('export'))
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
