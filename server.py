import asyncio
import websockets
import json

connected = set()

async def handler(websocket, path):
    # Register.
    msg = await websocket.recv()
    print("Received: ", msg)
    if msg == 'SEND_PREVIEW':
      f_name = await websocket.recv()
      f = open("./libra-backend/libra_backend/media/post_vcf/" + f_name)
      content = f.read()
      print(content)
      f.close()
      msg = {}
      msg['command'] = "receive_preview"
      msg['preview'] = content
      print(json.dumps(msg))
    await websocket.send(json.dumps(msg))

start_server = websockets.serve(handler, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()