import { loadPage, type Page } from "./Page.ts";
import { ws } from "../websocket.ts";
import { ArcRotateCamera, Color3, Color4, Engine, HemisphericLight, GlowLayer, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, Mesh } from "@babylonjs/core";
import { TextBlock, AdvancedDynamicTexture } from "@babylonjs/gui";
import type { Ball, Player, ServerEvent } from "@ft_transcendence/core";
import { send, sendAndWait } from "../Event.ts";
import { chatPage } from "./chatPage.ts";
import { modePage } from "./modePage.ts";
import { updateMatches } from "./startPage.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;
let keydownListener: ((event: KeyboardEvent) => void) | undefined;
let keyupListener: ((event: KeyboardEvent) => void) | undefined;
let clickListener: ((event: MouseEvent) => void) | undefined;

let scene: Scene | undefined;

export const pongPage: Page = {
  url: "/pong",
  title: "Pong",

  getPage() {
    return `
      <div class="h-full flex">
        <div class="flex-1 flex flex-col p-5 overflow-hidden">
          <div class="flex flex-col items-center justify-center h-full w-full p-5">
            
              <div class="flex items-center justify-center w-full h-full max-h-[70vh]">
                <div class="aspect-[2/1] w-full max-w-[calc(70vh*2)]" style="display: none">
                  <canvas id="game2d" width="1200" height="600" class="w-full h-full bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950"></canvas>
                </div>
                <div class="relative aspect-[2/1] w-full max-w-[calc(70vh*2)]">
                  <canvas id="game3d" width="1200" height="600" class="w-full h-full not-focus-visible"></canvas>
                  <i title="The view can be moved with your mouse" class="fa-solid fa-arrows-rotate rotate-55 text-4xl absolute right-0 bottom-0"></i>
                </div>
              </div>
          
          
            
            <div class="flex items-center justify-around w-full">
              <div class="flex items-center space-x-4 mt-4">
                <span id="toggle-text" class="text-lg font-medium text-white select-none cursor-pointer">Mode 3D</span>
                <button id="is3d" type="button" class="relative w-16 h-9 bg-gray-700 rounded-full transition-colors duration-300 ease-in-out focus:outline-none">
                  <span id="toggle-circle" class="absolute left-1 top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out"></span>
                </button>
              </div>
              <i id="tournament" class="fa-solid fa-trophy text-3xl cursor-pointer hover:text-gray-300"></i>
            </div>
          </div>
        </div>
        ${chatPage.getPage()}
      </div>
		  <div id="tournament-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center w-screen h-screen overflow-hidden p-10" style="display: none">
		    <div class="brackets-viewer bg-gray-800 p-10 rounded-4xl max-w-full max-h-full overflow-auto"></div>
      </div>
    `;
  },

  async onMount() {
    if (ws == undefined) {
      loadPage(modePage, undefined, "REPLACE");
      return;
    }
    const currentGame = await sendAndWait({ event: "get_current_game" });
    if (currentGame.id == undefined) {
      loadPage(modePage, undefined, "REPLACE");
      return;
    }

    chatPage.onMount();

    // Game
    const canvas2d = document.querySelector<HTMLCanvasElement>("#game2d")!;
    const context2d = canvas2d.getContext("2d")!;
    const canvas3d = document.querySelector<HTMLCanvasElement>("#game3d")!;
    let context3d = setup3d(canvas3d);
    const is3d = document.querySelector<HTMLButtonElement>("#is3d")!;
    const tournamentButton = document.querySelector<HTMLElement>("#tournament")!;
    const tournamentModal = document.querySelector<HTMLDivElement>("#tournament-modal")!;
    const tournamentBracket = tournamentModal.querySelector<HTMLDivElement>(".brackets-viewer")!;

    const toggleText = document.querySelector<HTMLSpanElement>("#toggle-text")!;
    const toggleCircle = document.querySelector<HTMLSpanElement>("#toggle-circle")!;

    let is3dActive = true;

    const chatInput = document.querySelector<HTMLFormElement>("#chat-message-input")!
      .querySelector("input")!;

    if (currentGame.type == "LOCAL")
      tournamentButton.remove();

    function updateToggleUI() {
      toggleText.textContent = is3dActive ? "Mode 3D" : "Mode 2D";
      toggleCircle.style.transform = is3dActive ? "translateX(28px)" : "translateX(0)";
      is3d.classList.toggle("bg-blue-600", is3dActive);
      is3d.classList.toggle("bg-gray-700", !is3dActive);
    }

    updateToggleUI();

    is3d.onclick = () => {
      is3dActive = !is3dActive;
      (is3dActive ? canvas2d : canvas3d).parentElement!.style.display = "none";
      (is3dActive ? canvas3d : canvas2d).parentElement!.style.display = "";
      updateToggleUI();
    };

    tournamentButton.onclick = () => tournamentModal.style.display = "";

    document.addEventListener("keydown", keydownListener = event => {
      if (!event.repeat && document.activeElement !== chatInput)
        move(event, true);
    });

    document.addEventListener("keyup", keyupListener = event => {
      if (document.activeElement !== chatInput)
        move(event, false);
    });

    document.addEventListener("click", clickListener = event => {
      if (!tournamentBracket.contains(event.target as Node | null) && event.target !== tournamentButton)
        tournamentModal.style.display = "none";
    });

    ws.addEventListener("message", wsListener = async (event) => {
      const message: ServerEvent = JSON.parse(event.data);

      switch (message.event) {
        case "update":
          if (is3dActive)
            updateGame3D(context3d, message.ball, message.players[0], message.players[1]);
          else {
            drawMap(canvas2d, context2d);
            for (let player of message.players)
              drawPlayer(context2d, player);
            drawBall(context2d, message.ball);
            drawScore(canvas2d, context2d, message.players[0], message.players[1]);
          }
          break;
        case "next_match":
          drawText3d(context3d, message.players[0] + "\nvs\n" + message.players[1]);
          drawText(context2d, message.players[0] + "\nvs\n" + message.players[1]);
          break;
        case "tournament":
          await updateMatches(message);
          break;
        case "win":
          drawText3d(context3d, message.player + "\nwin!");
          drawText(context2d, message.player + "\nwin!");
          await sleep(2000);
          loadPage(modePage);
          break;
      }
    });

    send({ event: "tournament" });

  },

  onUnmount() {
    send({ event: "leave_game" });
    if (clickListener != undefined)
      document.removeEventListener("click", clickListener);
    if (keydownListener != undefined)
      document.removeEventListener("keydown", keydownListener);
    if (keyupListener != undefined)
      document.removeEventListener("keyup", keyupListener);
    if (wsListener != undefined)
      ws?.removeEventListener("message", wsListener);
    clickListener = undefined;
    keydownListener = undefined;
    keyupListener = undefined;
    wsListener = undefined;

    scene?.getEngine().stopRenderLoop();
    scene?.dispose();
    scene?.getEngine().dispose();
    scene = undefined;

    chatPage.onUnmount();
  },

  toJSON() {
    return this.url;
  }
};

