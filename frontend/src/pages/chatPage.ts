import { loadPage, type Page } from "./Page.ts";
import { loginPage } from "./loginPage.ts";
import { ws } from "../websocket.ts";
import type { Message, ServerEvent } from "@ft_transcendence/core";
import { send, sendAndWait } from "../Event.ts";

// TODO: system messages

let wsListener: ((event: MessageEvent) => void) | undefined;

let currentChannel: number | undefined = undefined;
let currentChannelButton: HTMLButtonElement | undefined;

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
      <div class="h-full flex flex-col overflow-hidden">
        <div class="flex border-b border-gray-300 overflow-hidden gap-2 px-2">
          <button id="general" class="px-2 py-1 hover:bg-gray-500 cursor-pointer flex items-center">
            <div class="h-[10px] w-[10px] rounded-full bg-blue-500 mr-1" style="display: none"></div>
            <span>General</span>
          </button>
          <div class="h-full border border-white"></div>
          <div id="users" class="flex-1 flex overflow-auto *:px-2 *:py-1 *:hover:bg-gray-500 *:cursor-pointer"></div>
        </div>
        <ul id="messages" class="flex-1 overflow-y-auto overflow-x-hidden p-2 flex flex-col-reverse bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 gap-2"></ul>  
        <form class="flex *:p-2 items-center">
          <input type="text" required autocomplete="off" placeholder="Type your message here..." class="flex-1">
          <button class="cursor-pointer">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
        <div id="dm-actions" class="flex *:flex-1 *:py-1 *:rounded-lg *:cursor-pointer" style="display: none">
          <button id="add-friend" class="bg-blue-500 hover:bg-blue-700"></button>
          <button id="block" class="bg-red-500 hover:bg-red-700">Block</button>
          <button id="invite" class="bg-amber-500 hover:bg-amber-700">Invite to tournament</button>
        </div>
      </div>
    `;
  },

  async onMount() {
    if (ws == undefined) {
      loadPage(loginPage, undefined, "REPLACE");
      return;
    }

    const general = document.querySelector<HTMLButtonElement>("#general")!;
    const form = document.querySelector("form")!;
    const formMessage = form.querySelector("input")!;
    const addFriend = document.querySelector<HTMLButtonElement>("#add-friend")!;
    const block = document.querySelector<HTMLButtonElement>("#block")!;
    const invite = document.querySelector<HTMLButtonElement>("#invite")!;

    currentChannel = undefined;
    currentChannelButton = general;

    general.classList.add("border-b-2", "border-white");
    general.onclick = () => channelChange(general);

    form.onsubmit = event => {
      event.preventDefault();
      send({
        event: "message", to: currentChannel,
        message: { type: "message", sender: 0, content: formMessage.value }
      });
      formMessage.value = "";
    };

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
      info!.blocked.push(currentChannel!);
      general.click();
    };

    invite.onclick = () => {
      // TODO: Must be implemented with splitted window, when a user can be in the chat and in a tournament at the same time.
    };

    info = await sendAndWait({ event: "init_chat" });

    ws.addEventListener("message", wsListener = event => {
      const data: ServerEvent = JSON.parse(event.data);

      if (data.event == "message") {
        if (data.from == undefined)
          messages!.general.push(data.message);
        else
          messages!.users[data.from].messages.push(data.message);
        if (data.from == currentChannel) {
          if (data.message.type == "message") {
            createMessage(data.message);
          }
        } else {
          if (data.from == undefined)
            messages!.generalAllRead = false;
          else
            messages!.users[data.from].allRead = false;
          updateUsers();
        }
      } else if (data.event == "enter_chat") {
        info!.online.push({ ...data });
        messages!.users[data.id] ??= {
          messages: [],
          allRead: true
        };
        updateUsers();
      } else if (data.event == "leave_chat") {
        info!.online.splice(info!.online.findIndex(o => o.id == data.id), 1);
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
  const users = document.querySelector<HTMLDivElement>("#users")!;

  const online = info!.online
    .filter(u => !info!.blocked.some(b => b == u.id))
    .filter(u => u.id != info!.id);

  online.sort((a, b) => {
    let result = 0;
    if (info!.friends.some(f => f == a.id))
      result -= 5;
    if (!messages!.users[a.id].allRead)
      result--;
    if (info!.friends.some(f => f == b.id))
      result += 5;
    if (!messages!.users[b.id].allRead)
      result++;
    return result;
  });

  currentChannelButton = undefined;
  users.innerHTML = "";
  for (let user of online)
    createUser(users, user);

  const general = document.querySelector<HTMLButtonElement>("#general")!;
  // createUser might set currentChannelButton, don't trust static analysis
  if (currentChannelButton == undefined)
    general.click();
  if (!messages!.generalAllRead)
    general.querySelector("div")!.style.display = "";
}

function createUser(users: HTMLDivElement, user: { id: number, avatar?: number[], name: string }) {
  const button = document.createElement("button");
  button.className = "flex items-center";
  button.dataset.id = user.id.toString();

  button.innerHTML = `
    <div class="h-[10px] w-[10px] rounded-full bg-blue-500 mr-1" style="display: none"></div>
    <img src="/avatar.webp" alt="avatar" class="rounded-full h-[25px] w-[25px] bg-gray-950 border border-white">
    <span class="mx-1"></span>
    <i class="fa-solid fa-star text-yellow-500" style="display: none"></i>
  `;

  if (!messages!.users[user.id].allRead)
    button.querySelector("div")!.style.display = "";
  if (user.avatar != undefined)
    button.querySelector("img")!.src = URL.createObjectURL(new Blob([ new Uint8Array(user.avatar) ]));
  button.querySelector("span")!.innerText = user.name;
  if (info!.friends.some(f => f == user.id))
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
    messages!.generalAllRead = true;
  else
    messages!.users[id].allRead = true;
  button.querySelector("div")!.style.display = "none";
  currentChannel = id;
  currentChannelButton = button;

  const messagesList = document.querySelector<HTMLUListElement>("#messages")!;

  messagesList.innerHTML = "";
  if (messages == undefined)
    return;
  (id == undefined ? messages.general : messages.users[id].messages).forEach(m => {
    if (m.type == "message")
      createMessage(m);
  });

  document.querySelector<HTMLDivElement>("#dm-actions")!
    .style.display = id == undefined ? "none" : "";
  if (id != undefined) {
    const addFriend = document.querySelector<HTMLButtonElement>("#add-friend")!;
    const isFriend = info!.friends.some(f => f == id);
    addFriend.innerText = isFriend ? "Remove friend" : "Add friend";
    button.dataset.isFriend = isFriend ? "1" : "0";
  }
}

function createMessage(message: Message & { type: "message" }) {
  const ul = document.querySelector<HTMLUListElement>("#messages")!;

  const li = document.createElement("li");
  li.innerHTML = `
    <div class="flex gap-1 h-full w-full">
      <img src="/avatar.webp" alt="avatar" class="rounded-full h-[25px] w-[25px] bg-gray-950 border border-white mr-1">
      <span class="font-bold"></span>
      <div class="border border-white h-full mx-3"></div>
      <p class="flex-1"></p>
      <button class="rounded-lg bg-gray-500 hover:bg-gray-600 cursor-pointer px-1" style="display: none">Unblock</button>
    </div>
  `;

  const sender = info!.online.find(o => o.id == message.sender)!;
  if (sender.avatar != undefined)
    li.querySelector("img")!.src = URL.createObjectURL(new Blob([ new Uint8Array(sender.avatar) ]));
  li.querySelector("span")!.innerText = sender.name;
  const content = li.querySelector("p")!;

  if (info!.blocked.some(b => b == message.sender)) {
    content.innerText = "Blocked user";
    content.classList.add("text-gray-500");

    const unblock = li.querySelector("button")!;
    unblock.style.display = "";
    unblock.onclick = () => {
      send({ event: "swap_block", user: message.sender, block: false });
      info!.blocked.splice(info!.blocked.indexOf(message.sender), 1);
      updateUsers();
      currentChannelButton!.click();
    };
  } else
    content.innerText = message.content;

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
