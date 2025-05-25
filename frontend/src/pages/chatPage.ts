import { loadPage, type Page } from "./Page.ts";
import { awaitWs, ws } from "../main.ts";
import { loginPage } from "./loginPage.ts";
import { profilePage } from "./profilePage.ts"
import { sendAndWait, type Event } from "../Event.ts";
import { pongPage } from "./pongPage.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;


export const chatPage: Page = {
  url: "/chat",
  title: "Chat",
  navbar: true,

  getPage() {
    return `
    <div class="h-full flex flex-col justify-center items-center">

    <div class="bg-gray-700 w-[700px] h-[550px] flex flex-col">
      <div id="printMessage" class="flex-1 flex flex-col-reverse overflow-y-auto space-y-reverse space-y-1">
      
      </div>

      <form  id="messageForm" class="w-full flex justify-center p-2 bg-gray-900 border-t border-gray-600">
        <div class="w-[600px]">
          <input id="sendMessage" type="text" required placeholder="Type message here" class="w-[500px] flex-1 placeholder-gray-400 p-2 bg-gray-800 text-white border border-gray-600 rounded-l">
          <button type="submit" id="sendButton" class="p-2 bg-blue-900 hover:bg-blue-950 text-white rounded-r">Send</button>
        </div>
      </form>
    </div>

    </div>
    `;
  },

  async onMount() {
    if (ws === undefined) {
      loadPage(loginPage, chatPage);
      return;
    }

    await awaitWs();

    const form = document.querySelector<HTMLFormElement>("#messageForm")!;
    const input = document.querySelector<HTMLInputElement>("#sendMessage")!;
    const container = document.querySelector<HTMLElement>("#printMessage")!;

    wsListener = (event: MessageEvent) => {
      const data: Event = JSON.parse(event.data);

      if (data.event === "invite_player")
      {
        const inviteBox = document.createElement("div");
        inviteBox.className = 'text-white bg-yellow-700 p-2 rounded w-fit relative';

        const senderSpan = document.createElement('span');
        senderSpan.textContent = data.sender;
        senderSpan.className = 'font-bold text-yellow-300 cursor-pointer hover:underline';
        senderSpan.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleUserMenu(senderSpan, data.senderid, data.sender);
        });

        const inviteButton = document.createElement("button");
        inviteButton.textContent = `Accept game invite`;
        inviteButton.className = 'ml-2 px-2 py-1 bg-green-600 rounded hover:bg-green-700 text-white';
        inviteButton.addEventListener('click', () => {
          console.log(data);
          loadPage(pongPage, {
            event: "join_game",
            uid: data.gameID,
          });
          inviteBox.remove();
        });

        inviteBox.appendChild(senderSpan);
        inviteBox.appendChild(inviteButton);
        container?.prepend(inviteBox);
      }
      if (data.event === "broadcast_message") {
        let dm_html: [string, string, string];
        if (data.is_dm)
          dm_html = ["bg-pink-800", "text-purple-300", " whispered: "];
        else
          dm_html = ["bg-gray-600", "text-blue-300", ": "];
        if (data.is_dm == true && data.is_blocked == true)
          return;
          
        const newMessage = document.createElement('div');
        newMessage.className = 'text-white ' + dm_html[0] + ' p-2 rounded w-fit relative';
        
        const senderSpan = document.createElement('span');
        senderSpan.textContent = data.sender;
        senderSpan.className = 'font-bold ' + dm_html[1] + ' cursor-pointer hover:underline';
        senderSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUserMenu(senderSpan, data.senderid, data.sender);
        });
        
        newMessage.appendChild(senderSpan);
        newMessage.appendChild(document.createTextNode(dm_html[2] + data.content));
        container?.prepend(newMessage);
      } 
    }
    
    ws?.addEventListener("message", wsListener);

    form.addEventListener('submit', e => {
        e.preventDefault();
        parseMessage(input.value).then(dm => {
        const value = input.value.trim();
        if (!value) return;
        
        const MyMessage = document.createElement('div');
        if (dm.is_me || !dm.is_exist)
          dm.is_dm = false;
        if (dm.is_dm == false)
        {
          MyMessage.textContent = value;
          MyMessage.className = 'text-white bg-gray-600 p-2 rounded w-fit self-end text-right';
        }
        else if (dm.is_dm == true)
        {
          MyMessage.className = 'text-white bg-pink-800 p-2 rounded w-fit self-end text-right';
          const mySpan = document.createElement('span');
          mySpan.textContent = dm.name;
          mySpan.className = 'font-bold text-purple-300 cursor-pointer hover:underline'

          mySpan.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUserMenu(mySpan, dm.id, dm.name);
          });

          MyMessage.appendChild(document.createTextNode("whispering to "));
          MyMessage.appendChild(mySpan);
          MyMessage.appendChild(document.createTextNode(": " + dm.content));
        }
        container?.prepend(MyMessage);
        ws?.send(JSON.stringify({ event: "broadcast_message", content: value }));
        input.value = '';
      });
    });
  },

  onUnmount() {
    if (wsListener != undefined)
      ws?.removeEventListener("message", wsListener);
    wsListener = undefined;
  }
};

