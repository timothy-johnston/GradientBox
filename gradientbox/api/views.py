from django.shortcuts import render
from django.http import HttpResponse

def getRandomGradient(request):
    return HttpResponse("This will be a random gradient.")

