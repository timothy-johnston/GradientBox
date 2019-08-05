from rest_framework import viewsets
from django.shortcuts import render
from django.http import HttpResponse
from api.models import Gradient
from django.core import serializers
from .serializers import GradientSerializer
from rest_framework.renderers import JSONRenderer
import random

def index(request):
    return render(request, 'api/index.html', context=None)

def getRandomGradient(request):

    #Get all gradients from db
    queryset = Gradient.objects.all()

    #Choose a gradient at random
    randomGradient = Gradient.objects.filter(pk = random.randint(12, len(queryset)))

    #Serialize to JSON
    serializer = GradientSerializer(randomGradient, many=True)
    serializedGradient = JSONRenderer().render(serializer.data)

    return HttpResponse(serializedGradient)


class GradientViewSet(viewsets.ModelViewSet):
    queryset = Gradient.objects.all()
    serializer_class = GradientSerializer








