from builtins import str
from django.test import TestCase

from measure_mate.tests.factories import TagFactory


class TagTestCases(TestCase):
    def test_str_name_tag(self):
        tag = TagFactory()
        tag.clean()
        self.assertEqual(tag.name, str(tag))
