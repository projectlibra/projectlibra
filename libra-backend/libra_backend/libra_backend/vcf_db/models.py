from django.db import models

# Create your models here.
class VCF(models.Model):
    chrom = models.CharField(max_length=2)
    start = models.IntegerField()
    end = models.IntegerField()
    vcf_id = models.CharField(max_length=10)
    variant_id = models.IntegerField()
    anno_id = models.IntegerField()
    ref = models.CharField(max_length=1)
