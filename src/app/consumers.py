from channels.generic.websocket import AsyncJsonWebsocketConsumer
import asyncio

from .game import Game, GameState, games
from .player import Player
import sys


class GameConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.loop_task: asyncio.Task | None = None
        self.game: Game | None = None
        self.room_name: str | None = None
        self.room_group_name: str | None = None

    async def connect(self):
        uid = self.scope["url_route"]["kwargs"]["uid"]

        self.room_name = uid
        self.room_group_name = uid

        for game in games:
            if game.uid == uid:
                self.game = game
                game.players.append(Player(game, "Player", False))
                break

        if self.game is None:
            query = self.scope["query_string"].decode("utf-8").split("&")
            name = "Game"
            for q in query:
                if q.split("=")[0] == "name":
                    name = q.split("=")[1]
                    break

            self.game = Game(name, uid)
            self.game.players.append(Player(self.game, "Player", False))
            games.append(self.game)

        await self.accept()
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        games.remove(self.game)
        if self.loop_task is not None:
            self.loop_task.cancel()

    async def receive_json(self, content, **kwargs):
        match content["event"]:
            case "add_player" if self.game.state == GameState.CREATING:
                self.game.players.append(Player(self.game, content["name"], content["is_ai"]))
                print("Add player " + content["name"])
            case "start" if self.game.state == GameState.CREATING:
                self.game.state = GameState.ON_GAME
                if len(self.game.players) == 0:
                    self.game.players.append(Player(self.game, "Player1", False))
                if len(self.game.players) % 2 != 0:
                    self.game.players.append(Player(self.game, "IA", True))
                self.loop_task = asyncio.create_task(self.game.loop(self))
                print("Start game")
            case "move" if self.game.state == GameState.ON_GAME:
                player = self.game.players[content["id"]]
                if not player.is_ai:
                    if "up" in content:
                        player.go_up = content["up"]
                    if "down" in content:
                        player.go_down = content["down"]

        sys.stdout.flush()
