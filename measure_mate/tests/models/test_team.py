from django.test import TestCase

from measure_mate.tests.factories import TeamFactory, TagFactory


class TeamTestCases(TestCase):
    def test_str_name_team(self):
        team = TeamFactory()
        self.assertEqual(team.name, str(team))

    def test_creation_of_team_with_two_tags(self):
        tag1 = TagFactory()
        tag2 = TagFactory()
        team = TeamFactory(tags=(tag1, tag2))
        self.assertEqual(2, len(team.tags.all()))

