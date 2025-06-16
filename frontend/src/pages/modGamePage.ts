import { ws } from "../websocket.ts";
import { loadPage, type Page } from "./Page.ts";
import { pongPage } from "./pongPage.ts";
import { loginPage } from "./loginPage.ts";
import { chatIsHide, chatPage, setChatHide } from "./chatPage.ts";
import { chooseGamePage } from "./chooseGamePage.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;

export const modGamePage: Page = {
  url: "/mod",
  title: "modGamePage",

  getPage(): string {
	return `
		<div class="h-full flex flex-col overflow-hidden">
   
        	<hr class="h-px bg-gray-200 border-0">
        	<div class="flex-1 flex">
				<div class="flex-1 flex flex-col p-5 overflow-hidden">
					<div class="flex items-center justify-center h-full">
						<div class="flex flex-col space-y-4 items-center w-64">
						  <button id="btnTraining" class="w-full px-12 py-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
							Training
						  </button>

						  <button id="btnLocal" class="w-full px-12 py-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
							Local
						  </button>

						  <button id="btnTournament" class="w-full px-12 py-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
							Tournament
						  </button>
						</div>
					</div>
          		</div>
				<div id="divider" class="h-full w-[6px] bg-gray-600 cursor-pointer"></div>
				<div id="liveChat" class="w-[30%] flex flex-col px-5 pt-5">
				  ${chatPage.getPage()}
          		</div>
        	</div>
      	</div>
	`;
  },

  async onMount() {
	if (ws == undefined) {
	  loadPage(loginPage, modGamePage);
	  return;
	}

	const divider = document.getElementById("divider")!;
    const liveChat = document.getElementById("liveChat")!;

	chatPage.onMount();

	if (chatIsHide)
		liveChat.classList.add("hidden");
	  divider.addEventListener("click", () => {
		setChatHide(liveChat.classList.toggle("hidden"));
	  });

    document.getElementById('btnTraining')!.addEventListener('click', event => {
      event.preventDefault();
      loadPage(pongPage, {
        event: "join_game",
        uid: crypto.randomUUID(),
        name: "Training",
      });
    });

    document.getElementById('btnLocal')!.addEventListener('click', () => {
      console.log('Bouton Local cliqué');
    });

    document.getElementById('btnTournament')!.addEventListener('click', () => {
      console.log('Bouton Tournament cliqué');
	  loadPage(chooseGamePage);
    });


  },

  onUnmount() {
	if (wsListener != undefined)
	  ws!.removeEventListener("message", wsListener);
	wsListener = undefined;
  },

  toJSON() {
    return this.url;
  }
};