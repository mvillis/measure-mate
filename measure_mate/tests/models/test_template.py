from builtins import str
from django.test import TestCase

from measure_mate.tests.factories import TemplateFactory


class TemplateTestCases(TestCase):
    def test_has_up_to_five_in_running_set(self):
        template = TemplateFactory()
        template.clean()
        self.assertEqual(template.name, str(template))