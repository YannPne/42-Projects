from datetime import datetime, timedelta
from game import Game


class Player:
    name: str
    isAI: bool
    x: float = 0
    y: float
    width: float = 20
    height: float = 200
    time_move: datetime = datetime.now()
    speed: float = 0
    target_y: float

    game: Game

    def __init__(self, game: Game):
        self.game = game
        y = (game.width - self.height) / 2
        self.target_y = y + self.height / 2

    def play_ai(self):
        if self.time_move + timedelta(seconds=1) < datetime.now():
            self.target_y = self.game.ball.y
            self.time_move = datetime.now()

        middle_player1_y = self.y + self.height / 2

        self.speed = self.game.ball.speed
        if middle_player1_y > self.target_y + 30:
            self.speed = -self.speed
        elif middle_player1_y < self.target_y - 30:
            self.speed = self.speed
        else:
            self.speed = 0
