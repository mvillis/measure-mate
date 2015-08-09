from rest_framework import viewsets, generics
from serializers import DisciplineSerializer
from serializers import CapabilitySerializer
from serializers import LevelSerializer
from models import Capability, Level, Discipline


class DisciplineViewSet(viewsets.ModelViewSet):
    """
    API endpoint that shows all capabilities for a given discipline.
    """
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer


class CapabilityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that shows all capabilities for a given discipline.
    """
    queryset = Capability.objects.all()
    serializer_class = CapabilitySerializer


class LevelViewSet(viewsets.ModelViewSet):
    """
    API endpoint that shows all levels for a given capability.
    """
    queryset = Level.objects.all()
    serializer_class = LevelSerializer


class MatrixView(generics.RetrieveAPIView):
    """
    Returns a single discipline.
    """
    model = Discipline
    serializer_class = DisciplineSerializer
