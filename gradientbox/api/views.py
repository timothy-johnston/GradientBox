from rest_framework import viewsets
from django.shortcuts import render
from django.http import HttpResponse
from api.models import Gradient
from django.core import serializers
from .serializers import GradientSerializer
from rest_framework.renderers import JSONRenderer
from django.views.decorators.csrf import ensure_csrf_cookie

import random

@ensure_csrf_cookie
def index(request):
    return render(request, 'api/index.html', context=None)

def getRandomGradient(request):

    #Get all gradients from db
    queryset = Gradient.objects.all()

    #Choose a gradient at random
    randomGradient = queryset

    queryset._result_cache = None


    #Serialize to JSON
    serializer = GradientSerializer(randomGradient[random.randint(1, len(queryset) - 1)], many=False)
    serializedGradients = JSONRenderer().render(serializer.data)
    randomGradient = serializedGradients[random.randint(1, len(queryset) - 1)]

    return HttpResponse(serializedGradients)
    #return HttpResponse(random.randint(1, len(queryset)))


class GradientViewSet(viewsets.ModelViewSet):
    queryset = Gradient.objects.all()
    serializer_class = GradientSerializer








