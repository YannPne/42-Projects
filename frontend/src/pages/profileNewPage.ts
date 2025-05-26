import { type Page } from "./Page.ts";

export const profileNewPage: Page<Page<number>> = {
  url: "/profile_new",
  title: "Profile",
  navbar: false,

  getPage(): string {
    return `
      <div class="h-full flex flex-col overflow-hidden">
        <div class="p-5 flex justify-between">
          <div class="flex items-center gap-2">
            <img alt="avatar" src="/avatar.webp" class="w-[100px] h-[100px] bg-gray-950 border border-white rounded-full">
            <div>
              <p class="text-4xl font-bold">Name</p>
              <p class="text-gray-400">email</p>
              <p class="text-green-500">online</p>
            </div>
          </div>
          <div>
             Graph
          </div>
          <div>
            <i class="fa-solid fa-gear hover:text-gray-400 cursor-pointer"></i>
          </div>
        </div>
        <hr class="h-px bg-gray-200 border-0">
        <div class="flex-1 flex bg-gradient-to-b from-gray-900 to-gray-700 overflow-hidden">
          <div class="flex-1 flex flex-col p-5 overflow-hidden">
            <p class="text-center font-bold text-2xl">GAME HISTORY</p>
            <ul id="game-history" class="overflow-auto flex-1"></ul>
          </div>
          <div class="h-full border border-gray-600"></div>
          <div class="flex-1 flex flex-col px-5 pt-5">
            <p class="text-center font-bold text-2xl">FRIENDS</p>
            <ul id="friends" class="overflow-auto flex-1"></ul>
            <form class="w-full p-4 flex gap-4">
              <input placeholder="Username" class="flex-1 bg-gray-600 p-2 rounded-2xl">
              <button class="px-5 bg-gray-900 rounded-2xl">Add</button>
            </form>
          </div>
        </div>
      </div>
      <div id="lock" class="absolute bg-gray-900/70 inset-0 flex flex-col items-center justify-center">
        <i class="fa-solid fa-lock text-9xl"></i>
        <p class="text-7xl font-bold mt-2">Name</p>
        <p class="text-3xl">Prive profile</p>
      </div>
	  `;
  },

  onMount() {
    const lock = document.querySelector<HTMLDivElement>("#lock")!;
    const gameHistory = document.querySelector<HTMLUListElement>("#game-history")!;
    const friends = document.querySelector<HTMLUListElement>("#friends")!;

    lock.style.display = "none";
  },

  onUnmount() {
  }
};
