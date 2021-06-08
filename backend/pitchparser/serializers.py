
# todo/serializers.py

from rest_framework import serializers
from .models import PitchParser
      
class PitchParserSerializer(serializers.ModelSerializer):
  class Meta:
    model = PitchParser
    fields = ('id', 'title', 'file')