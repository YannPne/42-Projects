import Ball from "./ball";
import Player from "./player";

enum GameState {
  CREATING, IN_GAME, SHOW_WINNER
}

export default class Game {
  readonly winScore: number = 5;
  readonly width: number = 1200;
  readonly height: number = 600;

  readonly name: string;
  readonly uid: string;
  state: GameState = GameState.CREATING;
  ball: Ball = new Ball(this);
  players: Player[] = [];

  constructor(name: string, uid: string) {
    this.name = name;
    this.uid = uid;
  }

  checkWin() {
    let player: Player;

    if (this.ball.x < 0)
      player = this.players[0];
    else if (this.ball.x + this.ball.size > this.width)
      player = this.players[1];
    else
      return false;

    player.score++;
    if (player.score >= this.winScore) {
      this.players.splice(0, 2);
      this.players.push(player);
    }

    if (this.players.length == 1) {
      this.state = GameState.SHOW_WINNER;
      return true;
    }

    this.ball.resetPos();
    this.players[0].x = 30;
    this.players[0].y = (this.height - this.players[0].height) / 2
    this.players[1].x = this.width - this.players[1].width - 30;
    this.players[1].y = (this.height - this.players[1].height) / 2
    return true;
  }

  async loop() {

  }
}


//
//     async def loop(self, ws: "GameConsumer"):
//         player1 = self.players[0]
//         player2 = self.players[1]
//
//         player1.x = 30
//         player2.x = self.width - self.players[1].width - 30
//
//         while self.state == GameState.ON_GAME:
//             start_time = time.time()
//
//             try:
//                 self.ball.move()
//                 player1.move()
//                 player2.move()
//                 self.ball.update_speed(player1, player2)
//                 if self.check_win():
//                     if self.state ==GameState.SHOW_WINNER:
//                         break
//                     player1 = self.players[0]
//                     player2 = self.players[1]
//
//                 await ws.channel_layer.group_send(ws.room_group_name, {
//                     "type": "send_json",  # required by channel_layer
//                     "event": "update",
//                     "ball": {
//                         "x": self.ball.x,
//                         "y": self.ball.y,
//                         "size": self.ball.size
//                     },
//                     "players": [
//                         player1.to_json(),
//                         player2.to_json()
//                     ]
//                 })
//             except Exception as e:
//                 print(f"Unexpected error thrown: {e}", file=sys.stderr)
//                 break
//
//             await asyncio.sleep(max(0.0, 0.01 - time.time() + start_time))
//
//         await ws.channel_layer.group_send(ws.room_group_name, {
//             "type": "send_json",  # required by channel_layer
//             "event": "win",
//             "player": self.players[0].name
//         })
//
//
// games: list[Game] = []
