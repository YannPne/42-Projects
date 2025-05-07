from typing import TYPE_CHECKING
import asyncio
import sys
import time
from enum import Enum

from .player import Player
from .ball import Ball

if TYPE_CHECKING:
    from .consumers import GameConsumer

class GameState(Enum):
    CREATING = 0
    ON_GAME = 1
    SHOW_WINNER = 2


class Game:
    win_score: int = 5

    def __init__(self, name: str, uid: str):
        self.name = name
        self.uid = uid
        self.width: float = 1200
        self.height: float = 600
        self.state: GameState = GameState.CREATING
        self.ball: Ball = Ball(self)
        self.players: list[Player] = []

    def check_win(self) -> bool:
        if self.ball.x < 0:
            player = self.players[1]
        elif self.ball.x + self.ball.size > self.width:
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
            return True

        self.ball.reset_pos()
        self.players[0].x = 30
        self.players[0].y = (self.height - self.players[0].height) / 2
        self.players[1].x = self.width - self.players[1].width - 30
        self.players[1].y = (self.height - self.players[1].height) / 2
        return True

    async def loop(self, ws: "GameConsumer"):
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
                    if self.state ==GameState.SHOW_WINNER:
                        break
                    player1 = self.players[0]
                    player2 = self.players[1]

                await ws.channel_layer.group_send(ws.room_group_name, {
                    "type": "send_json",  # required by channel_layer
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
            "type": "send_json",  # required by channel_layer
            "event": "win",
            "player": self.players[0].name
        })


games: list[Game] = []
