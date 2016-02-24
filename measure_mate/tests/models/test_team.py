from django.test import TestCase

from measure_mate.tests.factories import TeamFactory


class TeamTestCases(TestCase):
    def test_str_name_tag(self):
        team = TeamFactory()
        self.assertEqual(team.name, str(team))
