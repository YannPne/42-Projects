import asyncio
import json
import sys
import time
from enum import Enum
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .player import Player
from .ball import Ball


class GameState(Enum):
    CREATING = 0
    ON_GAME = 1
    SHOW_WINNER = 2


class Game:
    def __init__(self, name: str, uid: str):
        self.name = name
        self.uid = uid
        self.width: float = 1200
        self.height: float = 600
        self.state: GameState = GameState.CREATING
        self.win_score: int = 5
        self.ball: Ball = Ball(self)
        self.players: list[Player] = []

    def check_win(self) -> bool:
        if self.ball.x < 0:
            player = self.players[1]
        elif self.ball.x > self.width:
            player = self.players[0]
        else:
            return False

        player.score += 1
        if player.score >= self.win_score:
            self.players.pop(0)
            self.players.pop(0)
            self.players.append(player)

        if len(self.players) == 1:
            self.state = GameState.SHOW_WINNER

        self.ball.reset_pos()
        return True

    async def loop(self, ws: AsyncJsonWebsocketConsumer):
        player1 = self.players[0]
        player2 = self.players[1]

        player1.x = 30
        player2.x = self.width - self.players[1].width - 30

        while self.state == GameState.ON_GAME:
            start_time = time.time()

            try:
                self.ball.move()
                player1.move()
                player2.move()
                self.ball.update_speed(player1, player2)
                if self.check_win():
                    player1 = self.players[0]
                    player2 = self.players[1]
                    player1.x = 30
                    player2.x = self.width - self.players[1].width - 30

                await ws.channel_layer.group_send(ws.room_group_name, {
                    "type": "send_json", # required by channel_layer
                    "event": "update",
                    "ball": {
                        "x": self.ball.x,
                        "y": self.ball.y,
                        "size": self.ball.size
                    },
                    "players": [
                        player1.to_json(),
                        player2.to_json()
                    ]
                })
            except Exception as e:
                print(f"Unexpected error thrown: {e}", file=sys.stderr)
                break

            await asyncio.sleep(max(0.0, 0.01 - time.time() + start_time))

        await ws.channel_layer.group_send(ws.room_group_name, {
            "type": "send_json", # required by channel_layer
            "event": "win",
            "player": player1.name
        })


games: list[Game] = []