function move(event: KeyboardEvent, down: boolean) {
  let goUp: boolean | undefined;
  let goDown: boolean | undefined;

  if (event.code == "KeyW" || event.code == "ArrowUp")
    goUp = down;
  else if (event.code == "KeyS" || event.code == "ArrowDown")
    goDown = down;
  else
    return;

  send({
    event: "move", goUp, goDown,
    id: event.code == "ArrowUp" || event.code == "ArrowDown" ? 1 : 0
  });
}

function createTextBlock(color: string, fontSize: number, text: string) {
  const textBlock = new TextBlock();
  textBlock.text = text;
  textBlock.color = color;
  textBlock.fontSize = fontSize;
  return textBlock;
}

function createBox(name: string, options: any, pos: Vector3, scene: Scene, material?: StandardMaterial): Mesh {
  const box = MeshBuilder.CreateBox(name, options, scene);
  box.position.set(pos.x, pos.y, pos.z);
  if (material)
    box.material = material;
  return box;
}

function createPlane(name: string, options: any, pos: Vector3, rotation: Vector3, scene: Scene, material?: StandardMaterial): Mesh {
  const plane = MeshBuilder.CreatePlane(name, options, scene);
  plane.position.set(pos.x, pos.y, pos.z);
  if (material)
    plane.material = material;
  plane.rotation.set(rotation.x, rotation.y, rotation.z);
  return plane;
}

