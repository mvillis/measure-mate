from builtins import object
from rest_framework import serializers

from .models import Announcement, Attribute, Rating, Assessment, Measurement, Tag, Team, Template


class RatingSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Rating
        fields = ('id', 'name', 'desc', 'desc_class', 'rank', 'colour')


class AttributeSerializer(serializers.ModelSerializer):
    ratings = RatingSerializer(many=True, read_only=True)

    class Meta(object):
        model = Attribute
        fields = ('id', 'name', 'desc', 'desc_class', 'rank', 'ratings')


class TemplateSerializer(serializers.ModelSerializer):
    attributes = AttributeSerializer(many=True, read_only=True)

    class Meta(object):
        model = Template
        fields = ('id', 'name', 'short_desc', 'taggable', 'enabled', 'attributes')


class TemplateSimpleSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Template
        # fields = ('id', 'name', 'short_desc')


class TagSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Tag
        fields = ('id', 'name')


class MeasurementSerializer(serializers.ModelSerializer):
    class Meta(object):
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

    class Meta(object):
        model = Measurement
        fields = ('id', 'created', 'updated', 'assessment', 'rating', 'target_rating', 'observations', 'action')


class AssessmentSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(many=True, allow_null=True, queryset=Tag.objects.all())

    class Meta(object):
        model = Assessment
        depth = 2
        fields = ('id', 'created', 'updated', 'template', 'tags', 'status', 'team')


class AssessmentCreateSerializer(serializers.ModelSerializer):
    template = serializers.PrimaryKeyRelatedField(queryset=Template.objects.all())
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())
    tags = serializers.PrimaryKeyRelatedField(many=True, allow_null=True, queryset=Tag.objects.all())

    class Meta(object):
        model = Assessment
        fields = ('id', 'created', 'updated', 'template', 'tags', 'status', 'team')


class AssessmentSimpleSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Assessment
        fields = ('id', 'template', 'tags', 'created', 'updated', 'status')
        depth = 2


class TeamSerializer(serializers.ModelSerializer):
    assessments = AssessmentSimpleSerializer(many=True, read_only=True)
    tags = serializers.PrimaryKeyRelatedField(many=True, allow_null=True, queryset=Tag.objects.all())

    class Meta(object):
        model = Team
        fields = ('id', 'created', 'updated', 'name', 'short_desc', 'tags', 'assessments')
        depth = 2


class TeamCreateSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(many=True, allow_null=True, queryset=Tag.objects.all())

    class Meta(object):
        model = Team
        fields = ('id', 'created', 'updated', 'name', 'short_desc', 'tags')


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Announcement
        fields = ('id', 'created', 'updated', 'title', 'content', 'enabled', 'style')
