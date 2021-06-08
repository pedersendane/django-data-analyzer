from django.contrib import admin
from .models import PitchParser 
    
class PitchParserAdmin(admin.ModelAdmin):  
  list_display = ('title', 'file') 
        
admin.site.register(PitchParser, PitchParserAdmin) 