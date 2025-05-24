import { loadPage, type Page } from "./Page.ts";
import { ws } from "../main.ts";
import type { Ball, Event, Player } from "../Event.ts";
import { chooseGamePage } from "./chooseGamePage.ts";
import { ArcRotateCamera, Color3, Color4, Engine, HemisphericLight, GlowLayer, MeshBuilder, Scene, SpotLight, StandardMaterial, Texture, Vector3, Mesh } from "@babylonjs/core";
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
        <div class="pb-5 w-full flex justify-around" id="up-bar">
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
        <div class="flex items-center space-x-4 mt-4">
          <span id="toggleText" class="text-lg font-medium text-white select-none cursor-pointer">Mode 3D</span>
          <button id="is3d" type="button"
            class="relative w-16 h-9 bg-gray-700 rounded-full transition-colors duration-300 ease-in-out focus:outline-none">
            <span
            id="toggleCircle"
            class="absolute left-1 top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out"></span>
          </button>
        </div>
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

    const toggleText = document.querySelector<HTMLSpanElement>("#toggleText")!;
    const toggleCircle = document.querySelector<HTMLSpanElement>("#toggleCircle")!;
    const myDiv = document.querySelector<HTMLDivElement>("#up-bar");

    let is3dActive = true; // état initial, tu peux aussi initialiser selon ta logique

    function updateToggleUI() {
      toggleText.textContent = is3dActive ? "Mode 3D" : "Mode 2D";
      toggleCircle.style.transform = is3dActive ? "translateX(28px)" : "translateX(0)";
      is3d.classList.toggle("bg-blue-600", is3dActive);
      is3d.classList.toggle("bg-gray-700", !is3dActive);
    }

