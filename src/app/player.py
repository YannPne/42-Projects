from typing import TYPE_CHECKING
from datetime import datetime, timedelta

if TYPE_CHECKING:
    from .game import Game

class Player:
    def __init__(self, game: "Game", name: str, is_ai: bool):
        self.game: "Game" = game
        self.name: str = name
        self.is_ai: bool = is_ai
        self.width: float = 20
        self.height: float = 200
        self.x: float = 0
        self.y: float = (game.height - self.height) / 2
        self.time_move: datetime = datetime.now()
        self.go_up: bool = False
        self.go_down: bool = False
        self.ai_target_y = self.y + self.height / 2
        self.score: int = 0

    def move(self):
        if self.is_ai:
            self.play_ai()

        if self.go_up:
            self.y -= 5
        if self.go_down:
            self.y += 5
        self.y = min(max(self.y, 0), self.game.height - self.height)

    def play_ai(self):
        if self.time_move + timedelta(seconds=1) <= datetime.now():
            self.time_move = datetime.now()
            ball = self.game.ball
            if ball.speed_x != 0 and ball.speed_x * (self.x - self.game.width / 2) >= 0:
                ball_x = ball.x
                if self.x > self.game.width / 2:
                    ball_x += ball.size
                ball_y = ball.y + ball.size / 2
                self.ai_target_y = (self.x - ball_x) * ball.speed_y / ball.speed_x + ball_y

        center_y = self.y + self.height / 2
        self.go_up = center_y > self.ai_target_y + 30
        self.go_down = center_y < self.ai_target_y - 30

    def to_json(self):
        return {
            "name": self.name,
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "score": self.score
        }
