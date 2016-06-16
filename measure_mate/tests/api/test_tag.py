from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from measure_mate.models import Tag
from measure_mate.tests.factories import TagFactory


class TagAPITestCases(APITestCase):
    def test_list_tags(self):
        """
        List all tags and check that all fields are returned
        """
        tag = TagFactory()

        url = reverse('tag-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], tag.id)
        self.assertEqual(response.data[0]['name'], tag.name)
        self.assertEqual(len(response.data), Tag.objects.count())

    def test_search_tag(self):
        """
        List all tags that match a search criteria
        """
        tag = TagFactory(name="foo")
        tag2 = TagFactory(name="bar")

        url = "%s?search=%s" % (reverse('tag-list'), tag.name)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], tag.id)
        self.assertEqual(response.data[0]['name'], tag.name)
        self.assertEqual(len(response.data), 1)

    def test_create_tag(self):
        """
        Ensure we can create a new tag object.
        """
        url = reverse('tag-list')
        data = {"name": "test-tag-alpha_1", }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tag.objects.count(), 1)

    def test_create_invalid_tag_with_spaces(self):
        """
        Ensure we can't create an invalid tag object.
        """
        url = reverse('tag-list')
        data = {"name": "test tag alpha", }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_invalid_tag_with_punctuation(self):
        """
        Ensure we can't create an invalid tag object.
        """
        url = reverse('tag-list')
        data = {"name": "test_tag_alpha_!!()", }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_invalid_tag_with_uppercase(self):
        """
        Ensure we can't create an invalid tag object.
        """
        url = reverse('tag-list')
        data = {"name": "Test_Tag_Alpha", }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
