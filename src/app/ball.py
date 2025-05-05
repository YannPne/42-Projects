from __future__ import annotations
from .player import Player


class Ball:
    def __init__(self, game: Game):
        self.game: Game = game
        self.size: float = 50
        self.x: float = 0
        self.y: float = 0
        self.speed_x: float = 0
        self.speed_y: float = 0
        self.angle: float = 100
        self.reset_pos()

    def reset_pos(self):
        self.x: float = (self.game.width - self.size) / 2
        self.y: float = (self.game.height - self.size) / 2
        self.speed_x: float = 3
        self.speed_y: float = 0

    def move(self):
        self.x += self.speed_x
        self.y += self.speed_y

    def impact_player(self, player: Player):
        self.speed_x *= -1
        self.speed_y = (self.y - (player.y + player.height / 2)) / self.angle
        if 0 < self.speed_x < 40:
            self.speed_x += 0.6
        elif self.speed_x > -40:
            self.speed_x -= 0.6

    def update_speed(self, player1: Player, player2: Player):
        if self.y + self.size >= self.game.height or self.y <= 0:
            self.speed_y *= -1
        elif self.x <= player1.x + player1.width and self.y + self.size >= player1.y and self.y < player1.y + player1.height:
            self.impact_player(player1)
        elif self.x + self.size >= player2.x and self.y + self.size >= player2.y and self.y < player2.y + player2.height:
            self.impact_player(player2)
