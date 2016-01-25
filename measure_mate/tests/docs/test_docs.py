from django.test import TestCase
from rest_framework import status


class HomeViewTestCases(TestCase):
    def test_home_view(self):

        response = self.client.get('/docs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
