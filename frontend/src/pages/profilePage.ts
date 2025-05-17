import { loadPage, type Page } from "./Page.ts";
import { awaitWs, ws } from "../main.ts";
import { loginPage } from "./loginPage.ts";
import { sendAndWait } from "../Event.ts";

export const profilePage: Page = {
  url: "/profile",
  title: "Profile",
  navbar: true,

  getPage(): string {
    return /*html*/`
    <div class="h-full flex flex-col justify-start items-center">
    <img id="image" alt="avatar" class="w-32 h-32 border-4 border-gray-700 bg-gray-700" />

    <p id="username" class="text-5xl pb-5 font-bold"></p>
    <p class="text-xl pb-5 text-green-500 font-bold">online</p>

    <div class="flex justify-between space-x-8 w-full max-w-7xl px-4 mt-6">
    
      <div class="bg-gray-700 space-y-1 p-4 w-1/3 h-[500px] rounded-xl">
        <ul id="match-history" class="pl-3 text-white">
          <li class="text-3xl pb-5">Match History:</li>
        </ul>
      </div>
    
      <div class="flex flex-col space-y-40">
        <div class="bg-gray-700 p-6 rounded-xl text-white flex flex-col items-center">
          <p class="text-3xl pb-2">Winrate:</p>
          <p id="winrate" class="text-4xl font-bold pb-4">50%</p>
        </div>

        <div class="bg-gray-700 p-6 rounded-xl text-white flex flex-col items-center mt-4 space-y-3">
          <p class="text-3xl pb-2">Manage:</p>
          <button class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-40">2FA</button>
          <button class="bg-white hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-200 w-40">Google</button>
          <button class="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-40">Delete Account</button>
        </div>
      </div>

    <div class="bg-gray-700 p-4 w-1/3 rounded-xl h-[500px] flex flex-col justify-between">
      <ul id="friends-list" class="pl-3 text-white space-y-1 overflow-y-auto">
        <li class="text-3xl pb-5">Friend List:</li>
      </ul>

      <form id="add_friend" class="flex items-center space-x-2 mt-5 w-full">
        <input id="username_to_add" placeholder="username" type="text" required class="p-1 bg-gray-600 rounded-lg flex-1" />
        <button class="rounded-2xl bg-green-600 hover:bg-green-600 p-2 cursor-pointer">ADD</button>
      </form>
    </div>


    </div>
  </div>
    `;
  },


  async onMount() {
    if (ws == undefined) {
      loadPage(loginPage, profilePage);
      return;
    }

    await awaitWs();

    // ADD FRIEND
    const addFriendButton = document.querySelector<HTMLFormElement>("#add_friend")!;
    const username = document.querySelector<HTMLInputElement>("#username_to_add")!;


    addFriendButton.onsubmit = async (event) => {
      event.preventDefault();

      if (username.value.trim() == "")
        return;


      sendAndWait({ event: "set_friend", name: username.value.trim()}).then(message => {
        if (message.success)
          loadPage(profilePage);
      });
    };

    // Remove friend
    document.getElementById("friends-list")?.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;

      if (target.tagName === "BUTTON" && target.dataset.friend) {
        const friendName = target.dataset.friend;

        const message = await sendAndWait({ event: "remove_friend", name: friendName });

        if (message.success) 
        {
          const li = target.closest("li");
          li?.remove();
        }
      }
    });

    
    // GET INFO PROFILE
    sendAndWait({event: "get_info_profile"}).then( (message: any) => {
      
      // USERNAME
      document.getElementById("username")!.innerHTML = message.name + " Profile";

      // FRIEND LIST
      const friendsList = document.getElementById("friends-list");
      const friendsCount = message.friends?.length;

      if (friendsCount === 0) 
      {
        const li = document.createElement("li");
        li.textContent = "No friend yet :'(";
        friendsList?.appendChild(li);
      } 
      else 
      {
        friendsList!.innerHTML = `<li class="text-3xl pb-5">Friends list:</li>`;

        for (let i = friendsCount - 1; i >= 0; i--) 
        {
          const friend = message.friends[i];
          const li = document.createElement("li");

          li.id = `friend-${i}`;
          li.className = "flex items-center gap-2"; // pour aligner le nom et le bouton

          li.innerHTML = `
          <div class="w-full flex justify-between items-center">
            <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 bg-green-500 rounded-full mr-2 shadow-md"></span>
            <span>${friend}</span>
            </div>
            <button class="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800" data-friend="${friend}">
              Remove
            </button>
            </div>
          `;
          friendsList?.appendChild(li);
        }
      } 

      // AVATAR

      const mimeType = message.avatar.type || 'image/jpeg';

      const byteArray = new Uint8Array(message.avatar.data); // conversion explicite
      const imageBlob = new Blob([byteArray], { type: mimeType });
      const imageUrl = URL.createObjectURL(imageBlob);

      console.log(message.avatar.data);

      const imageElement = document.getElementById('image');
      if (imageElement instanceof HTMLImageElement)
        imageElement.src = imageUrl;
    });

    // GAME HISTORY
    sendAndWait({event: "get_games_history"}).then( (message: any) => {
      const historyList = document.getElementById("match-history");
      const matchCount = message.id1?.length;

      if (matchCount === 0) {
        const li = document.createElement("li");
        li.textContent = "No matches played yet.";
        historyList?.appendChild(li);
        document.getElementById("winrate")!.innerHTML = "- %";
        return;
      } 
      else 
      {
        historyList!.innerHTML = `<li class="text-3xl pb-5">Match History:</li>`;
        let winrate: number = 0;

        for (let i = matchCount - 1; i >= 0; i--) 
        {
          const myScore = message.score1[i];
          const opponentScore = message.score2[i];

          const win = myScore > opponentScore;
          const outcomeText = win ? "WIN" : "LOSS";
          const outcomeClass = win ? "text-green-500" : "text-red-500";
          const date = message.date[i];
          const li = document.createElement("li");

          winrate += +win;

          li.innerHTML = `${date} | <span class="${outcomeClass}">${outcomeText}</span> ${myScore} - ${opponentScore} versus ${message.name2[i]}`;
          historyList?.appendChild(li);
        }
        document.getElementById("winrate")!.innerHTML = ~~(winrate / matchCount * 100) + "%";
      }      
    });
  },

  onUnmount() {
  }
};
