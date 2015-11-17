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


class TagSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Tag
        fields = ('id', 'name')


class MeasurementSerializer(serializers.HyperlinkedModelSerializer):
    rating = RatingSerializer(many=False, read_only=True)

    class Meta:
        model = Measurement
        fields = ('id', 'rating', 'observations')
        depth = 1


class AssessmentSerializer(serializers.HyperlinkedModelSerializer):
    measurements = MeasurementSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    template = TemplateSerializer(many=False, read_only=True)

    class Meta:
        model = Assessment
        fields = ('id', 'template', 'tags', 'measurements')
