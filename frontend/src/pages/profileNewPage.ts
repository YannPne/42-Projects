import { loadPage, type Page } from "./Page.ts";
import { type Friend, type Game, send, sendAndWait } from "../Event.ts";

export const profileNewPage: Page<number> = {
  url: "/profile_new",
  title: "Profile",
  navbar: false,

  getPage() {
    return `
      <div class="h-full flex flex-col overflow-hidden">
        <div class="p-5 flex justify-between">
          <div class="flex items-center gap-2">
            <img id="avatar" alt="avatar" src="/avatar.webp" class="w-[100px] h-[100px] bg-gray-950 border border-white rounded-full">
            <!-- TODO: Add the status as a circle -->
            <div>
              <p id="display-name" class="text-4xl font-bold">Name</p>
              <p id="username">username</p>
              <p id="email" class="text-gray-400">email</p>
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

  async onMount() {
    const lock = document.querySelector<HTMLDivElement>("#lock")!;
    const avatar = document.querySelector<HTMLImageElement>("#avatar")!;
    const displayName = document.querySelector<HTMLParagraphElement>("#display-name")!;
    const username = document.querySelector<HTMLParagraphElement>("#username")!;
    const email = document.querySelector<HTMLParagraphElement>("#email")!;
    const gameHistory = document.querySelector<HTMLUListElement>("#game-history")!;
    const friends = document.querySelector<HTMLUListElement>("#friends")!;

    friends.appendChild(createFriend({ id: 0, displayName: "hello" }));
    friends.appendChild(createFriend({ id: 0, displayName: "world" }));
    friends.appendChild(createFriend({ id: 0, displayName: "foo" }));
    friends.appendChild(createFriend({ id: 0, displayName: "bar" }));

    const profile = await sendAndWait({ event: "get_profile" });
    if (!profile.locked) {
      lock.style.display = "none";

      if (profile.avatar)
        avatar.src = URL.createObjectURL(new Blob([ new Uint8Array(profile.avatar) ]));

      displayName.textContent = profile.displayName;
      username.textContent = profile.username;
      email.textContent = profile.email;

      for (let friend of profile.friends)
        friends.appendChild(createFriend(friend));
      for (let game of profile.gameHistory)
        gameHistory.appendChild(createGame(game));
    }
  },

  onUnmount() {
  }
};

function createFriend(friend: Friend) {
  const li = document.createElement("li");

  li.innerHTML = `
    <div class="flex">
      <img alt="avatar" src="/avatar.webp" class="rounded-full h-[50px] w-[50px]">
      <p class="cursor-pointer hover:underline"></p>
      <button>Remove</button>
    </div>
  `;

  const p = li.querySelector("p")!;

  p.innerText = friend.displayName;
  p.onclick = () => loadPage(profileNewPage, friend.id);

  li.querySelector("button")!.onclick = () => {
    send({ event: "remove_friend", id: friend.id });
    li.remove();
  };

  return li;
}

function createGame(game: Game) {
  const li = document.createElement("li");
  return li;
}
