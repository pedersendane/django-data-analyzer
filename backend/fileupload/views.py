from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from .forms import FileUploadForm
from .models import FileUpload
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os
 
 

#TODO remove this in prod. I had to put this to get the front and backend to play nice together
@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        form = FileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            title = formatTitle(form.cleaned_data['title'])
            print(title)
            path = os.path.join(settings.MEDIA_ROOT, title)
            if (default_storage.exists(path)):
                os.remove(path)
            form.save()
            return HttpResponseRedirect('/parse/' + title)
        else:
            form = FileUploadForm()
        return render(request, 'upload.html', {'form': form})

def formatTitle(title):
    return title.replace(" ", "").replace(")", "").replace("(","")
    
    