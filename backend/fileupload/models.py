from django.db import models

class FileUpload(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField()
      
    def __str__(self):
        return self.title
    
    def delete(self, *args, **kwargs):
        self.file.delete()
        super().delete(*args, **kwargs)

