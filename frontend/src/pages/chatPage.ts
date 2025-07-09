import { currentPage, loadPage, type Page } from "./Page.ts";
import { loginPage } from "./loginPage.ts";
import { ws } from "../websocket.ts";
import type { Message, ServerEvent } from "@ft_transcendence/core";
import { send, sendAndWait } from "../Event.ts";
import { profilePage } from "./profilePage.ts";
import { startPage } from "./startPage.ts";
import { pongPage } from "./pongPage.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;

let currentChannel: number | undefined = undefined;
let currentChannelButton: HTMLButtonElement | undefined;

export const chatData = {
  hidden: false
};

let messages = {
  general: [] as Message[],
  generalAllRead: true,
  users: {} as {
    [key: number]: {
      messages: Message[],
      allRead: boolean
    }
  }
};

let info: ServerEvent & { event: "init_chat" } = {
  event: "init_chat",
  id: 0,
  friends: [],
  blocked: [],
  online: []
};

export const chatPage: Page = {
  url: "/chat",
  title: "Chat",

  getPage() {
    return `
      <div id="live-chat-divider" class="h-full flex flex-col justify-center bg-gray-600 cursor-pointer *:text-gray-300 px-[1px]">
        <i class="fa-solid text-xs"></i>
        <i class="fa-solid text-xs"></i>
        <i class="fa-solid text-xs"></i>
      </div>
      <div id="live-chat" class="h-full flex flex-col overflow-hidden w-[30%]">
        <div class="flex border-b border-gray-300 overflow-hidden gap-2 px-2">
          <button id="chat-general" class="px-2 py-1 hover:bg-gray-500 cursor-pointer flex items-center">
            <div class="h-[10px] w-[10px] rounded-full bg-blue-500 mr-1" style="display: none"></div>
            <span>General</span>
          </button>
          <div class="h-full border border-white"></div>
          <div id="chat-users" class="flex-1 flex overflow-auto *:px-2 *:py-1 *:hover:bg-gray-500 *:cursor-pointer"></div>
        </div>
        <ul id="chat-messages" class="flex-1 overflow-y-auto overflow-x-hidden p-2 flex flex-col-reverse bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 gap-2"></ul>  
        <form id="chat-message-input" class="flex *:p-2 items-center">
          <input type="text" required autocomplete="off" placeholder="Type your message here..." class="flex-1 placeholder-gray-500">
          <button class="cursor-pointer">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
        <div id="chat-dm-actions" class="flex *:flex-1 *:py-1 *:rounded-lg *:not-disabled:cursor-pointer" style="display: none">
          <button id="chat-profile" class="bg-green-500 hover:bg-green-700">Profile</button>
          <button id="chat-add-friend" class="bg-blue-500 hover:bg-blue-700"></button>
          <button id="chat-block" class="bg-red-500 hover:bg-red-700">Block</button>
          <button id="chat-invite" disabled class="bg-amber-500 hover:bg-amber-700 disabled:bg-amber-800">Invite to tournament</button>
        </div>
      </div>
    `;
  },

  async onMount() {
    if (ws == undefined) {
      loadPage(loginPage, undefined, "REPLACE");
      return;
    }

    const liveChatDivider = document.querySelector<HTMLDivElement>("#live-chat-divider")!;
    const liveChatDiv = document.querySelector<HTMLDivElement>("#live-chat")!;

    if (chatData.hidden) {
      liveChatDiv.classList.add("hidden");
      for (let child of liveChatDivider.children) {
        child.classList.add("fa-caret-left");
        child.classList.remove("fa-caret-right");
      }
    } else {
      for (let child of liveChatDivider.children) {
        child.classList.add("fa-caret-right");
        child.classList.remove("fa-caret-left");
      }
    }

    liveChatDivider.onclick = () => {
      chatData.hidden = liveChatDiv.classList.toggle("hidden");
      if (chatData.hidden) {
        for (let child of liveChatDivider.children) {
          child.classList.add("fa-caret-left");
          child.classList.remove("fa-caret-right");
        }
      } else {
        for (let child of liveChatDivider.children) {
          child.classList.add("fa-caret-right");
          child.classList.remove("fa-caret-left");
        }
      }
    };

    const general = document.querySelector<HTMLButtonElement>("#chat-general")!;
    const form = document.querySelector<HTMLFormElement>("#chat-message-input")!;
    const formMessage = form.querySelector("input")!;
    const profile = document.querySelector<HTMLButtonElement>("#chat-profile")!;
    const addFriend = document.querySelector<HTMLButtonElement>("#chat-add-friend")!;
    const block = document.querySelector<HTMLButtonElement>("#chat-block")!;
    const invite = document.querySelector<HTMLButtonElement>("#chat-invite")!;

    general.onclick = () => channelChange(general);

    form.onsubmit = event => {
      event.preventDefault();
      send({
        event: "message", to: currentChannel,
        message: { type: "message", sender: 0, content: formMessage.value }
      });
      formMessage.value = "";
    };

    profile.onclick = () => loadPage(profilePage, currentChannel!);

    addFriend.onclick = () => {
      if (currentChannelButton!.dataset.isFriend == "0") {
        send({ event: "add_friend", user: currentChannel! });
        addFriend.innerText = "Remove friend";
        currentChannelButton!.querySelector("i")!.style.display = "";
        currentChannelButton!.dataset.isFriend = "1";
      } else {
        send({ event: "remove_friend", user: currentChannel! });
        addFriend.innerText = "Add friend";
        currentChannelButton!.querySelector("i")!.style.display = "none";
        currentChannelButton!.dataset.isFriend = "0";
      }
    };

    block.onclick = () => {
      if (!confirm("Are you sure you want to block this user? You can unblock them later."))
        return;

      send({ event: "swap_block", user: currentChannel!, block: true });
      currentChannelButton!.remove();
      info.blocked.push(currentChannel!);
      general.click();
    };

    invite.onclick = () => {
        send({ event: "message", to: currentChannel!, message: { type: "invite" } });
    };

    info = await sendAndWait({ event: "init_chat" });

    ws.addEventListener("message", wsListener = event => {
      const data: ServerEvent = JSON.parse(event.data);

      if (data.event == "message") {
        if (data.from == undefined)
          messages.general.push(data.message);
        else
          messages.users[data.from].messages.push(data.message);

        if (data.from == currentChannel) {
          if (data.message.type == "message")
            createMessage(data.message);
          else
            createSystemMessage(data.message, data.from);
        } else {
          if (data.from == undefined)
            messages.generalAllRead = false;
          else
            messages.users[data.from].allRead = false;
          updateUsers();
        }
      } else if (data.event == "enter_chat") {
        info.online.push({ ...data });
        messages.users[data.id] ??= {
          messages: [],
          allRead: true
        };
        updateUsers();
      } else if (data.event == "leave_chat") {
        info.online.splice(info.online.findIndex(o => o.id == data.id), 1);
        updateUsers();
      }
    });

    for (let user of info.online) {
      messages.users[user.id] = {
        messages: [],
        allRead: true
      };
    }

    updateUsers();
  },

  onUnmount() {
    send({ event: "leave_chat" });

    if (wsListener != undefined)
      ws?.removeEventListener("message", wsListener);
    wsListener = undefined;
  },

  toJSON() {
    return this.url;
  }
};

