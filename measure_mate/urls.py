from django.conf.urls import url, include
from django.views.generic import TemplateView
from django.contrib import admin
from rest_framework import routers
from views import *


router = routers.DefaultRouter()
router.register(r'templates', TemplateViewSet)
router.register(r'attributes', AttributeViewSet)
router.register(r'tags', TagViewSet)
router.register(r'measurements', MeasurementViewSet)
router.register(r'assessments', AssessmentViewSet)
router.register(r'ratings', RatingViewSet)
router.register(r'teams', TeamViewSet)

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
    url(r'^api/api-auth/', include(
        'rest_framework.urls', namespace='rest_framework')),
    url(r'^docs/', include('rest_framework_swagger.urls')),
    url(r'^$', home, name='home'),

]
