from django.urls import path
from . import views

app_name = 'pitchparser'
urlpatterns = [
    # /fileupload/
    path('<title>', views.PitchParserView),

]