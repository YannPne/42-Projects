export default function pongPage() {
  return `
    <button class="button" id="start">Start game</button>
    <canvas id="game" width="1200" height="600"></canvas>
  `;
}

document.querySelector<HTMLButtonElement>("#start")!.onclick = event => {

};