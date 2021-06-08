from django.contrib import admin
from django.urls import path, include                 
from rest_framework import routers                    
from pitchparser import views
         
    
urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload-file/', include('fileupload.urls')),
    path('parse/', include('pitchparser.urls')),        
    #path('api/', include(router.urls))                
]