from datetime import datetime

import django_excel as excel
import rest_framework.exceptions
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets, filters, status, schemas
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_swagger.renderers import OpenAPIRenderer, SwaggerUIRenderer

from headers import header, x_ua_compatible
from models import Attribute, Rating, Assessment, Measurement, Tag, Team, Template
from serializers import AssessmentCreateSerializer, AssessmentSerializer, AttributeSerializer, MeasurementCreateSerializer, RatingSerializer, TagSerializer, \
        TeamCreateSerializer, TeamSerializer, TemplateSerializer


@api_view()
@renderer_classes([OpenAPIRenderer, SwaggerUIRenderer])
def schema_view(request):
    generator = schemas.SchemaGenerator(
        title='Measure Mate API',
    )
    return Response(generator.get_schema(request=request))


@x_ua_compatible('IE=edge')
def home(request):
    return render(request, 'index.html')


@login_required
def export_data(request):
    now = datetime.utcnow()
    timestamp = now.strftime('%Y-%m-%d_%H-%M-%SZ')
    return excel.make_response_from_tables(
        [Team, Assessment, Measurement, Tag, Template, Attribute, Rating],
        'xls', file_name=('measure_mate_export_%s' % timestamp))


def healthcheck(request):
    return HttpResponse('ok', content_type='text/plain')


@header('Cache-Control', 'public, max-age=315360000')
def robots_txt(request):
    return HttpResponse('', content_type='text/plain')


class TemplateViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Template resource.
    """
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)


class AttributeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Attribute resource.
    """
    queryset = Attribute.objects.all()
    serializer_class = AttributeSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter,)
    filter_fields = ('id', 'name', 'template__id', 'template__name')
    ordering_fields = ('id', 'name', 'rank')


class RatingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Rating resource.
    """
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter,)
    filter_fields = ('id', 'name', 'attribute__id')
    ordering_fields = ('id', 'name', 'rank')


class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Tag resource.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter,)
    search_fields = ('name',)
    filter_fields = ('id', 'name', 'team__id', 'assessment__id')
    ordering_fields = ('id', 'name')


class AssessmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Assessment resource.
    """
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter,)
    filter_fields = ('team__id', 'team__name', 'template__id', 'template__name', 'tags__id', 'tags__name')
    ordering_fields = ('id', 'created', 'updated', 'template', 'team')

    def is_read_only(self, request):
        old_assessment = Assessment.objects.get(pk=request.data.get('id'))
        if old_assessment.status == "DONE" and not request.user.is_superuser:
            raise rest_framework.exceptions.PermissionDenied(detail="Assessment is Read Only")

    def update(self, request, *args, **kwargs):
        self.is_read_only(request)
        return super(AssessmentViewSet, self).update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = AssessmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        self.is_read_only(request)
        return super(AssessmentViewSet, self).destroy(request, *args, **kwargs)


class MeasurementViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Measurement resource.
    """
    queryset = Measurement.objects.all()
    serializer_class = MeasurementCreateSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('rating__id', 'rating__attribute', 'assessment__id')

    def is_read_only(self, request):
        old_assessment = Assessment.objects.get(pk=request.data.get('assessment'))
        if old_assessment.status == "DONE" and not request.user.is_superuser:
            raise rest_framework.exceptions.PermissionDenied(detail="Assessment is Read Only")

    def update(self, request, *args, **kwargs):
        self.is_read_only(request)
        return super(MeasurementViewSet, self).update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.is_read_only(request)
        return super(MeasurementViewSet, self).create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self.is_read_only(request)
        return super(MeasurementViewSet, self).destroy(request, *args, **kwargs)


class TeamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Team resource.
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter,)
    filter_fields = ('tags__id', 'tags__name')
    ordering_fields = ('id', 'name', 'created', 'updated')

    def create(self, request, *args, **kwargs):
        serializer = TeamCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
