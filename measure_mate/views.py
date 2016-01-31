from rest_framework import viewsets, generics, filters, status
from rest_framework.response import Response
from django.shortcuts import render
from serializers import *
from models import *


def home(request):
    return render(request, 'index.html')


def assessment(request, pk):
    return render(request, 'assessment.html', {'id': pk})


def assessment_report(request, pk):
    return render(request, 'assessment_report.html', {'id': pk})


def assessment_list(request):
    return render(request, 'assessment_list.html')


class TemplateViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Template resource.
    """
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer


class AttributeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Attribute resource.
    """
    queryset = Attribute.objects.all()
    serializer_class = AttributeSerializer


class RatingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Rating resource.
    """
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer


class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Tag resource.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class TagListView(generics.ListAPIView):
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
    serializer_class = MeasurementSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('rating__id', 'assessment__id', 'rating__attribute')

    def create(self, request, *args, **kwargs):
        serializer = MeasurementCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = MeasurementCreateSerializer(instance=instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class MeasurementListView(generics.ListAPIView):
    queryset = Measurement.objects.all()
    serializer_class = MeasurementSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('rating__id', 'assessment__id', 'rating__attribute__id')
