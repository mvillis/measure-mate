import datetime
from time import timezone

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from measure_mate.tests.factories import AssessmentFactory, TemplateFactory, TagFactory, TeamFactory
from measure_mate.models import Assessment


class AssessmentAPITestCases(APITestCase):
    def test_list_assessment(self):
        """
        List all assessments and check that all fields are returned
        """
        assessment1 = AssessmentFactory()

        url = reverse('assessment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], assessment1.id)
        self.assertEqual(response.data[0]['template']['name'], assessment1.template.name)
        self.assertEqual(response.data[0]['template']['id'], assessment1.template.id)
        self.assertEqual(response.data[0]['team']['name'], assessment1.team.name)
        self.assertEqual(response.data[0]['team']['id'], assessment1.team.id)
        self.assertEqual(datetime.datetime.strptime(response.data[0]['created'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                         assessment1.created.replace(tzinfo=None))
        self.assertEqual(datetime.datetime.strptime(response.data[0]['updated'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                         assessment1.updated.replace(tzinfo=None))

    def test_list_assessment_count(self):
        """
        Ensure multiple assessments are returned in a list
        and sorted by last first
        """
        assessment1 = AssessmentFactory()
        assessment2 = AssessmentFactory()

        url = reverse('assessment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Assessment.objects.count())
        self.assertEqual(response.data[0]['id'], assessment2.id)

    def test_create_assessment_no_team(self):
        """
        Ensure we can't create a new assessment object without a team.
        """
        template = TemplateFactory()

        url = reverse('assessment-list')
        data = {"template": template.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Assessment.objects.count(), 0)

    def test_fail_create_assessment(self):
        """
        Ensure that invalid template id returns a 400.
        """
        team = TeamFactory()

        url = reverse('assessment-list')
        data = {"template": "foo", "team": team.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Assessment.objects.count(), 0)

    def test_fail_create_assessment_no_template(self):
        """
        Ensure that request fails when no template is specified.
        """
        team = TeamFactory()

        url = reverse('assessment-list')
        data = {"team": team.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Assessment.objects.count(), 0)

    def test_create_assessment_team(self):
        """
        Ensure we can create a new assessment object with a team and no status
        """
        template = TemplateFactory()
        team = TeamFactory()

        url = reverse('assessment-list')
        data = {"template": template.id, "team": team.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get('status'), 'TODO')
        self.assertEqual(Assessment.objects.count(), 1)

    def test_halt_updates_if_read_only_non_super_user(self):
        """
        Ensure you can't update the assessment if you're not a superadmin and status is done.
        """
        assessment = AssessmentFactory(status="DONE")

        url = reverse('assessment-detail', args=(assessment.id,))
        data = {"id": assessment.id, "template": assessment.template.id, "status": "TODO"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Assessment.objects.count(), 1)

    def test_halt_updates_if_read_only_super_user(self):
        """
        Ensure you can update the assessment if you are a superadmin and status is done.
        """
        assessment = AssessmentFactory(status="DONE")

        password = 'mypassword'
        my_admin = User.objects.create_superuser('myuser', 'myemail@test.com', password)

        self.client.login(username=my_admin.username, password=password)

        url = reverse('assessment-detail', args=(assessment.id,))
        data = {"id": assessment.id, "template": assessment.template.id, "status": "TODO"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Assessment.objects.count(), 1)

    def test_update_status_to_done(self):
        """
        Ensure even anonymous users can make an assessment done.
        """
        assessment = AssessmentFactory()

        url = reverse('assessment-detail', args=(assessment.id,))
        data = {"id": assessment.id, "template": assessment.template.id, "status": "DONE"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Assessment.objects.count(), 1)
        self.assertEqual(Assessment.objects.get(pk=assessment.id).status, "DONE")
