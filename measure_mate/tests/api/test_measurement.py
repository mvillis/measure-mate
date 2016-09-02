from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from measure_mate.models import Measurement
from measure_mate.tests.factories import TemplateFactory, AttributeFactory, RatingFactory, AssessmentFactory, MeasurementFactory


class MeasurementAPITestCases(APITestCase):
    def test_search_measurement(self):
        """
        Should return one measurement that matches the rating, assessment combo.
        One measurement relates to a rating that is not in the scope of the search.
        """
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        rating_in_scope = RatingFactory(attribute=attribute)
        rating_out_of_scope = RatingFactory()
        assessment = AssessmentFactory(template=template)
        measurement1 = MeasurementFactory(assessment=assessment, rating=rating_in_scope)
        measurement2 = MeasurementFactory(assessment=assessment, rating=rating_out_of_scope)
        url = "%s?assessment__id=%s&rating__attribute=%s" % (reverse('measurement-list'), assessment.id, attribute.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], measurement1.id)
        self.assertEqual(response.data[0]['rating'], rating_in_scope.id)
        self.assertEqual(len(response.data), 1)

    def test_search_measurement2(self):
        """
        Should return zero measurements as the api search is for a different assessment
        """
        template = TemplateFactory()
        attribute = AttributeFactory(template=template)
        rating_in_scope1 = RatingFactory(attribute=attribute)
        rating_in_scope2 = RatingFactory(attribute=attribute)
        assessment1 = AssessmentFactory(template=template)
        assessment2 = AssessmentFactory(template=template)
        assessment3 = AssessmentFactory()
        measurement1 = MeasurementFactory(assessment=assessment1, rating=rating_in_scope1)
        measurement2 = MeasurementFactory(assessment=assessment2, rating=rating_in_scope2)
        url = "%s?assessment__id=%s&rating__attribute=%s" % (reverse('measurement-list'), assessment3.id, attribute.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_search_measurement3(self):
        """
        Should return one measurement that matches the rating, assessment combo.
        One measurement relates to an assessment that is not in the scope of the search.
        """
        template1 = TemplateFactory()
        template2 = TemplateFactory()
        attribute1 = AttributeFactory(template=template1)
        attribute2 = AttributeFactory(template=template2)
        rating = RatingFactory(attribute=attribute1)
        assessment1 = AssessmentFactory(template=template1)
        assessment2 = AssessmentFactory(template=template2)
        measurement1 = MeasurementFactory(assessment=assessment1, rating=rating)
        measurement2 = MeasurementFactory(assessment=assessment2, rating=rating)
        url = "%s?assessment__id=%s&rating__attribute=%s" % (reverse('measurement-list'), assessment1.id, attribute1.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], measurement1.id)
        self.assertEqual(response.data[0]['rating'], rating.id)
        self.assertEqual(len(response.data), 1)

    def test_create_measurement(self):
        """
        Ensure we can create a new measurement object.
        """
        assessment = AssessmentFactory()
        rating = RatingFactory()
        target_rating = RatingFactory()
        url = reverse('measurement-list')
        data = {"id": None, "assessment": assessment.id, "rating": rating.id,
                "target_rating": target_rating.id, "observations": "123",
                "action": "456"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Measurement.objects.count(), 1)

    def test_create_measurement_no_rating(self):
        """
        Ensure we can't create a new measurement object without a rating.
        """
        assessment = AssessmentFactory()
        target_rating = RatingFactory()
        url = reverse('measurement-list')
        data = {"id": None, "assessment": assessment.id, "rating": None,
                "target_rating": target_rating.id, "observations": "123",
                "action": "456"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Measurement.objects.count(), 0)

    def test_create_measurement_blank_observation(self):
        """
        Ensure we can create a new measurement object with a "" observation.
        """
        assessment = AssessmentFactory()
        rating = RatingFactory()
        url = reverse('measurement-list')
        data = {"id": None, "assessment": assessment.id, "rating": rating.id,
                "observations": "", "action": "456"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Measurement.objects.count(), 1)

    def test_create_measurement_no_observation(self):
        """
        Ensure we can create a new measurement object without an observation.
        """
        assessment = AssessmentFactory()
        rating = RatingFactory()
        url = reverse('measurement-list')
        data = {"id": None, "assessment": assessment.id, "rating": rating.id,
                "observations": None, "action": "456"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Measurement.objects.count(), 1)

    def test_create_measurement_no_target(self):
        """
        Ensure we can create a new measurement object without a target
        """
        assessment = AssessmentFactory()
        rating = RatingFactory()
        url = reverse('measurement-list')
        data = {"id": None, "assessment": assessment.id, "rating": rating.id,
                "observations": None, "action": "456"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Measurement.objects.count(), 1)

    def test_create_measurement_fail_assessment_read_only(self):
        """
        Ensure we cannot create a new measurement when the assessment is read only
        """
        assessment = AssessmentFactory(status="DONE")
        rating = RatingFactory()
        url = reverse('measurement-list')
        data = {"id": None, "assessment": assessment.id, "rating": rating.id,
                "observations": None, "action": "456"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Measurement.objects.count(), 0)

    def test_create_measurement_success_assessment_read_only_super_user(self):
        """
        Ensure we can create a new measurement when the assessment is read only and superuser
        """

        password = 'mypassword'
        my_admin = User.objects.create_superuser('myuser', 'myemail@test.com', password)

        self.client.login(username=my_admin.username, password=password)

        assessment = AssessmentFactory(status="DONE")
        rating = RatingFactory()
        url = reverse('measurement-list')
        data = {"id": None, "assessment": assessment.id, "rating": rating.id,
                "observations": None, "action": "456"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Measurement.objects.count(), 1)

    def test_update_measurement(self):
        """
        Ensure we can update an existing measurement object.
        """
        assessment = AssessmentFactory()
        rating = RatingFactory()
        rating2 = RatingFactory()
        measurement = MeasurementFactory(assessment=assessment, rating=rating)

        url = reverse('measurement-detail', args=(measurement.id,))
        data = {"id": measurement.id, "assessment": assessment.id,
                "rating": rating2.id, "observations": "123", "action": "456"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Measurement.objects.count(), 1)
        self.assertEqual(response.data['id'], measurement.id)
        self.assertEqual(response.data['rating'], rating2.id)

    def test_update_target_rating_to_measurement(self):
        """
        Ensure we can update an existing measurement object with a target rating
        """
        assessment = AssessmentFactory()
        rating = RatingFactory()
        target_rating = RatingFactory()
        measurement = MeasurementFactory(assessment=assessment, rating=rating)

        url = reverse('measurement-detail', args=(measurement.id,))
        data = {"id": measurement.id, "assessment": assessment.id,
                "rating": rating.id, "target_rating": target_rating.id,
                "observations": "123", "action": "456"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Measurement.objects.count(), 1)
        self.assertEqual(response.data['id'], measurement.id)
        self.assertEqual(response.data['target_rating'], target_rating.id)

    def test_cannot_update_measurement_when_assessment_is_read_only(self):
        """
        Ensure we cannot update an existing measurement object when assessment is read only
        """
        assessment = AssessmentFactory(status="DONE")
        rating = RatingFactory()
        target_rating = RatingFactory()
        measurement = MeasurementFactory(assessment=assessment, rating=rating)

        url = reverse('measurement-detail', args=(measurement.id,))
        data = {"id": measurement.id, "assessment": assessment.id,
                "rating": rating.id, "target_rating": target_rating.id,
                "observations": "123", "action": "456"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_can_update_measurement_when_assessment_is_read_only_and_super_user(self):
        """
        Ensure we can update an existing measurement object when assessment is read only and you are superuser
        """
        assessment = AssessmentFactory(status="DONE")
        rating = RatingFactory()
        target_rating = RatingFactory()
        measurement = MeasurementFactory(assessment=assessment, rating=rating)

        password = 'mypassword'
        my_admin = User.objects.create_superuser('myuser', 'myemail@test.com', password)

        self.client.login(username=my_admin.username, password=password)

        url = reverse('measurement-detail', args=(measurement.id,))
        data = {"id": measurement.id, "assessment": assessment.id,
                "rating": rating.id, "target_rating": target_rating.id,
                "observations": "123", "action": "456"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_measurement_blank_action(self):
        """
        Ensure we can create a new measurement object with a "" action.
        """
        assessment = AssessmentFactory()
        rating = RatingFactory()
        url = reverse('measurement-list')
        data = {"id": None, "assessment": assessment.id, "rating": rating.id,
                "observations": "123", "action": ""}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Measurement.objects.count(), 1)

    def test_create_measurement_no_action(self):
        """
        Ensure we can create a new measurement object without an action.
        """
        assessment = AssessmentFactory()
        rating = RatingFactory()
        url = reverse('measurement-list')
        data = {"id": None, "assessment": assessment.id, "rating": rating.id,
                "observations": "123", "action": None}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Measurement.objects.count(), 1)

    def test_cannot_delete_measurement_when_assessment_is_read_only(self):
        """
        Ensure we cannot delete an existing measurement object when assessment is read only
        """
        assessment = AssessmentFactory(status="DONE")
        rating = RatingFactory()
        target_rating = RatingFactory()
        measurement = MeasurementFactory(assessment=assessment, rating=rating)

        url = reverse('measurement-detail', args=(measurement.id,))
        data = {"id": measurement.id, "assessment": assessment.id,
                "rating": rating.id, "target_rating": target_rating.id,
                "observations": "123", "action": "456"}
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Measurement.objects.count(), 1)

    def test_can_delete_measurement_when_assessment_is_read_only_and_super_user(self):
        """
        Ensure we can delete an existing measurement object when assessment is read only and you are superuser
        """
        assessment = AssessmentFactory(status="DONE")
        rating = RatingFactory()
        target_rating = RatingFactory()
        measurement = MeasurementFactory(assessment=assessment, rating=rating)

        password = 'mypassword'
        my_admin = User.objects.create_superuser('myuser', 'myemail@test.com', password)

        self.client.login(username=my_admin.username, password=password)

        url = reverse('measurement-detail', args=(measurement.id,))
        data = {"id": measurement.id, "assessment": assessment.id,
                "rating": rating.id, "target_rating": target_rating.id,
                "observations": "123", "action": "456"}
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Measurement.objects.count(), 0)
