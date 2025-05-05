from __future__ import annotations
from datetime import datetime, timedelta


class Player:
    def __init__(self, game: Game, name: str, is_ai: bool):
        self.game: Game = game
        self.name: str = name
        self.is_ai: bool = is_ai
        self.width: float = 20
        self.height: float = 200
        self.x: float = 0
        self.y: float = (game.height - self.height) / 2
        self.time_move: datetime = datetime.now()
        self.go_up: bool = False
        self.go_down: bool = False
        self.speed: float = 0
        self.target_y = self.y + self.height / 2
        self.score: int = 0

    def move(self):
        if self.go_up:
            self.y -= 5
        if self.go_down:
            self.y += 5
        self.y = min(max(self.y, 0), self.game.height - self.height)

    def play_ai(self):
        if self.time_move + timedelta(seconds=1) < datetime.now():
            self.target_y = self.game.ball.y
            self.time_move = datetime.now()

        center_y = self.y + self.height / 2

        if center_y > self.target_y + 30:
            self.speed = -1
        elif center_y < self.target_y - 30:
            self.speed = 1
        else:
            self.speed = 0

    def to_json(self):
        return {
            "name": self.name,
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "score": self.score
        }
