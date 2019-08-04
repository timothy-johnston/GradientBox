from django.db import models

class Gradient(models.Model):
    gradient_css = models.CharField(max_length = 256)
    gradient_name = models.CharField(max_length = 256)
    gradient_author = models.CharField(max_length = 256)
    def __str__(self):
        return (self.gradient_css) 

