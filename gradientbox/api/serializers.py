from rest_framework import serializers
from .models import Gradient

class GradientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Gradient
        fields = ('gradient_css', 'gradient_name', 'gradient_author')