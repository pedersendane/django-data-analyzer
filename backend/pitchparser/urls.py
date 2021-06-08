from django.urls import path
from . import views

app_name = 'pitchparser'
urlpatterns = [
    # /fileupload/
    path('', views.PitchParserView.index),
    path('<str:title>', views.PitchParserView.detail)
]
