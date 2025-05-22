import { loadPage, type Page } from "./Page.ts";
import { ws } from "../main.ts";
import type { Ball, Event, Player } from "../Event.ts";
import { chooseGamePage } from "./chooseGamePage.ts";
import { ArcRotateCamera, Color3, Color4, Engine, HemisphericLight, MeshBuilder, Scene, SpotLight, StandardMaterial, Texture, Vector3} from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

// TODO: Leave game

let wsListener: ((event: MessageEvent) => void) | undefined;
let keydownListener: ((event: KeyboardEvent) => void) | undefined;
let keyupListener: ((event: KeyboardEvent) => void) | undefined;

export const pongPage: Page<any> = {
  url: "/pong",
  title: "Pong",
  navbar: false,

  getPage(): string {
    return `
      <div class="flex flex-col items-center justify-center h-full w-full p-5">
        <div class="pb-5 w-full flex justify-around">
          <button id="start" class="p-2 rounded-xl bg-blue-900 hover:bg-blue-950 cursor-pointer">Start game</button>
          <form id="addLocalForm" class="bg-gray-900 items-center justify-center">
            <input id="addLocalName" type="text" required placeholder="Local player's name" class="p-2 placeholder-gray-400">
            <label for="addLocalCheck">Is AI?</label>
            <input id="addLocalCheck" type="checkbox" required>
            <button class="p-2 bg-blue-900 hover:bg-blue-950">Add local player</button>
          </form>
        </div>
        <canvas id="game2d" width="1200" height="600" class="w-[90%] aspect-[2/1] bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950"></canvas>
        <canvas id="game3d" width="1200" height="600" class="w-[90%] aspect-[2/1] not-focus-visible"></canvas>
        <input id="is3d" type="checkbox">
      </div>
    `;
  },

  onMount(data) {
    if (data != undefined) {
      ws!.send(JSON.stringify(data)); // join_game event
    } else {
      loadPage(chooseGamePage);
      return;
    }

    // Header
    const start = document.querySelector<HTMLButtonElement>("#start")!;
    const addLocalName = document.querySelector<HTMLInputElement>("#addLocalName")!;
    const addLocalCheck = document.querySelector<HTMLInputElement>("#addLocalCheck")!;
    const addLocalForm = document.querySelector<HTMLButtonElement>("#addLocalForm")!;
    // Game
    const canvas2d = document.querySelector<HTMLCanvasElement>("#game2d")!;
    const context2d = canvas2d.getContext("2d")!;
    const canvas3d = document.querySelector<HTMLCanvasElement>("#game3d")!;
    let context3d = setup3d(canvas3d);
    const is3d = document. querySelector<HTMLInputElement>("#is3d")!;

    start.onclick = () => {
      ws!.send(JSON.stringify({ event: "play" }));
    };

    addLocalForm.onsubmit = event => {
      event.preventDefault();

      if (addLocalName.value.trim() != "") {
        ws!.send(JSON.stringify({ event: "add_local_player", name: addLocalName.value, isAi: addLocalCheck.checked }));
        addLocalName.value = "";
        addLocalCheck.checked = false;
      }
    };

    document.addEventListener("keydown", keydownListener = event => {
      if (!event.repeat)
        move(event, false);
    });

    document.addEventListener("keyup", keyupListener = event => {
      move(event, true);
    });

    canvas3d.style.display = "none";
    is3d.onclick = () => {
      if (is3d.checked) {
        canvas2d.style.display = "none";
        canvas3d.style.display = "inline";
      } else {
        canvas2d.style.display = "inline";
        canvas3d.style.display = "none";
      }
    }

    ws?.addEventListener("message", wsListener = (event) => {
      const message: Event = JSON.parse(event.data);

      switch (message.event) {
        case "update":
          if (is3d.checked) {
            context3d.ball.position.set(message.ball.x + 25, -message.ball.y - 25, 0);
            context3d.player2.position.set(message.players[1].x + 10, -message.players[1].y - 100, 5);
            context3d.player1.position.set(message.players[0].x + 10, -message.players[0].y - 100, 5);
            //drawScore(canvas3d, context2d, message.players[0], message.players[1]);
            drawScore3D( context3d, message.players[0], message.players[1]);
          } else {
            drawMap(canvas2d, context2d);
            for (let player of message.players)
              drawPlayer(context2d, player);
            drawBall(context2d, message.ball);
            drawScore(canvas2d, context2d, message.players[0], message.players[1]);
          }

          break;
        case "win":
          context3d.textNameP1.text = "";
          context3d.textNameP2.text = "";

          drawEndGame(canvas2d, context2d, message.player);
          break;
      }
    });
  },

  onUnmount() {
    if (keydownListener != undefined)
      document.removeEventListener("keydown", keydownListener);
    if (keyupListener != undefined)
      document.removeEventListener("keyup", keyupListener);
    if (wsListener != undefined)
      ws?.removeEventListener("message", wsListener);
    keydownListener = undefined;
    keyupListener = undefined;
    wsListener = undefined;
  }
};