function toggleUserMenu(target: HTMLElement, userid: number, username: string) {
  document.querySelectorAll('.user-menu').forEach(menu => menu.remove());

  const menu = document.createElement('div');
  menu.className = 'user-menu absolute bg-gray-800 text-white border border-gray-600 rounded shadow-lg p-2 flex flex-col z-10';

  sendAndWait({ event: "getInfoDm", other_user: username}).then(blocked_message => {
    let block_unblock: string;

    if (blocked_message.blocked === true)
      block_unblock = "unblock";
    else
      block_unblock = "block";

    ['Invite', 'Block', 'Profile'].forEach(action => {
      const btn = document.createElement('button');
      if (action === 'Block' && blocked_message.blocked === true)
        btn.textContent = 'Unblock';
      else
        btn.textContent = action;
      btn.className = 'hover:bg-gray-700 px-2 py-1 text-left';
      btn.addEventListener('click', () => {

        if (action === 'Profile')
        {
          loadPage(profilePage, username);
          menu.remove();
        }

        if (action === 'Block')
        {
          sendAndWait({ event: "swap_blocked", id: userid}).then(message => {
            if (message.success === false)
              alert("Couldn't " + block_unblock + " the user " + username + ".");
          });
          menu.remove();
        }

        if (action === 'Invite')
        {
          btn.style.display = 'none';

          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = `Type the game name`;
          input.className = 'p-1 rounded text-gray-200 ml-1';
    
          const sendBtn = document.createElement('button');
          sendBtn.textContent = 'Create';
          sendBtn.className = 'ml-2 px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 text-white';
    
          btn.parentNode?.insertBefore(input, btn.nextSibling);
          btn.parentNode?.insertBefore(sendBtn, input.nextSibling);
    
          sendBtn.addEventListener('click', () => {
            const gameName = input.value.trim();
            const uid = crypto.randomUUID();

            loadPage(pongPage, {
              event: "join_game",
              uid: uid,
              name: gameName
            });

            ws?.send(JSON.stringify({ event: "invite_player", gameID: uid, userToInvite: username, gameName: gameName}));

            menu.remove();
          });
        }
      });
      menu.appendChild(btn);
    });
  });

  const rect = target.getBoundingClientRect();
  menu.style.left = `${rect.left}px`;
  menu.style.top = `${rect.top - 80}px`;

  document.body.appendChild(menu);

  const closeMenu = (e: MouseEvent) => {
    if (!menu.contains(e.target as Node)) {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }
  };
  setTimeout(() => {
    document.addEventListener('click', closeMenu);
  }, 0);
}

function parseMessage(message: string): Promise<{ name: string, content: string, is_dm: boolean, id: number, is_me: any, is_exist: any}>
{
  if (!message.startsWith('#')) {
    return Promise.resolve({ name: "", content: "", is_dm: false, id: 0, is_me: false, is_exist: true});
  }

  let i = 1;
  let tempname = "";

  while (i < message.length && message[i] !== ' ') {
    tempname += message[i];
    i++;
  }

  if (i >= message.length) {
    return Promise.resolve({ name: "", content: "", is_dm: false, id: 0, is_me: false, is_exist: true});
  }

  i++;
  let tempcontent = message.slice(i);

  return sendAndWait({ event: "getInfoDm", other_user: tempname })
    .then(info_message => ({
      name: tempname,
      content: tempcontent,
      is_dm: true,
      id: info_message.id,
      is_me: info_message.is_me,
      is_exist: info_message.is_exist
    }));
}