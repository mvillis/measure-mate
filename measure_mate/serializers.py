from models import *
from rest_framework import serializers


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'name', 'desc', 'desc_class', 'rank', 'colour')


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
        fields = ('id', 'created', 'updated', 'assessment', 'rating', 'target_rating', 'observations', 'action')
        depth = 1


class MeasurementCreateSerializer(serializers.ModelSerializer):
    assessment = serializers.PrimaryKeyRelatedField(queryset=Assessment.objects.all())
    rating = serializers.PrimaryKeyRelatedField(queryset=Rating.objects.all())
    target_rating = serializers.PrimaryKeyRelatedField(
        allow_null=True,
        queryset=Rating.objects.all(),
        required=False
    )
    observations = serializers.CharField(allow_null=True, allow_blank=True)
    action = serializers.CharField(allow_null=True, allow_blank=True)

    class Meta:
        model = Measurement
        fields = ('id', 'created', 'updated', 'assessment', 'rating', 'target_rating', 'observations', 'action')


class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        depth = 2


class AssessmentCreateSerializer(serializers.ModelSerializer):
    template = serializers.PrimaryKeyRelatedField(queryset=Template.objects.all())
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())

    class Meta:
        model = Assessment
        fields = ('id', 'created', 'updated', 'template', 'team')


class AssessmentSimpleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assessment
        fields = ('id', 'template', 'created', 'updated')
        depth = 2


class TeamSerializer(serializers.ModelSerializer):
    assessments = AssessmentSimpleSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ('id', 'created', 'updated', 'name', 'short_desc', 'tags', 'assessments')
        depth = 2

class TeamCreateSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(many=True, allow_null=True, queryset=Tag.objects.all())

    class Meta:
        model = Team
        fields = ('id', 'created', 'updated', 'name', 'short_desc', 'tags')

