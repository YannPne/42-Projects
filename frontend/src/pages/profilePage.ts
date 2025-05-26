import { loadPage, type Page } from "./Page.ts";
import { closeWs, ws } from "../main.ts";
import { loginPage } from "./loginPage.ts";
import { send, sendAndWait } from "../Event.ts";
import qrcode from "qrcode";

let visible = true;

export const profilePage: Page<string> = {
  url: "/profile",
  title: "Profile",
  navbar: true,

  getPage(): string {
    return /*html*/`
      <button id="btnDisconnect" class="absolute top-15 right-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow">Disconnect</button>
      <div class="h-full flex flex-col overflow-hidden">
        <div class="flex items-center px-20 py-2 gap-2">
          <img id="image" alt="avatar" class="w-32 h-32 p-1 bg-gray-700" />
          <div>
            <p id="username" class="text-5xl pb-1 font-bold"></p>
            <p id="email" class="text-2xl font-bold pb-4"></p>
            <p id="status" class="text-xl pb-5 font-bold">online</p>
          </div>
          <i id="btn_hide" class="fas fa-eye pb-2 cursor-pointer"></i>
        </div>

        <div class="flex-1 flex justify-between space-x-8 w-full p-4 overflow-hidden">

          <div id="div_history" class="flex-1 flex flex-col bg-gray-700 space-y-1 p-4 rounded-xl">
            <p class="text-3xl pb-5">Match History:</p>
            <ul id="match-history" class="mx-3 overflow-auto"></ul>
          </div>
      
          <div class="flex flex-col justify-between">
            <div class="bg-gray-700 p-6 rounded-xl text-white flex flex-col items-center">
              <p class="text-3xl pb-2">Win rate:</p>
              <p id="win-rate" class="text-4xl font-bold pb-4">50%</p>
            </div>

            <div id="manage" class="bg-gray-700 p-6 rounded-xl text-white flex flex-col items-center mt-4 space-y-3">
              <p class="text-3xl pb-2">Manage:</p>
              <button id="button2fa" class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-40">2FA</button>
              <button id="edit-profile-btn" class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded w-40">Edit profile</button>
              <button id="delete" class="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-40">Delete Account</button>
            </div>
          </div>

          <div id="div_friend" class="flex-1 bg-gray-700 p-4 rounded-xl flex flex-col justify-between">
            <p class="text-3xl pb-5">Friend List:</p>
            <ul id="friends-list" class="mx-3 flex-1 space-y-1 overflow-y-auto"></ul>

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

      <div id="edit-profile-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center hidden">
        <div class="bg-gray-800 rounded-lg p-6 w-96">
          <h2 class="text-white text-xl mb-4">Edit profile</h2>
          <form id="edit-profile-form" class="flex flex-col space-y-4">
            <label>Username</label>
            <input type="text" id="edit_username" placeholder="Username" class="p-2 rounded bg-gray-700 text-white" required />
            <label>Display name</label>
            <input type="text" id="edit_displayName" placeholder="Display name" class="p-2 rounded bg-gray-700 text-white" required />
            <label>Email</label>
            <input type="email" id="edit_email" placeholder="Email" class="p-2 rounded bg-gray-700 text-white" required />
            <label>Password</label>
            <input type="password" id="edit_password" placeholder="password" class="p-2 rounded bg-gray-700 text-white" />
            <label>Avatar</label>
            <input type="file" id="edit_avatar" accept="image/*" class="border rounded-lg cursor-pointer text-gray-400 bg-gray-700 border-gray-600" />
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-btn" class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">Annuler</button>
              <button type="submit" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Sauvegarder</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  async onMount(profileUsername) {
    if (ws == undefined) {
      loadPage(loginPage, profilePage);
      return;
    }

    disconnect();
    deleteAccount();
    editAndHide();
    addFriend();
    removeFriend();
    getInfo(profileUsername ?? "");
    gameHistory();
    setup2fa();
  },

  onUnmount() {
  }
};

function disconnect() {
  const btnDisconnect = document.querySelector<HTMLButtonElement>("#btnDisconnect")!;

  btnDisconnect.onclick = () => {
    closeWs();
    loadPage(loginPage, profilePage);
  };
}

// TODO: GPDR is a lie
function editAndHide() {
  const btn_hide = document.querySelector<HTMLElement>("#btn_hide")!;
  const div_history = document.querySelector<HTMLDivElement>("#div_history")!;
  const div_friend = document.querySelector<HTMLDivElement>("#div_friend")!;
  const email = document.querySelector<HTMLParagraphElement>("#email")!;
  const toggleElements = [ div_history, div_friend, email ];


  function setBtnEye(visible: boolean) {
    btn_hide.classList.toggle("fa-eye", visible);
    btn_hide.classList.toggle("fa-eye-slash", !visible);

    for (let element of toggleElements) {
      element.classList.toggle("text-white", visible);
      element.classList.toggle("text-gray-400", !visible);
    }
  }

  btn_hide.onclick = () => {
    visible = !visible;
    send({ event: "set_hide_profile", hide: visible });
    setBtnEye(visible);
  };

  // EDIT PROFILE
  const editBtn = document.querySelector("#edit-profile-btn")!;
  const modal = document.querySelector("#edit-profile-modal")!;
  const cancelBtn = document.querySelector("#cancel-btn")!;
  const form = document.querySelector<HTMLFormElement>("#edit-profile-form");

  editBtn.addEventListener("click", async () => {
    modal.classList.remove("hidden");
    const data = await sendAndWait({ event: "get_info_profile" });
    document.querySelector<HTMLInputElement>("#edit_username")!.value = data.name!;
    document.querySelector<HTMLInputElement>("#edit_displayName")!.value = data.displayName!;
    document.querySelector<HTMLInputElement>("#edit_email")!.value = data.email!;
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    loadPage(profilePage);
  });

  form!.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userName = document.querySelector<HTMLInputElement>("#edit_username")!;
    const displayName = document.querySelector<HTMLInputElement>("#edit_displayName")!;
    const email = document.querySelector<HTMLInputElement>("#edit_email")!;
    const avatar = document.querySelector<HTMLInputElement>("#edit_avatar")!;
    const password = document.querySelector<HTMLInputElement>("#edit_password")!;
    let avatarBuffer: number[] | null = null;

    if (avatar.files && avatar.files.length != 0 && !avatar.files[0].type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    } else if (avatar.files && avatar.files.length != 0 && avatar.files[0].type.startsWith("image/"))
      avatarBuffer = Array.from(new Uint8Array(await avatar.files[0].arrayBuffer()));


    const message = await sendAndWait({
      event: "update_info",
      username: userName.value,
      displayName: displayName.value,
      password: password.value,
      email: email.value,
      avatar: avatarBuffer
    });

    if (!message.success)
      alert("Username or display name already exist");

    modal.classList.add("hidden");
    loadPage(profilePage);
  });
}

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
    let message = await sendAndWait({ event: "2fa" });
    if (message.enable) {
      if (confirm("The 2FA is currently enabled. Do you want to disable it?"))
        await sendAndWait({ event: "2fa", enable: false });
    } else {
      message = await sendAndWait({ event: "2fa", enable: true });
      qrcode.toCanvas(qrcodeCanvas, `otpauth://totp/ft_transcendence:${message.username}?secret=${message.secret}&issuer=ft_transcendence`);
      secret.innerText = message.secret!;
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

    if (target.id == "btn_remove") {
      const friendName = target.dataset.friend!;

      const message = await sendAndWait({ event: "remove_friend", id: friendName as any as number });

      if (message.success)
        target.closest("li")?.remove();
      else
        alert("An error occurred.");
    }
  };
}

