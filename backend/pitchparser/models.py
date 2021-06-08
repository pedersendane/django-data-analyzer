from django.db import models

class PitchParser(models.Model):
  title = models.CharField(max_length=200)
  file = models.FileField()
  
  def __str__(self):
    return self.value