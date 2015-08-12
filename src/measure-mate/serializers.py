from models import *
from rest_framework import serializers


class RatingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'name', 'desc', 'rank')


class AttributeSerializer(serializers.HyperlinkedModelSerializer):
    ratings = RatingSerializer(many=True, read_only=True)

    class Meta:
        model = Attribute
        fields = ('id', 'name', 'desc', 'ratings')


class TemplateSerializer(serializers.HyperlinkedModelSerializer):
    attributes = AttributeSerializer(many=True, read_only=True)

    class Meta:
        model = Template
        fields = ('id', 'name', 'short_desc', 'attributes')
        depth = 1


class TagSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Tag
        fields = ('id', 'name')


class MeasurementSerializer(serializers.HyperlinkedModelSerializer):
    rating = RatingSerializer(many=False, read_only=True)

    class Meta:
        model = Template
        fields = ('id', 'assessment', 'rating', 'observations')
        depth = 1


class AssessmentSerializer(serializers.HyperlinkedModelSerializer):
    measurements = MeasurementSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = ('id', 'name', 'tags', 'measurements')
        depth = 1
