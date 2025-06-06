import { loadPage, type Page } from "./Page.ts";
import { loginPage } from "./loginPage.ts";
import { send, sendAndWait } from "../Event.ts";
import { pongPage } from "./pongPage.ts";
import type { ServerEvent } from "@ft_transcendence/core";
import { profilePage } from "./profilePage.ts";
import { ws } from "../websocket.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;

export const chatPage: Page = {
  url: "/chat",
  title: "Chat",

  getPage() {
    return `
      <div class="h-full flex flex-col justify-center items-center">
        <div class="bg-gray-700 w-[80%] h-[80%] flex flex-col">
          <div id="printMessage" class="flex-1 flex flex-col-reverse overflow-y-auto space-y-reverse space-y-1">
          </div>

          <form id="messageForm" class="w-full flex justify-center p-2 bg-gray-900 border-t border-gray-600">
            <div class="w-[600px]">
              <input id="sendMessage" type="text" required placeholder="Type message here" class="w-[500px] flex-1 placeholder-gray-400 p-2 bg-gray-800 text-white border border-gray-600 rounded-l">
              <button id="sendButton" class="p-2 bg-blue-900 hover:bg-blue-950 text-white rounded-r">Send</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  async onMount() {
    if (ws === undefined) {
      loadPage(loginPage, chatPage, "REPLACE");
      return;
    }

    const form = document.querySelector<HTMLFormElement>("#messageForm")!;
    const input = document.querySelector<HTMLInputElement>("#sendMessage")!;
    const container = document.querySelector<HTMLDivElement>("#printMessage")!;

    ws.addEventListener("message", wsListener = (event: MessageEvent) => {
      const data: ServerEvent = JSON.parse(event.data);

      const box = document.createElement("div");
      let senderSpan: HTMLSpanElement | undefined;

      if (data.event == "invite_player" || data.event == "broadcast_message" && data.senderId != 0) {
        senderSpan = document.createElement("span");
        senderSpan.textContent = data.sender;
        senderSpan.onclick = event => {
          event.stopPropagation();
          toggleUserMenu(senderSpan!, data.senderId, data.sender);
        };

        box.appendChild(senderSpan);
      }

      if (data.event === "invite_player") {
        box.className = "text-white bg-yellow-700 p-2 rounded w-fit relative";
        senderSpan!.className = "font-bold text-yellow-300 cursor-pointer hover:underline";

        const inviteButton = document.createElement("button");
        inviteButton.textContent = "Accept game invite";
        inviteButton.className = "ml-2 px-2 py-1 bg-green-600 rounded hover:bg-green-700 text-white";
        inviteButton.onclick = () => {
          loadPage(pongPage, {
            event: "join_game",
            uid: data.gameId,
          });
          box.remove();
        };

        box.appendChild(inviteButton);
        container.prepend(box);
      } else if (data.event === "broadcast_message") {
        let dmHtml: [ string, string, string ];
        if (data.isDm && data.isBlocked)
          return;
        if (data.senderId == 0)
          dmHtml = [ "bg-yellow-600", "text-orange-300", "Announcer: " ];
        else if (data.isDm)
          dmHtml = [ "bg-pink-800", "text-purple-300", " whispered: " ];
        else
          dmHtml = [ "bg-gray-600", "text-blue-300", ": " ];

        box.className = "text-white " + dmHtml[0] + " p-2 rounded w-fit relative";
        if (data.senderId != 0)
          senderSpan!.className = "font-bold " + dmHtml[1] + " cursor-pointer hover:underline";
        box.appendChild(document.createTextNode(dmHtml[2] + data.content));
        container.prepend(box);
      }
    });

    form.onsubmit = event => {
      event.preventDefault();
      parseMessage(input.value).then(dm => {
        const value = input.value.trim();
        if (!value) return;

        const myMessage = document.createElement("div");
        if (dm.isMe || !dm.exists)
          dm.isDm = false;
        if (!dm.isDm) {
          myMessage.textContent = value;
          myMessage.className = "text-white bg-gray-600 p-2 rounded w-fit self-end text-right";
        } else if (dm.isDm) {
          myMessage.className = "text-white bg-pink-800 p-2 rounded w-fit self-end text-right";
          const mySpan = document.createElement("span");
          mySpan.textContent = dm.name;
          mySpan.className = "font-bold text-purple-300 cursor-pointer hover:underline";

          mySpan.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleUserMenu(mySpan, dm.id, dm.name);
          });

          myMessage.appendChild(document.createTextNode("whispering to "));
          myMessage.appendChild(mySpan);
          myMessage.appendChild(document.createTextNode(": " + dm.content));
        }
        container?.prepend(myMessage);
        send({ event: "broadcast_message", content: value });
        input.value = "";
      });
    };
  },

  onUnmount() {
    if (wsListener != undefined)
      ws?.removeEventListener("message", wsListener);
    wsListener = undefined;
  },

  toJSON() {
    return this.url;
  }
};

function toggleUserMenu(target: HTMLElement, userId: number, username: string) {
  document.querySelectorAll(".user-menu").forEach(menu => menu.remove());

  const menu = document.createElement("div");
  menu.className = "user-menu absolute bg-gray-800 text-white border border-gray-600 rounded shadow-lg p-2 flex flex-col z-10";

  sendAndWait({ event: "get_dm_info", otherUser: username }).then(blockedMessage => {
    const blockState = blockedMessage.isBlocked ? "unblock" : "block";

    for (const action of [ "Invite", "Block", "Profile" ]) {
      const btn = document.createElement("button");
      if (action === "Block" && blockedMessage.isBlocked!)
        btn.textContent = "Unblock";
      else
        btn.textContent = action;
      btn.className = "hover:bg-gray-700 px-2 py-1 text-left";
      btn.onclick = () => {
        if (action === "Profile") {
          loadPage(profilePage, userId);
          menu.remove();
        }

        if (action === "Block") {
          sendAndWait({ event: "swap_blocked", id: userId }).then(message => {
            if (!message.success)
              alert("Couldn't " + blockState + " the user " + username + ".");
          });
          menu.remove();
        }

        if (action === "Invite") {
          btn.style.display = "none";

          const input = document.createElement("input");
          input.type = "text";
          input.placeholder = "Type the game name";
          input.className = "p-1 rounded text-gray-200 ml-1";

          const sendBtn = document.createElement("button");
          sendBtn.textContent = "Create";
          sendBtn.className = "ml-2 px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 text-white";

          btn.parentNode?.insertBefore(input, btn.nextSibling);
          btn.parentNode?.insertBefore(sendBtn, input.nextSibling);

          sendBtn.onclick = () => {
            const gameName = input.value.trim();
            const uid = crypto.randomUUID();

            loadPage(pongPage, {
              event: "join_game",
              uid: uid,
              name: gameName
            });

            send({
              event: "invite_player",
              gameId: uid,
              userToInvite: username,
              gameName: gameName
            });

            menu.remove();
          };
        }
      };
      menu.appendChild(btn);
    }
  });

  const rect = target.getBoundingClientRect();
  menu.style.left = `${rect.left}px`;
  menu.style.top = `${rect.top - 80}px`;

  document.body.appendChild(menu);

  const closeMenu = (event: MouseEvent) => {
    if (!menu.contains(event.target as Node)) {
      menu.remove();
      document.removeEventListener("click", closeMenu);
    }
  };
  document.addEventListener("click", closeMenu);
}

async function parseMessage(message: string) {
  if (!message.startsWith("#")) {
    return { name: "", content: "", isDm: false, id: 0, isMe: false, exists: true };
  }

  let i = 1;
  let tempName = "";

  while (i < message.length && message[i] !== " ") {
    tempName += message[i];
    i++;
  }

  if (i >= message.length)
    return { name: "", content: "", isDm: false, id: 0, isMe: false, exists: true };

  i++;
  let tempContent = message.slice(i);

  return await sendAndWait({ event: "get_dm_info", otherUser: tempName }).then(message => ({
    name: tempName,
    content: tempContent,
    isDm: true,
    id: message.id,
    isMe: message.isMe,
    exists: message.exists
  }));
}