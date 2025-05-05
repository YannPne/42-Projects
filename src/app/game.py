from enum import Enum
from player import Player
from ball import Ball

class GameState(Enum):
    CREATING = 0
    ON_GAME = 1
    SHOW_WINNER = 2

class Game:
    players: list[Player] = []
    ball: Ball
    width: float = 1200
    height: float = 600
    state: GameState = GameState.CREATING
    win_score: int = 5

    def __init__(self):
        self.ball = Ball(self)

    def check_win(self):
        if not 0 >= self.ball.x > self.width:
            player: Player = self.players[0 if self.ball.x < 0 else 1]
            player.score += 1
            if player.score >= self.win_score:
                self.state = GameState.SHOW_WINNER

    def loop(self):
        if self.state == GameState.ON_GAME:
            self.ball.move()
            self.ball.update_speed(self.players[0], self.players[1])
            self.check_win()



games: list[Game] = []

