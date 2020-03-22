
from django.db import models

# Create your models here.

class Post(models.Model):
    filename = models.CharField(max_length=100)
    vcf = models.FileField(upload_to='post_vcf')
    
    def __str__(self):
        return self.filename