function updateUsers() {
  const users = document.querySelector<HTMLDivElement>("#chat-users")!;

  const seen = new Set<number>();
  const online = info.online
    .filter(u => !info.blocked.includes(u.id))
    .filter(u => u.id != info.id)
    .filter(u => {
      if (seen.has(u.id))
        return false;
      seen.add(u.id);
      return true;
    });

  online.sort((a, b) => {
    let result = 0;
    if (info.friends.includes(a.id))
      result -= 5;
    if (!messages.users[a.id].allRead)
      result--;
    if (info.friends.includes(b.id))
      result += 5;
    if (!messages.users[b.id].allRead)
      result++;
    return result;
  });

  currentChannelButton = undefined;
  users.innerHTML = "";
  for (let user of online)
    createUser(users, user);

  const general = document.querySelector<HTMLButtonElement>("#chat-general")!;
  // createUser might set currentChannelButton, don't trust static analysis
  if (currentChannelButton == undefined)
    general.click();
  if (!messages.generalAllRead)
    general.querySelector("div")!.style.display = "";
}

function createUser(users: HTMLDivElement, user: { id: number, avatar?: number[], name: string }) {
  const button = document.createElement("button");
  button.className = "flex items-center";
  button.dataset.id = user.id.toString();

  button.innerHTML = `
    <div class="h-[10px] w-[10px] rounded-full bg-blue-500 mr-1" style="display: none"></div>
    <img src="/avatar.webp" alt="avatar" class="rounded-full h-[25px] w-[25px] bg-gray-950 border border-white">
    <span class="mx-1 text-ellipsis overflow-hidden"></span>
    <i class="fa-solid fa-star text-yellow-500" style="display: none"></i>
  `;

  if (!messages.users[user.id].allRead)
    button.querySelector("div")!.style.display = "";
  if (user.avatar != undefined)
    button.querySelector("img")!.src = URL.createObjectURL(new Blob([ new Uint8Array(user.avatar) ]));
  button.querySelector("span")!.innerText = user.name;
  if (info.friends.includes(user.id))
    button.querySelector("i")!.style.display = "";

  button.onclick = () => channelChange(button, user.id);

  if (currentChannel == user.id) {
    currentChannelButton = button;
    button.click();
  }

  users.appendChild(button);
}

