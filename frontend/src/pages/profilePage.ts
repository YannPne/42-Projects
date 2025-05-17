import { loadPage, type Page } from "./Page.ts";
import { awaitWs, ws } from "../main.ts";
import { loginPage } from "./loginPage.ts";
import { sendAndWait } from "../Event.ts";

export const profilePage: Page = {
  url: "/profile",
  title: "Profile",
  navbar: true,

  getPage(): string {
    return `
    <div class="h-full flex flex-col justify-start items-center">
    <img src="src/pages/profile.jpg" alt="avatar" class="w-32 h-32 border-4 border-gray-700 bg-gray-700" />
    <img id="image" alt="Image from BLOB" />

    <p class="text-5xl pb-5 font-bold">JSCHAFT's Profile</p>
    <p class="text-xl pb-5 text-green-500 font-bold">online</p>

    <div class="flex justify-between space-x-8 w-full max-w-7xl px-4 mt-6">
    
      <div class="bg-gray-700 space-y-1 p-4 w-1/3 h-[700px] rounded-xl">
        <ul id="match-history" class="pl-3 text-white">
          <li class="text-3xl pb-5">Match History:</li>
        </ul>
      </div>
    
      <div class="flex flex-col space-y-40">
        <div class="bg-gray-700 p-6 rounded-xl text-white flex flex-col items-center">
          <p class="text-3xl pb-2">Winrate:</p>
          <p class="text-4xl font-bold pb-4">50%</p>
        </div>

        <div class="bg-gray-700 p-6 rounded-xl text-white flex flex-col items-center mt-4 space-y-3">
          <p class="text-3xl pb-2">Manage:</p>
          <button class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-40">A2F</button>
          <button class="bg-white hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-200 w-40">Google</button>
          <button class="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-40">Delete Account</button>
        </div>
      </div>

      <div class="bg-gray-700 p-4 w-1/3 rounded-xl h-[700px]">
        <ul class="pl-3 text-white space-y-1">
          <li class="text-3xl pb-5">Friend List:</li>
          <li class="font-semibold flex justify-between items-center">
            <span>bde</span>
            <button class="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded">Unfriend</button>
          </li>

          <li class="font-semibold flex justify-between items-center">
            <span>damien</span>
            <button class="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded">Unfriend</button>
          </li>

          <li class="font-semibold flex justify-between items-center">
            <span>charlie</span>
            <button class="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded">Unfriend</button>
          </li>

          <li class="font-semibold flex justify-between items-center">
            <span>yann</span>
            <button class="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded">Unfriend</button>
          </li>
        </ul>
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

    // sendAndWait({event: "get_avatar"}).then( (message: any) => {
      
      
    //   const imageBlob = new Blob([message.avatar], { type: 'image/jpeg' });

    //   // Crée une URL temporaire pour l'affichage de l'image
    //   const imageUrl = URL.createObjectURL(imageBlob);
  
    //   // Sélectionner l'élément <img> et lui affecter l'URL
    //   document.getElementById('image').src = imageUrl;
    // });

    sendAndWait({event: "get_games_history"}).then( (message: any) => {
      const historyList = document.getElementById("match-history");
      console.log(message.id1);
      const matchCount = message.id1?.length;
      console.log(matchCount);

      if (matchCount === 0) {
        const li = document.createElement("li");
        li.textContent = "No matches played yet.";
        historyList?.appendChild(li);
        return;
      } else 
      {
      historyList!.innerHTML = `<li class="text-3xl pb-5">Match History:</li>`;

      for (let i = matchCount - 1; i >= 0; i--) {
      const myScore = message.score1[i];
      const opponentScore = message.score2[i];

      const win = myScore > opponentScore;
      const outcomeText = win ? "WIN" : "LOSS";
      const outcomeClass = win ? "text-green-500" : "text-red-500";
      const opponentName = message.id2[i] == 0 ? "ai" : "player";

      const li = document.createElement("li");
      li.innerHTML = `??-??-???? | <span class="${outcomeClass}">${outcomeText}</span> ${myScore} - ${opponentScore} versus ${message.name2[i]}`;
      historyList?.appendChild(li);
      }
      }
      });
  },

  onUnmount() {
  }
};
