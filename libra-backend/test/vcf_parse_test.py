from cyvcf2 import VCF
import json

variants = {}
def summary(vcf):
	cnt = 0
	for variant in vcf: 
			v = {}
			
			"""
			print("id: ", cnt)
			cnt+=1
			print("Chrom: ", variant.CHROM, " Pos:", variant.POS)
			print("Ref allele: ", variant.REF)
			print("Alt allele(s)", variant.ALT)
			if variant.INFO.get('DB') is not None:
				print("dbSNP: ", variant.INFO["DB"])
			if cnt == 7:
				variant.INFO["DB"] = True
			if variant.INFO.get('AF') is not None:
				print("Allele frequency: ", variant.INFO["AF"])
			print() """
			v = {}
			v['chr'] = variant.CHROM
			v['pos'] = variant.POS
			v['ref'] = variant.REF
			v['alt'] = variant.ALT
			v['dbSnp'] = variant.INFO.get('DB')
			v['freq'] = variant.INFO.get('AF')
			variants[str(cnt)] = v 
			cnt+=1

vcf = VCF('sample.vcf')
summary(vcf)

print(json.dumps(variants))
