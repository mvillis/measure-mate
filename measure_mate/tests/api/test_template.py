from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from measure_mate.models import Template
from measure_mate.tests.factories import TemplateFactory


class TemplateAPITestCases(APITestCase):
    def test_list_template(self):
        """
        List all templates and check that all fields are returned
        """
        template = TemplateFactory()
        template2 = TemplateFactory()

        url = reverse('template-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], template.id)
        self.assertEqual(response.data[0]['name'], template.name)
        self.assertEqual(len(response.data), Template.objects.count())
