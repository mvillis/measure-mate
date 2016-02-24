from django.test import TestCase

from measure_mate.tests.factories import TeamFactory


class TeamTestCases(TestCase):
    def test_str_name_team(self):
        team = TeamFactory()
        self.assertEqual(team.name, str(team))
