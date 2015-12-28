import datetime
from time import timezone

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from measure_mate.tests.factories import AssessmentFactory, TemplateFactory, TagFactory
from measure_mate.models import Assessment


class AssessmentAPITestCases(APITestCase):
    def test_list_assessment(self):
        """
        List all assessments and check that all fields are returned
        """
        assessment1 = AssessmentFactory(tags=[TagFactory()])

        url = reverse('assessment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], assessment1.id)
        self.assertEqual(len(response.data[0]['tags']), len(assessment1.tags.all()))
        self.assertEqual(response.data[0]['tags'][0]['id'], assessment1.tags.first().id)
        self.assertEqual(response.data[0]['tags'][0]['name'], assessment1.tags.first().name)
        self.assertEqual(response.data[0]['template']['name'], assessment1.template.name)
        self.assertEqual(response.data[0]['template']['id'], assessment1.template.id)
        self.assertEqual(datetime.datetime.strptime(response.data[0]['created'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                         assessment1.created.replace(tzinfo=None))
        self.assertEqual(datetime.datetime.strptime(response.data[0]['updated'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                         assessment1.updated.replace(tzinfo=None))

    def test_list_assessment_count(self):
        """
        Ensure multiple assessments are returned in a list
        """
        assessment1 = AssessmentFactory(tags=[TagFactory()])
        assessment2 = AssessmentFactory(tags=[TagFactory()])

        url = reverse('assessment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Assessment.objects.count())


    def test_create_assessment(self):
        """
        Ensure we can create a new assessment object.
        """
        tag = TagFactory()
        template = TemplateFactory()

        url = reverse('assessment-list')
        data = {"template": template.id, "tags": [tag.id]}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Assessment.objects.count(), 1)

    def test_fail_create_assessment(self):
        """
        Ensure that invalid template id returns a 400.
        """
        tag = TagFactory()

        url = reverse('assessment-list')
        data = {"template": "foo", "tags": [tag.id]}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Assessment.objects.count(), 0)

    def test_fail_create_assessment_no_template(self):
        """
        Ensure that request fails when no template is specified.
        """
        tag = TagFactory()

        url = reverse('assessment-list')
        data = {"tags": [tag.id]}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Assessment.objects.count(), 0)

    def test_fail_create_assessment_no_tag(self):
        """
        Ensure that request fails when no tag is specified.
        """
        tag = TagFactory()
        template = TemplateFactory()

        url = reverse('assessment-list')
        data = {"template": template.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Assessment.objects.count(), 0)