function move(event: KeyboardEvent, up: boolean) {
  let send: Partial<Event> = { event: "move" };

  if (event.code == "KeyW" || event.code == "ArrowUp")
    send.goUp = !up;
  else if (event.code == "KeyS" || event.code == "ArrowDown")
    send.goDown = !up;
  else
    return;

  send.id = event.code == "ArrowUp" || event.code == "ArrowDown" ? 1 : 0;

  ws?.send(JSON.stringify(send));
}

function setup3d(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0, 0);

  // CAMERA //
  const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, -2000, new Vector3(600, 0, 275), scene);
  camera.attachControl(canvas, true);

  // TARGET //
  const targetPoint = new Vector3(600, -300, 25);

  // LIGHT //
  const lightPosition1 = new Vector3(600, 5000, 0);
  const lightPosition2 = new Vector3(600, -5600, 100);
  const lightPosition3 = new Vector3(-5000, -300, 0);
  const lightPosition4 = new Vector3(5600, -300, 0);

  const lightDirection1 = targetPoint.subtract(lightPosition1).normalize();
  const lightDirection2 = targetPoint.subtract(lightPosition2).normalize();
  const lightDirection3 = targetPoint.subtract(lightPosition3).normalize();
  const lightDirection4 = targetPoint.subtract(lightPosition4).normalize();

  const light = new HemisphericLight("HemiLight", new Vector3(0, 0, -1), scene);
  light.diffuse = new Color3(1, 1, 1);
  light.specular = new Color3(1, 1, 1);
  light.groundColor = new Color3(0.2, 0.2, 0.5);

  const spotLight1 = new SpotLight("spotLight1", lightPosition1, lightDirection1, Math.PI / 4, 2, scene );
  const spotLight2 = new SpotLight("spotLight2", lightPosition2, lightDirection2, Math.PI / 4, 2, scene );
  const spotLight3 = new SpotLight("spotLight3", lightPosition3, lightDirection3, Math.PI / 4, 2, scene );
  const spotLight4 = new SpotLight("spotLight4", lightPosition4, lightDirection4, Math.PI / 4, 2, scene );

  spotLight1.intensity = 1;
  spotLight2.intensity = 1;
  spotLight3.intensity = 1;
  spotLight4.intensity = 1;

  // MATERIAL //
  const material42 = new StandardMaterial("material42", scene);
  material42.diffuseTexture = new Texture("/42-Perpignan-white500x170.png", scene);
  material42.diffuseTexture.hasAlpha = true;

  const materialBlackMat = new StandardMaterial("materialBlackMat", scene);
  materialBlackMat.specularColor = new Color3(0.2, 0.2, 0.2);
  materialBlackMat.diffuseColor  = new Color3(0.1, 0.1, 0.1);
  materialBlackMat.emissiveColor = new Color3(0, 0, 0);

  const materialBlueMat = new StandardMaterial("materialRedMat", scene);
  materialBlueMat.specularColor = new Color3(0.13 / 255, 0.03 / 255, 261.69 / 255);
  materialBlueMat.diffuseColor  = new Color3(0.1, 0.1, 0.1);
  materialBlueMat.emissiveColor = new Color3(0, 0, 0);
  // console.log(materialRedMat, Color3);

  const ledMaterial = new StandardMaterial("ledMaterial", scene);
  ledMaterial.emissiveColor = new Color3(1, 1, 1);

  //const glowLayer = new GlowLayer("glow", scene);
  //glowLayer.intensity = 0.2;
  //glowLayer.addIncludedOnlyMesh(ledPlane);

  const ball = MeshBuilder.CreateSphere("ball", { diameter: 50 }, scene);
  ball.position.set(600, -300, 200);
  //const table = new TransformNode("table", scene);

  const box1 = MeshBuilder.CreateBox("box1", { width: 1280, height: 680, depth: 100 }, scene);
  box1.position.set(600, -300, 75);
  box1.material = materialBlackMat;

  const box2 = MeshBuilder.CreateBox("box2", { width: 1240, height: 640, depth: 100 }, scene);
  box2.position.set(600, -300, 375);
  box2.material = materialBlackMat;

  const box3 = MeshBuilder.CreateBox("box3", { width: 1200, height: 600, depth: 200 }, scene);
  box3.position.set(600, -300, 225);
  box3.material = materialBlackMat;

  // band up
  const box4 = MeshBuilder.CreateBox("box4", { width: 1280, height: 20, depth: 50 }, scene);
  box4.position.set(600, 30, 0);
  box4.material = materialBlackMat;

  const box6 = MeshBuilder.CreateBox("box5", { width: 1280, height: 50, depth: 20 }, scene);
  box6.position.set(600, 15, -25);
  box6.material = materialBlackMat;

  const boxLight1 = MeshBuilder.CreateBox("boxLight1", { width: 1240, height: 1, depth: 50 }, scene);
  boxLight1.position.set(600, 19, 0);
  boxLight1.material = ledMaterial;

  // band down
  const box5 = MeshBuilder.CreateBox("box5", { width: 1280, height: 20, depth: 50 }, scene);
  box5.position.set(600, -630, 0);
  box5.material = materialBlackMat;

  const box7 = MeshBuilder.CreateBox("box5", { width: 1280, height: 50, depth: 20 }, scene);
  box7.position.set(600, -615, -25);
  box7.material = materialBlackMat;

  const boxLight2 = MeshBuilder.CreateBox("boxLight2", { width: 1240, height: 1, depth: 50 }, scene);
  boxLight2.position.set(600, -619, 0);
  boxLight2.material = ledMaterial;

  //left
  const box9 = MeshBuilder.CreateBox("box5", { width: 20, height: 680, depth: 50 }, scene);
  box9.position.set(-30, -300, 0);
  box9.material = materialBlackMat;

  const box10 = MeshBuilder.CreateBox("box5", { width: 20, height: 640, depth: 50 }, scene);
  box10.position.set(-19, -300, 0);
  box10.material = ledMaterial;

  const box11 = MeshBuilder.CreateBox("box5", { width: 50, height: 680, depth: 20 }, scene);
  box11.position.set(-15, -300, -25);
  box11.material = materialBlackMat;

  //right
  const box12 = MeshBuilder.CreateBox("box5", { width: 20, height: 680, depth: 50 }, scene);
  box12.position.set(1230, -300, 0);
  box12.material = materialBlackMat;

  const box13 = MeshBuilder.CreateBox("box5", { width: 20, height: 640, depth: 50 }, scene);
  box13.position.set(1219, -300, 0);
  box13.material = ledMaterial;

  const box14 = MeshBuilder.CreateBox("box5", { width: 50, height: 680, depth: 20 }, scene);
  box14.position.set(1215, -300, -25);
  box14.material = materialBlackMat;

  const plane1 = MeshBuilder.CreatePlane("plane", { width: 500, height: 170 }, scene);
  plane1.position.set(600, -600.5, 225);

  plane1.material = material42;
  plane1.rotation.set(-Math.PI / 2, 0 , 0);

  const plane2 = MeshBuilder.CreatePlane("plane", { width: 500, height: 170 }, scene);
  plane2.position.set(600, 0.5, 225);
  plane2.material = material42;
  plane2.rotation.set(Math.PI / 2, 0 , Math.PI);

  const plane3 = MeshBuilder.CreatePlane("plane", { width: 1240, height: 640 }, scene);
  plane3.position.set(600, -300, 126);
  plane3.material = ledMaterial;
  plane3.rotation.set(Math.PI, 0, 0);

  const plane4 = MeshBuilder.CreatePlane("plane", { width: 1200, height: 600 }, scene);
  plane4.position.set(600, -300, 24);
  plane4.material = materialBlueMat;

  //pied
  const box16 = MeshBuilder.CreateBox("box1", { width: 60, height: 60, depth: 60 }, scene);
  box16.position.set(30, -30, 455);
  box16.material = materialBlackMat;

  const box17 = MeshBuilder.CreateBox("box1", { width: 60, height: 60, depth: 60 }, scene);
  box17.position.set(30, -570, 455);
  box17.material = materialBlackMat;

  const box18 = MeshBuilder.CreateBox("box1", { width: 60, height: 60, depth: 60 }, scene);
  box18.position.set(1170, -30, 455);
  box18.material = materialBlackMat;

  const box19 = MeshBuilder.CreateBox("box1", { width: 60, height: 60, depth: 60 }, scene);
  box19.position.set(1170, -570, 455);
  box19.material = materialBlackMat;

  const player1 = MeshBuilder.CreateBox("player1", { width: 20, height: 200, depth: 40 }, scene);
  player1.position.set(600, -300, 200);
  const player2 = MeshBuilder.CreateBox("player2", { width: 20, height: 200, depth: 40 }, scene);
  player2.position.set(600, -300, 200);

  const planeScoreP1 = MeshBuilder.CreatePlane("label", { width: 600, height: 300 }, scene);
  planeScoreP1.position.set(300, -300, 23);
  const guiScoreP1 = GUI.AdvancedDynamicTexture.CreateForMesh(planeScoreP1);

  const planeScoreP2 = MeshBuilder.CreatePlane("label", { width: 600, height: 300 }, scene);
  planeScoreP2.position.set(900, -300, 23);
  const guiScoreP2 = GUI.AdvancedDynamicTexture.CreateForMesh(planeScoreP2);

  const textScoreP1 = new GUI.TextBlock();
  textScoreP1.text = "";
  textScoreP1.color = "white";
  textScoreP1.fontSize = 600;

  const textScoreP2 = new GUI.TextBlock();
  textScoreP2.text = "";
  textScoreP2.color = "white";
  textScoreP2.fontSize = 600;

  guiScoreP1.addControl(textScoreP1);
  guiScoreP2.addControl(textScoreP2);

  const planeNameP1 = MeshBuilder.CreatePlane("label", { width: 600, height: 600 }, scene);
  planeNameP1.position.set(300, -641, 62.5);
  planeNameP1.rotation.set(-Math.PI / 2,  0,  0);
  const guiNameP1 = GUI.AdvancedDynamicTexture.CreateForMesh(planeNameP1);

  const planeNameP2 = MeshBuilder.CreatePlane("label", { width: 600, height: 600 }, scene);
  planeNameP2.position.set(900, -641, 62.5);
  planeNameP2.rotation.set(-Math.PI / 2,  0,  0);
  const guiNameP2 = GUI.AdvancedDynamicTexture.CreateForMesh(planeNameP2);

  const textNameP1 = new GUI.TextBlock();
  textNameP1.text = "";
  textNameP1.color = "white";
  textNameP1.fontSize = 150;

  const textNameP2 = new GUI.TextBlock();
  textNameP2.text = "";
  textNameP2.color = "white";
  textNameP2.fontSize = 150;

  guiNameP1.addControl(textNameP1);
  guiNameP2.addControl(textNameP2);

  engine.runRenderLoop(() => {
    scene.render();
  });

  return {ball, player1, player2, textNameP1, textNameP2, textScoreP1, textScoreP2};
}

