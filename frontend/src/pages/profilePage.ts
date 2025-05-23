import { loadPage, type Page } from "./Page.ts";
import { closeWs, ws } from "../main.ts";
import { loginPage } from "./loginPage.ts";
import { sendAndWait } from "../Event.ts";
import qrcode from "qrcode";

export const profilePage: Page = {
  url: "/profile",
  title: "Profile",
  navbar: true,

  getPage(): string {
    return /*html*/ `
      <div class="h-full flex flex-col justify-start items-center">
        <img id="image" alt="avatar" class="w-32 h-32 border-4 border-gray-700 bg-gray-700" />
        <p id="username" class="text-5xl pb-5 font-bold"></p>
        <p class="text-xl pb-5 text-green-500 font-bold">online</p>

        <div class="flex justify-between space-x-8 w-full max-w-7xl px-4 mt-6">
    
          <div class="bg-gray-700 space-y-1 p-4 w-1/3 min-h-[200px] rounded-xl">
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
              <button id="button2fa" class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-40">2FA</button>
              <button class="bg-white hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-200 w-40">Google</button>
              <button id="delete" class="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-40">Delete Account</button>
            </div>
          </div>

          <div class="bg-gray-700 p-4 w-1/3 min-h-[200px] rounded-xl flex flex-col justify-between">
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
      <div id="modal-2fa" class="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div class="bg-gray-800 p-10 rounded-4xl shadow-lg w-full max-w-md">
          <h1 class="font-bold text-xl text-center mb-5">2FA setup - Authenticator app</h1>
            <ol class="list-decimal list-outside space-y-2">
              <li>
                Use an authenticator app for TOTP codes like Google Authenticator or Authy
              </li>
              <li>
                Scan this QRCode:
                <canvas id="qrcode"></canvas>
                <p>Or enter this secret in your app:</p>
                <div id="secret" class="overflow-auto bg-gray-900 p-1"></div>
              </li>
              <li>
                <p>Input the value indicated by your authentication app:</p>
                <input id="verify" type="text" class="bg-gray-700 p-1 rounded">
              </li>
            </ol>
            <div class="flex justify-end gap-3">
              <button id="cancel" class="cursor-pointer m-2 hover:underline">Cancel</button>
              <button id="validate" class="cursor-pointer p-2 bg-blue-800 hover:bg-blue-900 rounded-2xl">Validate</button>
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

    deleteAccount();
    addFriend();
    removeFriend();
    getInfo();
    gameHistory();
    setup2fa();
  },

  onUnmount() {
  }
};

function setup2fa() {
  const button = document.querySelector<HTMLButtonElement>("#button2fa")!;
  const modal = document.querySelector<HTMLDivElement>("#modal-2fa")!;
  const qrcodeCanvas = modal.querySelector<HTMLCanvasElement>("#qrcode")!;
  const secret = modal.querySelector<HTMLSpanElement>("#secret")!;
  const verify = modal.querySelector<HTMLInputElement>("#verify")!;
  const validate = modal.querySelector<HTMLButtonElement>("#validate")!;
  const cancel = modal.querySelector<HTMLButtonElement>("#cancel")!;

  modal.style.display = "none";

  button.onclick = async () => {
    let message = await sendAndWait({event: "2fa"});
    if (message.enable) {
      if (confirm("The 2FA is currently enabled. Do you want to disable it?"))
        await sendAndWait({event: "2fa", enable: false});
    } else {
      message = await sendAndWait({ event: "2fa", enable: true });
      qrcode.toCanvas(qrcodeCanvas, `otpauth://totp/ft_transcendence:${message.username}?secret=${message.secret}&issuer=ft_transcendence`);
      secret.innerText = message.secret;
      modal.style.display = "";
      verify.value = "";
    }
  };

  validate.onclick = async () => {
    const message = await sendAndWait({ event: "2fa_check", code: verify.value });
    if (message.success)
      modal.style.display = "none";
    else
      alert("Invalid code");
  };

  cancel.onclick = () => {
    modal.style.display = "none";
  };
}

