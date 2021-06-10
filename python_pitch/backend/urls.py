from django.contrib import admin
from django.urls import path, include                 
from rest_framework import routers                    
from django.views.generic import TemplateView
from . import settings
         
    
urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html')),
    path('admin/', admin.site.urls),
    path('upload-file/', include('fileupload.urls')),
    path('parse/', include('pitchparser.urls')),  
    #path('api/', include(router.urls))                
]