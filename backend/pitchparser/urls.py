from django.urls import path
from . import views

app_name = 'pitchparser'
urlpatterns = [
    # /fileupload/
    path('upload-list', views.upload_list, name='index'),
    path('<str:file>', views.detail, name='results'),
]
