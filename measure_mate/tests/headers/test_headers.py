from django.test import TestCase, RequestFactory
from rest_framework import status
from django.shortcuts import render

from measure_mate.headers import headers


@headers({'X-Test-Header1': 'one', 'X-Test-Header2': 'two'})
def test_headers(request):
    return render(request, 'index.html')


class HeadersTestCases(TestCase):
    def test_headers(self):

	request = RequestFactory()
        response = test_headers(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['X-Test-Header1'], 'one')
        self.assertEqual(response['X-Test-Header2'], 'two')
