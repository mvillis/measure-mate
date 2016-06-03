from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from django.views.generic.base import RedirectView
from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.urlresolvers import reverse_lazy
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
    url(r'^healthcheck/?$', healthcheck, name='healthcheck'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
    url(r'^api/api-auth/', include(
        'rest_framework.urls', namespace='rest_framework')),
    url(r'^export/', export_data, name='export'),
    url(r'^favicon\.ico', RedirectView.as_view(url=staticfiles_storage.url('assets/favicon.ico')), name='favicon'),
    url(r'^robots\.txt', robots_txt, name='robots'),
    url(r'^.*$', home, name='home'),
]