function createTextureMaterial(name: string, path: string, scene: Scene, alpha: boolean): StandardMaterial {
  const material = new StandardMaterial(name, scene);
  material.diffuseTexture = new Texture(path, scene);
  material.diffuseTexture.hasAlpha = alpha;
  return material;
}

function createMaterial(name: string, spec: Color3, diff: Color3, emiss: Color3, scene: Scene): StandardMaterial {
  const material = new StandardMaterial(name, scene);
  material.specularColor = spec;
  material.diffuseColor = diff;
  material.emissiveColor = emiss;
  return material;
}

function createLight(name: string, direction: Vector3, diff: Color3, spec: Color3, ground: Color3, scene: Scene) {
  const light = new HemisphericLight(name, direction, scene);
  light.diffuse = diff;
  light.specular = spec;
  light.groundColor = ground;
}

function createSphere(name: string, options: any, pos: Vector3, scene: Scene): Mesh {
  const sphere = MeshBuilder.CreateSphere(name, options, scene);
  sphere.position = pos;
  return sphere;
}

function createCamera(name: string, alpha: number, beta: number, radius: number, target: Vector3, canvas: HTMLCanvasElement, scene: Scene) {
  const camera = new ArcRotateCamera(name, alpha, beta, radius, target, scene);
  camera.attachControl(canvas, true);
  camera.inputs.attached.keyboard.detachControl();
}

function createScene(engine: Engine, clearColor: Color4): Scene {
  const scene = new Scene(engine);
  scene.clearColor = clearColor;
  return scene;
}

type GameElements = {
  ball: Mesh;
  player1: Mesh;
  player2: Mesh;
  textNameP1: TextBlock;
  textNameP2: TextBlock;
  textScoreP1: TextBlock;
  textScoreP2: TextBlock;
  textEndGame: TextBlock;
};