function deleteAccount() {
  document.querySelector<HTMLButtonElement>("#delete")!.onclick = () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");

    if (!confirmDelete)
      return;

    sendAndWait({ event: "del_account" }).then(message => {
      if (message.success) {
        closeWs();
        loadPage(loginPage, profilePage);
      } else
        alert("An error occurred.");
    });
  };
}

function addFriend() {
  const form = document.querySelector<HTMLFormElement>("#add_friend")!;
  const username = document.querySelector<HTMLInputElement>("#username_to_add")!;

  form.onsubmit = event => {
    event.preventDefault();

    sendAndWait({ event: "set_friend", name: username.value.trim() }).then(message => {
      if (message.success)
        loadPage(profilePage);
      else
        alert("The user does not exist.");
    });
  };
}

function removeFriend() {
  document.querySelector<HTMLButtonElement>("#friends-list")!.onclick = async (event) => {
    const target = event.target as HTMLElement;

    if (target.tagName === "BUTTON" && target.dataset.friend) {
      const friendName = target.dataset.friend;

      const message = await sendAndWait({ event: "remove_friend", name: friendName });

      if (message.success) {
        const li = target.closest("li");
        li?.remove();
      } else
        alert("An error occurred.");
    }
  };
}

function getInfo() {
  const username = document.querySelector<HTMLParagraphElement>("#username")!;
  const friendsList = document.querySelector<HTMLAnchorElement>("#friends-list")!;
  const imageElement = document.querySelector<HTMLImageElement>("#image")!;

  sendAndWait({ event: "get_info_profile" }).then(async (message) => {
    username.innerText = message.name + " Profile";
    const friendsCount = message.friends!.length;

    if (friendsCount === 0) {
      const li = document.createElement("li");
      li.textContent = "No friends yet :'(";
      friendsList?.appendChild(li);
    } else {
      const status = await sendAndWait({ event: "get_status", friends: message.friends });

      for (let i = 0; i < friendsCount; i++) {
        const friend = message.friends![i];
        const li = document.createElement("li");

        let status_display = status.status![i] ? "bg-green-500" : "bg-gray-500";
        li.id = `friend-${i}`;
        li.className = "flex items-center gap-2";

        li.innerHTML = `
          <div class="w-full flex justify-between items-center">
            <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 ${status_display} rounded-full mr-2 shadow-md"></span>
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

    imageElement.src = message.avatar != null
      ? URL.createObjectURL(new Blob([new Uint8Array(message.avatar.data)]))
      : "/avatar.webp";
  });
}

function gameHistory() {
  sendAndWait({ event: "get_games_history" }).then(message => {
    const historyList = document.querySelector<HTMLUListElement>("#match-history")!;
    const matchCount = message.games!.length;

    if (matchCount === 0) {
      const li = document.createElement("li");
      li.textContent = "No matches played yet.";
      historyList.appendChild(li);
      document.querySelector<HTMLParagraphElement>("#winrate")!.innerHTML = "- %";
    } else {
      historyList.innerHTML = `<li class="text-3xl pb-5">Match History:</li>`;
      let winrate: number = 0;

      for (let game of message.games!.reverse()) {
        const li = document.createElement("li");

        if (game.score1 > game.score2) {
          winrate += 1;
          // TODO: XSS attack
          li.innerHTML = `${game.date} | <span class="text-green-500">WIN</span> ${game.score1} - ${game.score2} versus ${game.name2}`;
        } else
          li.innerHTML = `${game.date} | <span class="text-red-500">LOSS</span> ${game.score1} - ${game.score2} versus ${game.name2}`;

        historyList.appendChild(li);
      }

      document.querySelector<HTMLParagraphElement>("#winrate")!.innerHTML = ~~(winrate / matchCount * 100) + "%";
    }
  });
}
