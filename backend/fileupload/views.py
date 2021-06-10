from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from .forms import FileUploadForm
from .models import FileUpload
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os
 
def get(request):
    return render(request,'upload.html')

#TODO remove this in prod. I had to put this to get the front and backend to play nice together
@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        form = FileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            file = str(form.cleaned_data['file'])
            file = format_title(file)
            path = os.path.join(settings.MEDIA_ROOT, file)
            if (default_storage.exists(path)):
                os.remove(path)
            form.save()
            return HttpResponseRedirect('/parse/' + file)
            
            
        else:
            form = FileUploadForm()
        return render(request, 'upload.html', {'form': form})

    if request.method == 'GET':
        form = FileUploadForm()
        return render(request, 'upload.html', {'form': form})

def format_title(title):
    return title.replace(" ", "_").replace(")", "").replace("(","")
    
    