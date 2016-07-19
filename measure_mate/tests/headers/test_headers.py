from django.test import TestCase, RequestFactory
from rest_framework import status
from django.shortcuts import render

from measure_mate.headers import headers


class HeadersTestCases(TestCase):
    def test_double_header(self):

        @header('X-Test-Header1', 'one')
        @header('X-Test-Header2', 'two')
        @allow_origin_all
        @x_ua_compatible('IE=edge')
        def test_headers(request):
            return render(request, 'index.html')

        request = RequestFactory()
        response = test_headers(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['X-Test-Header1'], 'one')
        self.assertEqual(response['X-Test-Header2'], 'two')
        self.assertEqual(response['X-UA-Compatible'], 'IE=edge')
        self.assertEqual(response['Access-Control-Allow-Origin'], '*')