function drawMap(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.setLineDash([10, 15]);
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.strokeStyle = "#ffffff44";
  context.lineWidth = 4;
  context.stroke();
  context.setLineDash([]);
  context.shadowBlur = 20;
  context.shadowColor = "pink";
}

function drawPlayer(context: CanvasRenderingContext2D, player: Player) {
  context.fillStyle = "white";
  context.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall(context: CanvasRenderingContext2D, ball: Ball) {
  const drawX = Math.round(ball.x + ball.size / 2);
  const drawY = Math.round(ball.y + ball.size / 2);

  context.beginPath();
  context.arc(drawX, drawY, ball.size / 2, 0, 2 * Math.PI);
  context.fillStyle = "white";
  context.fill();
  context.closePath();
}

let scoreP1 = -1;
let scoreP2 = -1;
let nameP1IsSet = false;
let nameP2IsSet = false;

function  drawScore3D(context: any, player1: Player, player2: Player)
{
  if (scoreP1 != player1.score) {
    scoreP1 = player1.score;
    context.textScoreP1.text = String(player1.score);
  }

  if (scoreP2 != player2.score) {
    scoreP2 = player2.score;
    context.textScoreP2.text = String(player2.score);
  }

  if (!nameP1IsSet) {
    nameP1IsSet = true;
    context.textNameP1.text = String(player1.name);
  }

  if (!nameP2IsSet) {
    nameP2IsSet = true;
    context.textNameP2.text = String(player2.name);
  }

}

function drawScore(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, player1: Player, player2: Player) {
  context.font = "32px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.globalAlpha = 1;

  context.fillText(player1.name, canvas.width / 4, 20);
  context.fillText(player2.name, canvas.width / 4 * 3, 20);

  context.font = "150px Arial";
  context.textBaseline = "middle";
  context.globalAlpha = 0.4;

  context.fillText(player1.score.toString(), canvas.width / 4, canvas.height / 2);
  context.fillText(player2.score.toString(), canvas.width / 4 * 3, canvas.height / 2);

  context.globalAlpha = 1;
}

function drawEndGame(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, player: string) {
  context.font = "80px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(player + " win", canvas.width / 2, canvas.height / 4);
}
