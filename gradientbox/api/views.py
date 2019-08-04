from rest_framework import viewsets
from django.shortcuts import render
from django.http import HttpResponse
from api.models import Gradient
from .serializers import GradientSerializer

def index(request):
    return render(request, 'api/index.html', context=None)

def getRandomGradient(request):
    return HttpResponse("This will be a random gradient.")

# def addGradient(request):
#     print ("testing")
#     print (request.data)
#     return HttpResponse("it was a test")

class GradientViewSet(viewsets.ModelViewSet):
    queryset = Gradient.objects.all()
    serializer_class = GradientSerializer








