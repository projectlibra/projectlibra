from cyvcf2 import VCF

def summary(vcf):
	for variant in vcf:
	    
	    print("Chrom: ", variant.CHROM, " Pos:", variant.POS)
	    print("Ref allele: ", variant.REF)
	    print("Alt allele(s)", variant.ALT)

	    if variant.INFO.get('AF') is not None:
	        print("Allele frequency: ", variant.INFO["AF"])
	    print()

vcf = VCF('sample.vcf.gz')
summary(vcf)