function setup3d(canvas: HTMLCanvasElement): GameElements {
  // ## ENGINE && SCENE ##
  const engine = new Engine(canvas, true);
  scene = createScene(engine, new Color4(0, 0, 0, 0));

  const ro = new ResizeObserver(() => engine.resize());
  ro.observe(canvas);

  window.addEventListener("resize", () => engine.resize());

  // ## CAMERA && LIGHT ##
  createCamera("Camera", Math.PI / 2, Math.PI / 4, -2000, new Vector3(600, 0, 275), canvas, scene);
  createLight("light", new Vector3(0, 0, -1), new Color3(1, 1, 1), new Color3(1, 1, 1), new Color3(0.2, 0.2, 0.5), scene);

  // ## MATERIAL ##
  const material42 = createTextureMaterial("material42", "/banner.png", scene, true);
  const materialBlack = createMaterial("materialBlack", new Color3(0.2, 0.2, 0.2), new Color3(0.1, 0.1, 0.1), new Color3(0, 0, 0), scene);
  const materialBlue = createMaterial("materialBlack", new Color3(0.13 / 255, 0.03 / 255, 261.69 / 255), new Color3(0.1, 0.1, 0.1), new Color3(0, 0, 0), scene);
  const materialWhite = createMaterial("materialWhite", new Color3(0, 0, 0), new Color3(0, 0, 0), new Color3(1, 1, 1), scene);

  new GlowLayer("glow", scene);

  // ## CREATE TABLE ##
  createBox("MidBox1", { width: 1280, height: 680, depth: 100 }, new Vector3(600, -300, 75), scene, materialBlack);
  createBox("MidBox2", { width: 1240, height: 640, depth: 100 }, new Vector3(600, -300, 375), scene, materialBlack);
  createBox("MidBox3", { width: 1200, height: 600, depth: 200 }, new Vector3(600, -300, 225), scene, materialBlack);
  createBox("UpBox1", { width: 1280, height: 20, depth: 50 }, new Vector3(600, 30, 0), scene, materialBlack);
  createBox("UpBox2", { width: 1280, height: 50, depth: 20 }, new Vector3(600, 15, -25), scene, materialBlack);
  createBox("DownBox1", { width: 1280, height: 20, depth: 50 }, new Vector3(600, -630, 0), scene, materialBlack);
  createBox("DownBox2", { width: 1280, height: 50, depth: 20 }, new Vector3(600, -615, -25), scene, materialBlack);
  createBox("LeftBox1", { width: 20, height: 680, depth: 50 }, new Vector3(-30, -300, 0), scene, materialBlack);
  createBox("LeftBox2", { width: 50, height: 680, depth: 20 }, new Vector3(-15, -300, -25), scene, materialBlack);
  createBox("RightBox1", { width: 20, height: 680, depth: 50 }, new Vector3(1230, -300, 0), scene, materialBlack);
  createBox("RightBox2", { width: 50, height: 680, depth: 20 }, new Vector3(1215, -300, -25), scene, materialBlack);
  createBox("LightBox1", { width: 1240, height: 1, depth: 50 }, new Vector3(600, 19, 0), scene, materialWhite);
  createBox("LightBox2", { width: 1240, height: 1, depth: 50 }, new Vector3(600, -619, 0), scene, materialWhite);
  createBox("LightBox3", { width: 20, height: 640, depth: 50 }, new Vector3(-19, -300, 0), scene, materialWhite);
  createBox("LightBox3", { width: 20, height: 640, depth: 50 }, new Vector3(1219, -300, 0), scene, materialWhite);
  createBox("LegBox1", { width: 60, height: 60, depth: 60 }, new Vector3(30, -30, 455), scene, materialBlack);
  createBox("LegBox2", { width: 60, height: 60, depth: 60 }, new Vector3(30, -570, 455), scene, materialBlack);
  createBox("LegBox3", { width: 60, height: 60, depth: 60 }, new Vector3(1170, -30, 455), scene, materialBlack);
  createBox("LegBox4", { width: 60, height: 60, depth: 60 }, new Vector3(1170, -570, 455), scene, materialBlack);

  createPlane("Plane1", { width: 1200, height: 600 }, new Vector3(600, -300, 24),
    new Vector3(0, 0, 0), scene, materialBlue);
  createPlane("Plane2", { width: 500, height: 170 }, new Vector3(600, -600.5, 225),
    new Vector3(-Math.PI / 2, 0, 0), scene, material42);
  createPlane("Plane3", { width: 500, height: 170 }, new Vector3(600, 0.5, 225),
    new Vector3(Math.PI / 2, 0, Math.PI), scene, material42);
  createPlane("Plane4", { width: 1240, height: 640 }, new Vector3(600, -300, 126),
    new Vector3(Math.PI, 0, 0), scene, materialWhite);

  // ## CREATE PLAYERS && BALL ##
  const player1 = createBox("Player1", { width: 20, height: 200, depth: 40 }, new Vector3(600, -300, 200), scene);
  const player2 = createBox("Player2", { width: 20, height: 200, depth: 40 }, new Vector3(600, -300, 200), scene);
  const ball = createSphere("ball", { diameter: 50 }, new Vector3(600, -300, 200), scene);

  // ## GUI ##
  const planeScoreP1 = createPlane("PlaneScoreP1", { width: 600, height: 600 },
    new Vector3(300, -300, 23), new Vector3(0, 0, 0), scene);
  const planeScoreP2 = createPlane("PlaneScoreP2", { width: 600, height: 600 },
    new Vector3(900, -300, 23), new Vector3(0, 0, 0), scene);
  const planeNameP1 = createPlane("PlaneNameP1", { width: 600, height: 600 },
    new Vector3(300, -641, 62.5), new Vector3(-Math.PI / 2, 0, 0), scene);
  const planeNameP2 = createPlane("PlaneNameP2", { width: 600, height: 600 },
    new Vector3(900, -641, 62.5), new Vector3(-Math.PI / 2, 0, 0), scene);
  const planeEndGame = createPlane("planeEndGame", { width: 1200, height: 1200 },
    new Vector3(600, -300, 23), new Vector3(0, 0, 0), scene);

  const textScoreP1 = createTextBlock("gray", 400, "");
  const textScoreP2 = createTextBlock("gray", 400, "");
  const textNameP1 = createTextBlock("white", 90, "");
  const textNameP2 = createTextBlock("white", 90, "");
  const textEndGame = createTextBlock("white", 90, "");

  const guiScoreP1 = AdvancedDynamicTexture.CreateForMesh(planeScoreP1);
  const guiScoreP2 = AdvancedDynamicTexture.CreateForMesh(planeScoreP2);
  const guiNameP1 = AdvancedDynamicTexture.CreateForMesh(planeNameP1);
  const guiNameP2 = AdvancedDynamicTexture.CreateForMesh(planeNameP2);
  const guiEndGame = AdvancedDynamicTexture.CreateForMesh(planeEndGame);

  guiScoreP1.addControl(textScoreP1);
  guiScoreP2.addControl(textScoreP2);
  guiNameP1.addControl(textNameP1);
  guiNameP2.addControl(textNameP2);
  guiEndGame.addControl(textEndGame);

  engine.runRenderLoop(() => scene?.render());

  return { ball, player1, player2, textNameP1, textNameP2, textScoreP1, textScoreP2, textEndGame };
}

