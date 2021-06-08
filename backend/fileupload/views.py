from django.http import HttpResponseRedirect
from django.shortcuts import render
from .forms import FileUploadForm
from .models import FileUpload
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt

#TODO remove this in prod. I had to put this to get the front and backend to play nice together
@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        form = FileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            title = form.cleaned_data['title']
            form.save()
            return HttpResponseRedirect('/parse/' + title)
    else:
        form = FileUploadForm()
    return render(request, 'upload.html', {'form': form})

