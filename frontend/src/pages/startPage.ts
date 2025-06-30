import { type Page } from "./Page.ts";
import { chatPage } from "./chatPage.ts";
import { Status } from "brackets-model";
import type { ViewerData } from "brackets-viewer";
import type { Tournament } from "@ft_transcendence/core";

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
            <button id="start" class="bg-blue-500 hover:bg-blue-700 cursor-pointer rounded-lg py-1 px-3">Start</button>
          </div>
        </div>
        ${chatPage.getPage()}
      </div>
    `;
  },

  async onMount() {
    // if (ws == undefined) {
    //   loadPage(modePage, undefined, "REPLACE");
    //   return;
    // }
    //
    // const currentGame = await sendAndWait({ event: "get_current_game"});
    // if (currentGame.id == undefined) {
    //   loadPage(modePage, undefined, "REPLACE");
    //   return;
    // }
    //
    // chatPage.onMount();

    const brackets: ViewerData = {
      participants: [],
      stages: [
        { id: 0, name: "", type: "single_elimination", tournament_id: 0, number: 1, settings: {} }
      ],
      matches: [],
      matchGames: []
    };

    await updateMatches(brackets, {
      players: [
        {id: 0, displayName: "a"},
        {id: 1, displayName: "b", avatar: null},
      ],
      matches: [
        [
          {player: 0, score: 1},
          {player: 1, score: 2},
          {player: 1, score: 3},
        ]
      ]
    });
  },

  onUnmount() {
    // chatPage.onUnmount();
  },

  toJSON() {
    return this.url;
  }
};

async function updateMatches(brackets: ViewerData, tournament: Tournament) {
  brackets.participants = tournament.players.map(p => ({
    id: p.id,
    tournament_id: 0,
    name: p.displayName
  }));

  window.bracketsViewer.setParticipantImages(tournament.players
    .filter(p => p.avatar !== null)
    .map(p => ({
      participantId: p.id,
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
        id: incrementalId++, stage_id: 0, group_id: 0, round_id: roundId, number: j / 2, status: Status.Waiting, child_count: 0,
        opponent1: { id: first == undefined ? null : first.player, score: first?.score },
        opponent2: { id: second == undefined ? null : second.player, score: second?.score }
      });
    }

    roundId++;
  }

  await window.bracketsViewer.render(brackets, { highlightParticipantOnHover: false, clear: true });
}

function nextPow(n: number) {
  if (n <= 1)
    return 1;

  let pow = 1;
  while (pow < n)
    pow <<= 1;

  return pow;
}