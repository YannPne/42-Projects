import { loadPage, type Page } from "./Page.ts";
import { changeChatTournamentState, chatPage } from "./chatPage.ts";
import { Status } from "brackets-model";
import type { ViewerData } from "brackets-viewer";
import { nextPow, type ServerEvent, type Tournament } from "@ft_transcendence/core";
import { send, sendAndWait } from "../Event.ts";
import { ws } from "../websocket.ts";
import { modePage } from "./modePage.ts";
import { pongPage } from "./pongPage.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;

export const startPage: Page = {
  url: "/start",
  title: "Starting game...",

  getPage() {
    return `
      <div class="h-full flex">
        <div class="flex-1 flex flex-col items-center justify-around p-2 gap-2 overflow-auto">
          <div class="brackets-viewer max-w-full"></div>
          <div class="flex items-center justify-between w-full px-5">
            <form class="bg-gray-900" id="add-local">
              <input id="add-local-name" type="text" required placeholder="Player's name" class="p-2 placeholder-gray-400">
              <input type="checkbox" id="add-local-ai" class="ml-2" />
              <label for="add-local-ai" class="mr-2">Is AI?</label>
              <button class="p-2 bg-blue-900 hover:bg-blue-950">Add local player</button>
            </form>
            <button id="start" disabled class="bg-blue-500 disabled:bg-blue-900 not-disabled:hover:bg-blue-700 not-disabled:cursor-pointer rounded-lg py-2 px-10">Start</button>
          </div>
        </div>
        ${chatPage.getPage()}
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
    changeChatTournamentState(true);
    setupBar();

    const start = document.querySelector<HTMLButtonElement>("#start")!;

    ws.addEventListener("message", wsListener = (event) => {
      const message: ServerEvent = JSON.parse(event.data);
      if (message.event == "tournament") {
        updateMatches(message);
        start.disabled = message.players.length < 2;
      }
    });

    send({ event: "tournament" });
  },

  onUnmount(nextPage: Page<any>) {
    if (nextPage !== pongPage)
      send({ event: "leave_game" });
    if (wsListener != undefined)
      ws?.removeEventListener("message", wsListener);
    wsListener = undefined;
    changeChatTournamentState(false);
    chatPage.onUnmount();
  },

  toJSON() {
    return this.url;
  }
};

function setupBar() {
  const form = document.querySelector<HTMLFormElement>("#add-local")!;
  const formName = form.querySelector<HTMLInputElement>("#add-local-name")!;
  const formAi = form.querySelector<HTMLInputElement>("#add-local-ai")!;
  const start = document.querySelector<HTMLButtonElement>("#start")!;

  form.onsubmit = event => {
    event.preventDefault();
    send({
      event: "add_local_player",
      name: formName.value,
      isAi: formAi.checked
    });
    formName.value = "";
    formAi.checked = false;
  };

  start.onclick = () => {
    send({ event: "play" });
    loadPage(pongPage);
  };
}

const brackets: ViewerData = {
  participants: [],
  stages: [
    { id: 0, name: "", type: "single_elimination", tournament_id: 0, number: 1, settings: {} }
  ],
  matches: [],
  matchGames: []
};

export async function updateMatches(tournament: Tournament) {
  brackets.participants = tournament.players.map(p => ({
    id: p.id,
    tournament_id: 0,
    name: p.displayName
  }));

  window.bracketsViewer.setParticipantImages(tournament.players
    .filter(p => p.avatar !== null)
    .map(p => ({
      participantId: p.id as any as number,
      imageUrl: p.avatar == undefined ? "/avatar.webp" : URL.createObjectURL(new Blob([ new Uint8Array(p.avatar) ]))
    })));

  brackets.matches = [];

  let incrementalId = 0;
  let roundId = 0;

  const total = nextPow(tournament.matches[0].length);
  for (let i = total; i >= 2; i /= 2) {
    for (let j = 0; j < i; j += 2) {
      const first = tournament.matches[roundId]?.[j];
      const second = tournament.matches[roundId]?.[j + 1];

      brackets.matches.push({
        id: incrementalId++, stage_id: 0, group_id: 0, round_id: roundId, number: j / 2, child_count: 0,
        status: first != undefined && first.running ? Status.Running : Status.Waiting,
        opponent1: { id: first == undefined ? null : first.player, score: first?.score },
        opponent2: second != undefined && second.player == null
          ? null
          : { id: second == undefined ? null : second.player, score: second?.score }
      });
    }

    roundId++;
  }

  await window.bracketsViewer.render(brackets, { highlightParticipantOnHover: false, clear: true });
}
