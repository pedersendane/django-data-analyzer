from django.db import models

class FileUpload(models.Model):
    file = models.FileField()
      
    def __str__(self):
        return self.file
    
    def delete(self, *args, **kwargs):
        self.file.delete()
        super().delete(*args, **kwargs)

