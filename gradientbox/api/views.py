from django.shortcuts import render
from django.http import HttpResponse
from api.models import Gradient

def index(request):
    return render(request, 'api/index.html', context=None)

def getRandomGradient(request):
    return HttpResponse("This will be a random gradient.")

def addGradient(request)
    test='hello'
    return HttpResponse(test)