function channelChange(button: HTMLButtonElement, id?: number) {
  currentChannelButton?.classList.remove("border-b-2", "border-white");

  button.classList.add("border-b-2", "border-white");
  if (id == undefined)
    messages.generalAllRead = true;
  else
    messages.users[id].allRead = true;
  button.querySelector("div")!.style.display = "none";
  currentChannel = id;
  currentChannelButton = button;

  const messagesList = document.querySelector<HTMLUListElement>("#chat-messages")!;

  messagesList.innerHTML = "";
  (id == undefined ? messages.general : messages.users[id].messages).forEach(m => {
    if (m.type == "message")
      createMessage(m);
    else
      createSystemMessage(m, id);
  });

  document.querySelector<HTMLDivElement>("#chat-dm-actions")!
    .style.display = id == undefined ? "none" : "";
  if (id != undefined) {
    const addFriend = document.querySelector<HTMLButtonElement>("#chat-add-friend")!;
    const isFriend = info.friends.includes(id);
    addFriend.innerText = isFriend ? "Remove friend" : "Add friend";
    button.dataset.isFriend = isFriend ? "1" : "0";
  }
}

function createMessage(message: Message & { type: "message" }) {
  const ul = document.querySelector<HTMLUListElement>("#chat-messages")!;

  const li = document.createElement("li");
  li.innerHTML = `
    <div class="flex gap-1 h-full w-full">
      <div class="message-user flex gap-2">
        <img src="/avatar.webp" alt="avatar" class="rounded-full h-[25px] w-[25px] bg-gray-950 border border-white">
        <span class="font-bold"></span>
      </div>
      <div class="border border-white h-full mx-3"></div>
      <p class="flex-1"></p>
      <button class="rounded-lg bg-gray-500 hover:bg-gray-600 cursor-pointer px-1" style="display: none">Unblock</button>
    </div>
  `;

  const sender = info.online.find(o => o.id == message.sender)!;
  if (sender == undefined)
    return;
  if (sender.avatar != undefined)
    li.querySelector("img")!.src = URL.createObjectURL(new Blob([ new Uint8Array(sender.avatar) ]));
  li.querySelector("span")!.innerText = sender.name;
  const content = li.querySelector("p")!;

  if (info.blocked.includes(message.sender)) {
    content.innerText = "Blocked user";
    content.classList.add("text-gray-500");

    const unblock = li.querySelector("button")!;
    unblock.style.display = "";
    unblock.onclick = () => {
      send({ event: "swap_block", user: message.sender, block: false });
      info.blocked.splice(info.blocked.indexOf(message.sender), 1);
      updateUsers();
      currentChannelButton!.click();
    };
  } else {
    if (currentChannel == undefined && message.sender != info.id) {
      const messageUser = li.querySelector<HTMLDivElement>(".message-user")!;
      messageUser.classList.add("hover:*:underline");
      messageUser.onclick = () => {
        for (let child of document.querySelector<HTMLDivElement>("#chat-users")!.children) {
          if (parseInt((child as HTMLButtonElement).dataset.id!) == sender.id) {
            (child as HTMLButtonElement).click();
            break;
          }
        }
      };
    }

    content.innerText = message.content;
  }

  ul.prepend(li);
}

function createSystemMessage(message: Message & { type: "invite" | "announce" }, sender?: number) {
  const ul = document.querySelector<HTMLUListElement>("#chat-messages")!;

  const li = document.createElement("li");
  li.innerHTML = `
    <div class="flex border border-amber-500 bg-amber-500/30 rounded-xl px-5 py-1 items-center">
      <i class="fa-solid fa-circle-info text-amber-500 mr-5"></i>
        <p class="flex-1 ml-1">
          <span class="message-user font-bold"></span>
          <span class="message-content"></span>
        </p>
      <button class="bg-amber-500 hover:bg-amber-700 px-3 py-1 rounded-md cursor-pointer">Join</button>
    </div>
  `;

  if (message.type == "invite") {
    li.querySelector<HTMLSpanElement>(".message-user")!.innerText = info.online.find(u => u.id == sender)!.name;
    li.querySelector<HTMLSpanElement>(".message-content")!.innerText = `send you a request to join the tournament '${message.name}'!`;
  } else
    li.querySelector<HTMLSpanElement>(".message-content")!.innerText = `The tournament '${message.name}' has just been created. Come play with others!`;

  li.querySelector("button")!.onclick = async () => {
    if (currentPage === startPage || currentPage === pongPage) {
      alert("You are already participating in a game or tournament. Please leave the group before joining another.");
      return;
    }

    const response = await sendAndWait({
      event: "join_game",
      uid: message.id!
    });
    if (response.success)
      loadPage(startPage);
    else
      alert("This game no longer exists.");
  }
  ul.prepend(li);
}

export function resetChat() {
  messages = {
    general: [] as Message[],
    generalAllRead: true,
    users: {} as {
      [key: number]: {
        messages: Message[],
        allRead: boolean
      }
    }
  };
  info = { event: "init_chat", id: 0, friends: [], blocked: [], online: [] };
}

export function changeChatTournamentState(state: boolean) {
  document.querySelector<HTMLButtonElement>("#chat-invite")!.disabled = !state;
}
