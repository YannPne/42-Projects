import { loadPage, type Page } from "./Page.ts";
import { send, sendAndWait } from "../Event.ts";
import type { Friend, Game } from "@ft_transcendence/core";
import { ws } from "../websocket.ts";
import { loginPage } from "./loginPage.ts";
import { settingsPage } from "./settingsPage.ts";

export const profilePage: Page<number> = {
  url: "/profile",
  title: "Profile",

  getPage() {
    return `
      <div class="h-full flex flex-col overflow-hidden relative">
        <div class="p-5 flex justify-between">
          <div class="flex items-center gap-2 flex-1">
            <div class="relative">
              <img id="avatar" alt="avatar" src="/avatar.webp" class="w-[100px] h-[100px] bg-gray-950 border border-white rounded-full">
              <div id="status" class="rounded-full w-[25px] h-[25px] bg-gray-500 absolute bottom-[2px] right-[2px] border-4 border-gray-800"></div>
            </div>
            <div>
              <p id="display-name" class="text-4xl font-bold"></p>
              <p id="username"></p>
              <a id="email" class="text-gray-400"></a>
            </div>
          </div>
          <div class="flex flex-col items-center">
            <canvas id="graph" height="101" class="h-[70px] aspect-square"></canvas>
            <p id="graph-percent"></p>
          </div>
          <div class="flex-1 flex flex-col items-end">
            <i id="settings" class="fa-solid fa-gear hover:text-gray-400 cursor-pointer hover:rotate-90"></i>
          </div>
        </div>
        <hr class="h-px bg-gray-200 border-0">
        <div class="flex-1 flex bg-gradient-to-b from-gray-900 to-gray-700 overflow-hidden">
          <div class="flex-1 flex flex-col p-5 overflow-hidden">
            <p class="text-center font-bold text-2xl mb-5">GAME HISTORY</p>
            <div id="game-history" class="overflow-auto grid gap-x-3 gap-y-1" style="grid-template-columns: auto auto auto 1fr"></div>
          </div>
          <div class="h-full border border-gray-600"></div>
          <div class="flex-1 flex flex-col px-5">
            <p class="text-center font-bold text-2xl my-5">FRIENDS</p>
            <ul id="friends" class="overflow-auto flex-1 space-y-3"></ul>
            <form id="add-friend" class="w-full p-4 flex gap-4">
              <input id="add-friend-name" placeholder="Username" required class="flex-1 bg-gray-600 p-2 rounded-xl">
              <button class="px-5 bg-gray-900 rounded-xl cursor-pointer hover:bg-gray-950">Add</button>
            </form>
          </div>
        </div>
        <div id="lock" class="absolute bg-gray-900/70 w-full h-full flex flex-col items-center justify-center" style="display: none">
          <i class="fa-solid fa-lock text-9xl"></i>
          <p id="lock-name" class="text-7xl font-bold mt-2">Name</p>
          <p class="text-3xl">Private profile</p>
        </div>
      </div>
	  `;
  },

  async onMount(profileId) {
    if (ws == undefined) {
      loadPage(loginPage, this, "REPLACE");
      return;
    }

    const avatar = document.querySelector<HTMLImageElement>("#avatar")!;
    const status = document.querySelector<HTMLDivElement>("#status")!;
    const displayName = document.querySelector<HTMLParagraphElement>("#display-name")!;
    const username = document.querySelector<HTMLParagraphElement>("#username")!;
    const email = document.querySelector<HTMLAnchorElement>("#email")!;
    const gameHistory = document.querySelector<HTMLDivElement>("#game-history")!;
    const friends = document.querySelector<HTMLUListElement>("#friends")!;
    const addFriendForm = document.querySelector<HTMLFormElement>("#add-friend")!;
    const addFriendName = document.querySelector<HTMLInputElement>("#add-friend-name")!;
    const settings = document.querySelector<HTMLDivElement>("#settings")!;
    const lock = document.querySelector<HTMLDivElement>("#lock")!;
    const lockName = document.querySelector<HTMLParagraphElement>("#lock-name")!;

    addFriendForm.onsubmit = async (event) => {
      event.preventDefault();
      const result = await sendAndWait({ event: "add_friend", user: addFriendName.value });
      if (result.success)
        loadPage(profilePage);
      else
        alert("Failed to add the friend.");
    };

    settings.onclick = () => loadPage(settingsPage);

    const profile = await sendAndWait({ event: "get_profile", id: profileId });
    if (profile.locked) {
      lockName.textContent = profile.displayName;
      lock.style.display = "";
      addFriendForm.style.display = "none";
    } else {
      if (profile.avatar)
        avatar.src = URL.createObjectURL(new Blob([ new Uint8Array(profile.avatar) ]));

      if (profile.online)
        status.classList.add("bg-green-500");
      displayName.textContent = profile.displayName;
      username.textContent = profile.username;
      email.textContent = profile.email;
      email.href = "mailto:" + profile.email;

      for (let friend of profile.friends)
        friends.appendChild(createFriend(friend));
      for (let game of profile.games)
        createGame(game, gameHistory);

      createGraph(profile.games);

      if (!profile.self) {
        settings.style.display = "none";
        addFriendForm.style.display = "none";
        for (let trash of document.querySelectorAll<HTMLElement>(".friend-remove"))
          trash.style.display = "none";
      }
    }
  },

  onUnmount() {
  },

  toJSON() {
    return this.url;
  }
};

