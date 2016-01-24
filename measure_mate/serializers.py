from models import *
from rest_framework import serializers


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'name', 'desc', 'desc_class', 'rank')


class AttributeSerializer(serializers.ModelSerializer):
    ratings = RatingSerializer(many=True, read_only=True)

    class Meta:
        model = Attribute
        fields = ('id', 'name', 'desc', 'desc_class', 'rank', 'ratings')


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
    class Meta:
        model = Measurement
        fields = ('id', 'rating', 'observations', 'assessment')
        depth = 1


class MeasurementCreateSerializer(serializers.ModelSerializer):
    assessment = serializers.PrimaryKeyRelatedField(queryset=Assessment.objects.all())
    rating = serializers.PrimaryKeyRelatedField(queryset=Rating.objects.all())
    observations = serializers.CharField(allow_null=True, allow_blank=True)

    class Meta:
        model = Measurement
        fields = ('id', 'assessment', 'rating', 'observations')


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
