from rest_framework import viewsets
from django.shortcuts import render
from django.http import HttpResponse
from api.models import Gradient
from django.core import serializers
from .serializers import GradientSerializer
import random

def index(request):
    return render(request, 'api/index.html', context=None)

def getRandomGradient(request):

    #Get all gradients from db
    queryset = Gradient.objects.all()

    #Choose a gradient at random
    randomGradient = Gradient.objects.filter(pk = random.randint(1, len(queryset)))

    #Serialize and return the randomly selected gradient
    return HttpResponse(serializers.serialize('json', randomGradient))

class GradientViewSet(viewsets.ModelViewSet):
    queryset = Gradient.objects.all()
    serializer_class = GradientSerializer