function createGraph(games: Game[]) {
  const canvas = document.querySelector<HTMLCanvasElement>("#graph")!;
  const context = canvas.getContext("2d")!;
  const percent = document.querySelector<HTMLParagraphElement>("#graph-percent")!;

  let winCount = 0;
  let looseCount = 0;

  for (let game of games) {
    if (game.selfScore > game.opponentScore)
      winCount++;
    else
      looseCount++;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.fillRect(0, 100, canvas.width, 1);
  context.fillStyle = "gray";
  context.fillRect(0, 50, canvas.width, 1);

  if (winCount + looseCount > 0) {
    context.fillStyle = "green";
    let height = winCount / (winCount + looseCount) * 100;
    context.fillRect(20, 100 - height, canvas.width / 2 - 40, height);
    context.fillStyle = "red";
    height = looseCount / (winCount + looseCount) * 100;
    context.fillRect(canvas.width / 2 + 20, 100 - height, canvas.width / 2 - 40, height);

    percent.innerText = (winCount / (winCount + looseCount) * 100).toFixed(0) + "%";
  } else {
    percent.innerText = "--%";
  }
}

function createFriend(friend: Friend) {
  const li = document.createElement("li");

  li.innerHTML = `
    <div class="flex items-center py-2 px-5 bg-gradient-to-br from-gray-400/0 via-gray-200/5 to-gray-100/10 border border-gray-600 rounded-lg">
      <div class="relative">
        <img alt="avatar" src="/avatar.webp" class="rounded-full h-[50px] w-[50px] bg-gray-950 border border-white">
        <div class="friend-status rounded-full w-[15px] h-[15px] bg-gray-500 absolute bottom-[0.25px] right-[0.25px] border-3 border-gray-800"></div>
      </div>
      <p class="cursor-pointer hover:underline flex-1 mx-5">Display Name</p>
      <i class="friend-remove fa-solid fa-trash cursor-pointer p-2 text-red-500 hover:text-red-800"></i>
    </div>
  `;

  const p = li.querySelector("p")!;

  p.innerText = friend.displayName;
  p.onclick = () => loadPage(profilePage, friend.id);

  if (friend.online)
    li.querySelector<HTMLDivElement>(".friend-status")!.classList.add("bg-green-500");

  if (friend.avatar != undefined)
    li.querySelector("img")!.src = URL.createObjectURL(new Blob([ new Uint8Array(friend.avatar) ]));

  li.querySelector("i")!.onclick = () => {
    send({ event: "remove_friend", user: friend.id });
    li.remove();
  };

  return li;
}

function createGame(game: Game, grid: HTMLDivElement) {
  const date = document.createElement("div");
  date.innerText = new Date(game.date).toDateString();
  date.className = "text-gray-500";

  const state = document.createElement("div");
  state.className = "text-center";
  if (game.selfScore < game.opponentScore) {
    state.innerText = "LOOSE";
    state.classList.add("text-red-500");
  } else {
    state.innerText = "WIN";
    state.classList.add("text-green-500");
  }

  const score = document.createElement("div");
  score.innerText = `${game.selfScore} - ${game.opponentScore}`;
  score.className = "text-center";

  const opponent = document.createElement("div");
  opponent.innerText = game.opponent ?? "{Deleted user}";

  grid.prepend(date, state, score, opponent);
}
