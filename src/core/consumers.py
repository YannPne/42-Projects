from channels.generic.websocket import AsyncWebsocketConsumer
import json

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data="🟢 WebSocket connecté")

    async def disconnect(self, close_code):
        print(f"Déconnexion : {close_code}")

    async def receive(self, text_data):
        print(f"Message reçu : {text_data}")
        await self.send(text_data=f"PONG : {text_data}")
