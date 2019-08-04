from django.urls import include, path
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'gradients', views.GradientViewSet)


app_name = 'api'
urlpatterns = [
    path('', views.index, name='index'),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/randomgradient', views.getRandomGradient, name='getRandomGradient'),
]