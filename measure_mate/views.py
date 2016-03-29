from rest_framework import viewsets, generics, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from serializers import *
from models import *
from headers import x_ua_compatible
from datetime import datetime
import django_excel as excel
import pyexcel.ext.xls
import pyexcel.ext.xlsx


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


class RatingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Rating resource.
    """
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)


class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Tag resource.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class AssessmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Assessment resource.
    """
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('team__id', 'team__name', 'template__id', 'template__name')

    def create(self, request, *args, **kwargs):
        serializer = AssessmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MeasurementViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Measurement resource.
    """
    queryset = Measurement.objects.all()
    serializer_class = MeasurementCreateSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('rating__id', 'rating__attribute', 'assessment__id')


class TeamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Team resource.
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('tags__id', 'tags__name')

    def create(self, request, *args, **kwargs):
        serializer = TeamCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
