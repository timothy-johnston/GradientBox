from django.urls import path
from . import views

app_name = 'api'
urlpatterns = [
    path('', views.index, name='index'),
    path('randomgradient', views.getRandomGradient, name='getRandomGradient'),
    path('addgradient', views.addGradient, name='addGradient'),
]