function setBtnEye(visible: boolean) {
  const btnHide = document.querySelector<HTMLElement>("#btn_hide")!;
  const divHistory = document.querySelector<HTMLDivElement>("#div_history")!;
  const divFriend = document.querySelector<HTMLDivElement>("#div_friend")!;
  const email = document.querySelector<HTMLParagraphElement>("#email")!;
  const toggleElements = [ divHistory, divFriend, email ];

  btnHide.classList.toggle("fa-eye", visible);
  btnHide.classList.toggle("fa-eye-slash", !visible);

  toggleElements.forEach(el => {
    el.classList.toggle("text-white", visible);
    el.classList.toggle("text-gray-400", !visible);
  });
}

function hideProfile(hideProfile: boolean, hideData: boolean) {
  const btnHide = document.querySelector<HTMLElement>("#btn_hide")!;
  const divHistory = document.querySelector<HTMLDivElement>("#div_history")!;
  const divFriend = document.querySelector<HTMLDivElement>("#div_friend")!;
  const email = document.querySelector<HTMLParagraphElement>("#email")!;
  const toggleElements = [ divHistory, divFriend, email ];

  if (!hideProfile) {
    btnHide.style.visibility = "hidden";
    document.querySelector("#manage")!.classList.add("hidden");
    document.querySelector("#add_friend")!.classList.add("hidden");
    const btnRemove = document.querySelector<HTMLButtonElement>("#btn_remove");
    btnRemove?.classList.add("hidden");
    toggleElements.forEach(el => {
      el.classList.toggle("text-white", true);
    });
  } else {
    btnHide.style.visibility = "visible";
    document.querySelector("#manage")!.classList.remove("hidden");
    document.querySelector("#add_friend")!.classList.remove("hidden");
    const btnRemove = document.querySelector<HTMLButtonElement>("#btn_remove");
    btnRemove?.classList.remove("hidden");
  }

  if (!hideData && !hideProfile) {
    for (const child of divHistory.children)
      (child as HTMLElement).style.visibility = "hidden";
    for (const child of divFriend.children)
      (child as HTMLElement).style.visibility = "hidden";
    email.style.visibility = "hidden";
  } else {
    for (const child of divHistory.children)
      (child as HTMLElement).style.visibility = "visible";
    for (const child of divFriend.children)
      (child as HTMLElement).style.visibility = "visible";
    email.style.visibility = "visible";
  }
}

