import asyncio
import websockets
import json
from cyvcf2 import VCF
import os

connected = set()

async def handler(websocket, path):
    # Register.
    msg = await websocket.recv()
    print("Received: ", msg)
    if msg == 'SEND_PREVIEW':
      f_name = await websocket.recv()
      cmd = "tabix -p vcf ./libra-backend/libra_backend/media/post_vcf/" + f_name
      os.system(cmd)
      vcf = VCF("./libra-backend/libra_backend/media/post_vcf/" + f_name)
      variants = []
      cnt = 0
      for variant in vcf:   
          v = {}
          v['chr'] = variant.CHROM
          v['pos'] = variant.POS
          v['ref'] = variant.REF
          v['alt'] = variant.ALT
          v['dbSnp'] = variant.INFO.get('DB')
          v['freq'] = variant.INFO.get('AF')
          variants.append(v)
          cnt+=1

      #f = open("./libra-backend/libra_backend/media/post_vcf/" + f_name)
      content = "cont"
      print(content)
      #f.close()
      msg = {}
      msg['command'] = "receive_preview"
      msg['preview'] = content
      msg['vcf_data'] = variants
      print(json.dumps(msg))
    await websocket.send(json.dumps(msg))

start_server = websockets.serve(handler, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()