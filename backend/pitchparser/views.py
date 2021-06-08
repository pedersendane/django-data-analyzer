from django.shortcuts import render
from rest_framework import viewsets          
from .serializers import PitchParserSerializer      
from .models import PitchParser                     
        
class PitchParserView(viewsets.ModelViewSet):       
  serializer_class = PitchParserSerializer          
  queryset = PitchParser.objects.all()  
  