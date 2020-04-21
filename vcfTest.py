import vcf


vcf_reader = vcf.Reader(filename="06A010111.vcf.gz")

for record in vcf_reader:
    print( record.INFO['ANN'] )