// ## 3D ##
function updateGame3D(context: GameElements, ball: Ball, player1: Player, player2: Player) {
  context.ball.position.set(ball.x + 25, -ball.y - 25, 0);
  context.player2.position.set(player2.x + 10, -player2.y - 100, 5);
  context.player1.position.set(player1.x + 10, -player1.y - 100, 5);
  drawScore3D(context, player1, player2);
}

function drawScore3D(context: GameElements, player1: Player, player2: Player) {
  if (context.textEndGame.text != "")
    context.textEndGame.text = "";
  if (context.textScoreP1.text != player1.score.toString())
    context.textScoreP1.text = player1.score.toString();
  if (context.textScoreP2.text != player2.score.toString())
    context.textScoreP2.text = player2.score.toString();
  if (context.textNameP1.text != player1.name)
    context.textNameP1.text = player1.name;
  if (context.textNameP2.text != player2.name)
    context.textNameP2.text = player2.name;
}

function drawText3d(context: GameElements, text: string) {
  context.textNameP1.text = "";
  context.textNameP2.text = "";
  context.textScoreP1.text = "";
  context.textScoreP2.text = "";
  context.textEndGame.text = text;
  context.ball.position.set(600, -300, 200);
  context.player1.position.set(600, -300, 200);
  context.player2.position.set(600, -300, 200);
}

// ## 2D ##
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawMap(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.setLineDash([ 10, 15 ]);
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

function drawText(context: CanvasRenderingContext2D, text: string) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.font = "80px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  text.split("\n").forEach((value, i) =>
    context.fillText(value, context.canvas.width / 2, context.canvas.height / 4 + 80 * i));
}
