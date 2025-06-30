import {type Page} from "./Page.ts";
import {chatPage} from "./chatPage.ts";
import {Status} from "brackets-model";

export const startPage: Page = {
  url: "/start",
  title: "Starting game...",

  getPage() {
    return `
      <div class="h-full flex">
        <div class="flex-1">
          <div id="bracket" class="brackets-viewer"></div>
          <button id="start">Start</button>
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

    window.bracketsViewer.setParticipantImages([
      {participantId: 1, imageUrl: "/avatar.webp"}
    ]);

    await window.bracketsViewer.render({
      participants: [
        { id: 0, name: "Team A", tournament_id: 0 },
        { id: 1, name: "Team B", tournament_id: 0 },
        { id: 2, name: "Team C", tournament_id: 0 },
        { id: 3, name: "Team D", tournament_id: 0 }
      ],
      stages: [
        { id: 0, name: "", type: "single_elimination", tournament_id: 0, number: 1, settings: {} }
      ],
      matches: [
        // Semi-finals
        { id: 1, stage_id: 0, group_id: 0, round_id: 0, number: 0, status: Status.Running, opponent1: { id: 0, score: 2 }, opponent2: { id: 1, score: 1, result: "win" }, child_count: 0 },
        { id: 2, stage_id: 0, group_id: 0, round_id: 0, number: 1, status: Status.Running, opponent1: { id: 2, score: 0 }, opponent2: { id: 3, score: 2 }, child_count: 0 },
        { id: 3, stage_id: 0, group_id: 0, round_id: 0, number: 2, status: Status.Waiting, opponent1: null, opponent2: null, child_count: 0 },
        { id: 4, stage_id: 0, group_id: 0, round_id: 0, number: 3, status: Status.Running, opponent1: null, opponent2: null, child_count: 0 },
        // Final
        { id: 5, stage_id: 0, group_id: 0, round_id: 1, number: 0, status: Status.Archived, opponent1: { id: null }, opponent2: null, child_count: 0 },
        { id: 6, stage_id: 0, group_id: 0, round_id: 1, number: 1, status: Status.Running, opponent1: { id: 0, score: 3 }, opponent2: { id: 3, score: 1 }, child_count: 0 },
        //
        { id: 7, stage_id: 0, group_id: 0, round_id: 2, number: 1, status: Status.Running, opponent1: { id: 0, score: 3 }, opponent2: { id: 3, score: 1 }, child_count: 0 },
      ],
      matchGames: []
    }, {
      highlightParticipantOnHover: false,
      showRankingTable: false
    });
  },

  onUnmount() {
    // chatPage.onUnmount();
  },

  toJSON() {
    return this.url;
  }
};