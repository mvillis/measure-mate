from django.test import TestCase
from django.urls import reverse
from rest_framework import status


class SchemaViewTestCases(TestCase):
    def test_schema_view(self):
        response = self.client.get(reverse('schema'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