// Initialisation
    updateToggleUI();

    canvas2d.style.display = "none";
    is3d.addEventListener("click", () => {
      is3dActive = !is3dActive;
      if (is3dActive) {
        canvas2d.style.display = "none";
        canvas3d.style.display = "inline";
      } else {
        canvas3d.style.display = "none";
        canvas2d.style.display = "inline";
      }
      updateToggleUI();
    });

    start.onclick = () => {

      if (myDiv) {
        myDiv.style.display = "none";
      }
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

    // canvas3d.style.display = "none";
    // is3d.onclick = () => {
    //   if (is3d.checked) {
    //     canvas2d.style.display = "none";
    //     canvas3d.style.display = "inline";
    //   } else {
    //     canvas2d.style.display = "inline";
    //     canvas3d.style.display = "none";
    //   }
    // }

    ws?.addEventListener("message", wsListener = (event) => {
      const message: Event = JSON.parse(event.data);

      switch (message.event) {
        case "update":
          if (is3dActive) {
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
          context3d.textScoreP1.text = "";
          context3d.textScoreP2.text = "";
          context3d.textEndGame.text = message.player + " win!";
          context3d.ball.position.set(600, -300, 200);
          context3d.player1.position.set(600, -300, 200);
          context3d.player2.position.set(600, -300, 200);

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

function createTextBlock(color: string, fontSize: number, text: string): GUI.TextBlock {
  const textBlock = new GUI.TextBlock();
  textBlock.text = text;
  textBlock.color = color;
  textBlock.fontSize = fontSize;
  return textBlock;
}

function createBox(name: string, options: any, pos: any, scene: any, material?: any): Mesh {
  const box = MeshBuilder.CreateBox(name, options, scene);
  box.position.set(pos.x, pos.y, pos.z);
  if (material)
    box.material = material;
  return box;
}

function createPlane(name: string, options: any, pos: any, rotation: any, scene: any, material?: any ): Mesh {
  const plane = MeshBuilder.CreatePlane(name, options, scene);
  plane.position.set(pos.x, pos.y, pos.z);
  if (material)
    plane.material = material;
  plane.rotation.set(rotation.x, rotation.y , rotation.z);
  return plane;
}

function setup3d(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0, 0);

  // CAMERA //
  const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, -2000, new Vector3(600, 0, 275), scene);
  camera.attachControl(canvas, true);
  camera.inputs.attached.keyboard.detachControl();

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

  new GlowLayer("glow", scene);
  //glowLayer.intensity = 0.2;
  //glowLayer.addIncludedOnlyMesh(ledPlane);

  const ball = MeshBuilder.CreateSphere("ball", { diameter: 50 }, scene);
  ball.position.set(600, -300, 200);
  //const table = new TransformNode("table", scene);

  // ## CREATE TABLE ##
  createBox("MidBox1", { width: 1280, height: 680, depth: 100 }, { x: 600, y: -300, z: 75 }, scene, materialBlackMat);
  createBox("MidBox2", { width: 1240, height: 640, depth: 100 }, { x: 600, y: -300, z: 375 }, scene, materialBlackMat);
  createBox("MidBox3", { width: 1200, height: 600, depth: 200 }, { x: 600, y: -300, z: 225 }, scene, materialBlackMat);

  createBox("UpBox1", { width: 1280, height: 20, depth: 50 }, { x: 600, y: 30, z: 0 }, scene, materialBlackMat);
  createBox("UpBox2", { width: 1280, height: 50, depth: 20 }, { x: 600, y: 15, z: -25 }, scene, materialBlackMat);

  createBox("DownBox1", { width: 1280, height: 20, depth: 50 }, { x: 600, y: -630, z: 0 }, scene, materialBlackMat);
  createBox("DownBox2", { width: 1280, height: 50, depth: 20 }, { x: 600, y: -615, z: -25 }, scene, materialBlackMat);

  createBox("LeftBox1", { width: 20, height: 680, depth: 50  }, { x: -30, y: -300, z: 0 }, scene, materialBlackMat);
  createBox("LeftBox2", { width: 50, height: 680, depth: 20  }, { x: -15, y: -300, z: -25 }, scene, materialBlackMat);

  createBox("RightBox1", { width: 20, height: 680, depth: 50  }, { x: 1230, y: -300, z: 0 }, scene, materialBlackMat);
  createBox("RightBox2", { width: 50, height: 680, depth: 20  }, { x: 1215, y: -300, z: -25 }, scene, materialBlackMat);

  createBox("LightBox1", { width: 1240, height: 1, depth: 50 }, { x: 600, y: 19, z: 0 }, scene, ledMaterial);
  createBox("LightBox2", { width: 1240, height: 1, depth: 50 }, { x: 600, y: -619, z: 0 }, scene, ledMaterial);
  createBox("LightBox3", { width: 20, height: 640, depth: 50 }, { x: -19, y: -300, z: 0 }, scene, ledMaterial);
  createBox("LightBox3", { width: 20, height: 640, depth: 50 }, { x: 1219, y: -300, z: 0 }, scene, ledMaterial);

  createBox("LegBox1", { width: 60, height: 60, depth: 60 }, { x: 30, y: -30, z: 455 }, scene, materialBlackMat);
  createBox("LegBox2", { width: 60, height: 60, depth: 60 }, { x: 30, y: -570, z: 455 }, scene, materialBlackMat);
  createBox("LegBox3", { width: 60, height: 60, depth: 60 }, { x: 1170, y: -30, z: 455 }, scene, materialBlackMat);
  createBox("LegBox4", { width: 60, height: 60, depth: 60 }, { x: 1170, y: -570, z: 455 }, scene, materialBlackMat);

  createPlane("Plane1", { width: 1200, height: 600 }, { x: 600, y: -300, z: 24 }, { x: 0, y: 0, z: 0 }, scene, materialBlueMat);
  createPlane("Plane2", { width: 500, height: 170 }, { x: 600, y: -600.5, z: 225 }, { x: -Math.PI / 2, y: 0, z: 0 }, scene, material42);
  createPlane("Plane3", { width: 500, height: 170 }, { x: 600, y: 0.5, z: 225 }, { x: Math.PI / 2, y: 0, z: Math.PI }, scene, material42);
  createPlane("Plane4", { width: 1240, height: 640 }, { x: 600, y: -300, z: 126 }, { x: Math.PI, y: 0, z: 0 }, scene, ledMaterial);

  // ## CREATE PLAYERS ##
  const player1 = createBox("Player1", { width: 20, height: 200, depth: 40 }, { x: 600, y: -300, z: 200 }, scene);
  const player2 = createBox("Player2", { width: 20, height: 200, depth: 40 }, { x: 600, y: -300, z: 200 }, scene);

  // ## GUI ##
  const planeScoreP1 = createPlane("PlaneScoreP1", { width: 600, height: 600 }, { x: 300, y: -300, z: 23 }, { x: 0, y: 0, z: 0 }, scene);
  const planeScoreP2 = createPlane("PlaneScoreP2", { width: 600, height: 600 }, { x: 900, y: -300, z: 23 }, { x: 0, y: 0, z: 0 }, scene);
  const planeNameP1 = createPlane("PlaneNameP1", { width: 600, height: 600 }, { x: 300, y: -641, z: 62.5 }, { x: -Math.PI / 2, y: 0, z: 0 }, scene);
  const planeNameP2 = createPlane("PlaneNameP2", { width: 600, height: 600 }, { x: 900, y: -641, z: 62.5 }, { x: -Math.PI / 2, y: 0, z: 0 }, scene);
  const planeEndGame = createPlane("planeEndGame", { width: 1200, height: 1200 }, { x: 600, y: -300, z: 23 }, { x: 0, y: 0, z: 0 }, scene);

  const textScoreP1 = createTextBlock("gray", 400, "");
  const textScoreP2 = createTextBlock("gray", 400, "");
  const textNameP1 = createTextBlock("white", 150, "");
  const textNameP2 = createTextBlock("white", 150, "");
  const textEndGame = createTextBlock("white", 200, "");

  const guiScoreP1 = GUI.AdvancedDynamicTexture.CreateForMesh(planeScoreP1);
  const guiScoreP2 = GUI.AdvancedDynamicTexture.CreateForMesh(planeScoreP2);
  const guiNameP1 = GUI.AdvancedDynamicTexture.CreateForMesh(planeNameP1);
  const guiNameP2 = GUI.AdvancedDynamicTexture.CreateForMesh(planeNameP2);
  const guiEndGame = GUI.AdvancedDynamicTexture.CreateForMesh(planeEndGame);

  guiScoreP1.addControl(textScoreP1);
  guiScoreP2.addControl(textScoreP2);
  guiNameP1.addControl(textNameP1);
  guiNameP2.addControl(textNameP2);
  guiEndGame.addControl(textEndGame);

  engine.runRenderLoop(() => {
    scene.render();
  });

  return {ball, player1, player2, textNameP1, textNameP2, textScoreP1, textScoreP2, textEndGame};
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
