import { loadPage, type Page } from "./Page.ts";
import { loginPage } from "./loginPage.ts";
import { ws } from "../websocket.ts";
import type { Message, ServerEvent } from "@ft_transcendence/core";
import { send, sendAndWait } from "../Event.ts";

// TODO: filter users
// TODO: dm actions
// TODO: system messages

let wsListener: ((event: MessageEvent) => void) | undefined;
let currentChannel: number | undefined = undefined;
let currentChannelButton: HTMLButtonElement | undefined;
let messages: {
  general: Message[],
  generalAllRead: boolean,
  users: {
    [key: number]: {
      messages: Message[],
      allRead: boolean
    }
  }
} | undefined;
let info: (ServerEvent & { event: "init_chat" }) | undefined;

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
        <div id="dm-actions" class="flex *:flex-1 *:py-1 *:rounded-xl *:cursor-pointer" style="display: none">
          <button class="bg-blue-500 hover:bg-blue-700">Add friend</button>
          <button class="bg-red-500 hover:bg-red-700">Block</button>
          <button class="bg-amber-500 hover:bg-amber-700">Invite to tournament</button>
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
    const users = document.querySelector<HTMLDivElement>("#users")!;
    const form = document.querySelector("form")!;
    const formMessage = form.querySelector("input")!;
    const dmActions = document.querySelector<HTMLDivElement>("#dm-actions")!;

    currentChannel = undefined;
    currentChannelButton = general;
    messages = {
      general: [],
      generalAllRead: true,
      users: {}
    };

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
          getButton(users, data.from)!.querySelector("div")!.style.display = "";
        }
      } else if (data.event == "enter_chat") {
        info!.online.push({ ...data });
        messages!.users[data.id] = {
          messages: [],
          allRead: true
        };
        if (data.id != info!.id)
          createUser(users, data, info!.friends.some(f => f == data.id));
      } else if (data.event == "leave_chat") {
        info!.online.splice(info!.online.findIndex(o => o.id == data.id), 1);
        getButton(users, data.id)?.remove();
      }
    });

    for (let user of info.online) {
      messages.users[user.id] = {
        messages: [],
        allRead: true
      };
      if (user.id != info.id)
        createUser(users, user, info.friends.some(f => f == user.id));
    }
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

function createUser(users: HTMLDivElement, user: { id: number, avatar?: number[], name: string }, friend: boolean) {
  const button = document.createElement("button");
  button.className = "flex items-center";
  button.dataset.id = user.id.toString();

  button.innerHTML = `
    <div class="h-[10px] w-[10px] rounded-full bg-blue-500 mr-1" style="display: none"></div>
    <img src="/avatar.webp" alt="avatar" class="rounded-full h-[25px] w-[25px] bg-gray-950 border border-white">
    <span class="mx-1"></span>
    ${friend ? "<i class='fa-solid fa-star text-yellow-500'></i>" : ""}
  `;

  if (user.avatar != undefined)
    button.querySelector("img")!.src = URL.createObjectURL(new Blob([new Uint8Array(user.avatar)]));
  button.querySelector("span")!.innerText = user.name;

  button.onclick = () => channelChange(button, user.id);

  users.appendChild(button);
}

function channelChange(button: HTMLButtonElement, id?: number) {
  currentChannelButton?.classList.remove("border-b-2", "border-white");

  button.classList.add("border-b-2", "border-white");
  button.querySelector("div")!.style.display = "none";
  currentChannel = id;
  currentChannelButton = button;

  const messagesList = document.querySelector<HTMLUListElement>("#messages")!;

  messagesList.innerHTML = "";
  if (messages == undefined)
    return;
  console.log(messages);
  (id == undefined ? messages.general : messages.users[id].messages).forEach(m => {
    if (m.type == "message")
      createMessage(m);
  });
}

function createMessage(message: Message & { type: "message" }) {
  const ul = document.querySelector<HTMLUListElement>("#messages")!;

  const li = document.createElement("li");
  li.innerHTML = `
    <div class="flex gap-1 h-full w-full">
      <img src="/avatar.webp" alt="avatar" class="rounded-full h-[25px] w-[25px] bg-gray-950 border border-white mr-1">
      <span class="font-bold"></span>
      <div class="border border-white h-full mx-3"></div>
      <p></p>
    </div>
  `;

  const sender = info!.online.find(o => o.id == message.sender)!;
  if (sender.avatar != undefined)
    li.querySelector("img")!.src = URL.createObjectURL(new Blob([new Uint8Array(sender.avatar)]));
  li.querySelector("span")!.innerText = sender.name;
  li.querySelector("p")!.innerText = message.content;

  ul.prepend(li);
}

function getButton(users: HTMLDivElement, id: number | undefined) {
  if (id == undefined)
    return document.querySelector<HTMLButtonElement>("#general")!;

  for (let child of users.children) {
    if (id == parseInt((child as HTMLButtonElement).dataset.id!)) {
      return child as HTMLButtonElement;
    }
  }
}