from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from views import DisciplineViewSet, CapabilityViewSet, LevelViewSet


router = routers.DefaultRouter()
router.register(r'disciplines', DisciplineViewSet)
router.register(r'capabilities', CapabilityViewSet)
router.register(r'levels', LevelViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include(router.urls)),
    # url(r'^matrix/(?P<pk>[\d]+)/$', views.MatrixView.as_view(), name='matris'),
    url(r'^api-auth/', include(
        'rest_framework.urls', namespace='rest_framework'))
]
