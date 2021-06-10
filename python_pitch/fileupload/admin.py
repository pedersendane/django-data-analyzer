from django.contrib import admin
from .models import FileUpload 
    
class FileUploadAdmin(admin.ModelAdmin):  
  list_display = ('file',) 
        
admin.site.register(FileUpload, FileUploadAdmin) 