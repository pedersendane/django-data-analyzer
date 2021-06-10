from django.urls import path
from . import views

app_name = 'fileupload'
urlpatterns = [
    # /fileupload/
    path('', views.upload_file, name='upload'),

]