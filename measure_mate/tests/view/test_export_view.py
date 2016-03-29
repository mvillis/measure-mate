from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status


class ExportViewTestCases(TestCase):
    def test_export_view(self):

        response = self.client.get(reverse('export'))
        self.assertTemplateNotUsed(response, 'index.html')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertRegexpMatches(response['Content-Disposition'], r'^attachment;')
        self.assertRegexpMatches(response['Content-Type'], r'spreadsheet')
