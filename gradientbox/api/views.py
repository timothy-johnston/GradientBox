from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'api/index.html', context=None)

def getRandomGradient(request):
    print ('Hello, world!')
    return HttpResponse("This will be a random gradient.")

# def addGradient()

