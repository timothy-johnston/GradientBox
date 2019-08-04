from django.urls import path
from . import views

urlpatterns = [
    path('randomgradient', views.getRandomGradient, name='getRandomGradient'),
]