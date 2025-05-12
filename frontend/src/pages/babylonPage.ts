import type { Page } from "./Page.ts";
import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";

let keydownListener: ((event: KeyboardEvent) => void) | undefined;

export const babylonPage: Page = {
  url: "/babylon",
  title: "Babylon.js",

  getPage(): string {
    return `
    <canvas id="canvas" class="h-full w-full"></canvas>
    `;
  },

  onMount() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
    MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    window.addEventListener("keydown", keydownListener = (ev) => {
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key == "I") {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });

    engine.runRenderLoop(() => {
      scene.render();
    });
  },

  onUnmount() {
    if (keydownListener != undefined)
      window.removeEventListener("keydown", keydownListener);
    keydownListener = undefined;
  }
};