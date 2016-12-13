from django.shortcuts import render
from django.test import TestCase, RequestFactory
from rest_framework import status

from measure_mate.headers import header, x_ua_compatible


class HeadersTestCases(TestCase):
    def test_double_header(self):
        @header('X-Test-Header1', 'one')
        @header('X-Test-Header2', 'two')
        @x_ua_compatible('IE=edge')
        def test_headers(req):
            return render(req, 'index.html')

        request = RequestFactory()
        response = test_headers(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['X-Test-Header1'], 'one')
        self.assertEqual(response['X-Test-Header2'], 'two')
        self.assertEqual(response['X-UA-Compatible'], 'IE=edge')
