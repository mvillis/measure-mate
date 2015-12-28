from models import *
from rest_framework import serializers


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'name', 'desc', 'rank')


class AttributeSerializer(serializers.ModelSerializer):
    ratings = RatingSerializer(many=True, read_only=True)

    class Meta:
        model = Attribute
        fields = ('id', 'name', 'desc', 'ratings')


class TemplateSerializer(serializers.ModelSerializer):
    attributes = AttributeSerializer(many=True, read_only=True)

    class Meta:
        model = Template
        fields = ('id', 'name', 'short_desc', 'attributes')


class TemplateSimpleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Template
        # fields = ('id', 'name', 'short_desc')


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('id', 'name')


class MeasurementSerializer(serializers.ModelSerializer):
    rating = RatingSerializer(many=False, read_only=True)

    class Meta:
        model = Measurement
        fields = ('id', 'rating', 'observations')
        depth = 1


class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        depth = 1


class AssessmentCreateSerializer(serializers.ModelSerializer):
    template = serializers.PrimaryKeyRelatedField(queryset=Template.objects.all())
    tags = serializers.PrimaryKeyRelatedField(many=True, allow_null=True, queryset=Tag.objects.all())

    class Meta:
        model = Assessment
        fields = ('id', 'created', 'updated', 'template', 'tags')
