from models import Discipline, Capability, Level
from rest_framework import serializers


class LevelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Level
        fields = ('id', 'name', 'desc', 'rank')


class CapabilitySerializer(serializers.HyperlinkedModelSerializer):
    levels = LevelSerializer(many=True, read_only=True)

    class Meta:
        model = Capability
        fields = ('id', 'name', 'desc', 'levels')


class DisciplineSerializer(serializers.HyperlinkedModelSerializer):
    capabilities = CapabilitySerializer(many=True, read_only=True)

    class Meta:
        model = Discipline
        fields = ('id', 'name', 'short_desc', 'capabilities')
        depth = 1