function getInfo(profileUsername: string) {
  const username = document.querySelector<HTMLParagraphElement>("#username")!;
  const email = document.querySelector<HTMLParagraphElement>("#email")!;
  const friendsList = document.querySelector<HTMLAnchorElement>("#friends-list")!;
  const imageElement = document.querySelector<HTMLImageElement>("#image")!;

  sendAndWait({ event: "get_info_profile", profileUsername }).then(async (message) => {
    username.innerText = message.displayName + " Profile";
    email.innerText = message.email!;
    const friendsCount = message.friends!.length;

    const statusElement = document.querySelector<HTMLParagraphElement>("#status")!;

    // hide profile
    visible = message.hideProfile!;
    setBtnEye(visible);

    // status
    if (message.status) {
      statusElement.textContent = "online";
      statusElement.classList.remove("text-gray-500");
      statusElement.classList.add("text-green-500");
    } else {
      statusElement.textContent = "offline";
      statusElement.classList.remove("text-green-500");
      statusElement.classList.add("text-gray-500");
    }

    if (friendsCount === 0) {
      const li = document.createElement("li");
      li.textContent = "No friends yet :'(";
      friendsList.appendChild(li);
    } else {
      const status = await sendAndWait({ event: "get_status", friends: message.friends });

      for (let i = 0; i < friendsCount; i++) {
        const friend = message.friends![i];
        const li = document.createElement("li");

        let statusDisplay = status.status![i] ? "bg-green-500" : "bg-gray-500";

        li.innerHTML = `
          <div class="w-full flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 ${statusDisplay} rounded-full mr-2 shadow-md"></span>
              <button id="btnFriend" class="friend-link hover:underline" data-friend="${friend}">${friend}</button>
            </div>
            <button id="btn_remove" class="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800" data-friend="${friend}">
              Remove
            </button>
          </div>
          `;
        friendsList.appendChild(li);

        const friendLink = li.querySelector<HTMLButtonElement>("#btnFriend")!;
        friendLink.innerText = friend;
        friendLink.onclick = (e) => {
          e.preventDefault();

          const friendName = friendLink.dataset.friend!;
          loadPage(profilePage, friendName);
        };
      }
    }

    imageElement.src = message.avatar != null
        ? URL.createObjectURL(new Blob([ new Uint8Array(message.avatar.data) ]))
        : "/avatar.webp";

    hideProfile(message.mainProfile!, message.hideProfile!);
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
      document.querySelector<HTMLParagraphElement>("#win-rate")!.innerHTML = "- %";
    } else {
      let winRate = 0;

      for (let game of message.games!.reverse()) {
        const li = document.createElement("li");

        if (game.score1 > game.score2) {
          winRate += 1;
          // TODO: XSS attack
          li.innerHTML = `${game.date} | <span class="text-green-500">WIN</span> ${game.score1} - ${game.score2} versus ${game.name2}`;
        } else
          li.innerHTML = `${game.date} | <span class="text-red-500">LOSS</span> ${game.score1} - ${game.score2} versus ${game.name2}`;

        historyList.appendChild(li);
      }

      document.querySelector<HTMLParagraphElement>("#win-rate")!.innerHTML = ~~(winRate / matchCount * 100) + "%";
    }
  });
}
