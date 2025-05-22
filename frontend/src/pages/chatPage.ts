import { loadPage, type Page } from "./Page.ts";
import { awaitWs, closeWs, ws } from "../main.ts";
import { loginPage } from "./loginPage.ts";
import { profilePage } from "./profilePage.ts"
import { sendAndWait } from "../Event.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;


export const chatPage: Page = {
  url: "/Chat",
  title: "Chat",
  navbar: true,

  getPage(): string {
    return `
    <div class="h-full flex flex-col justify-center items-center">
      <div id="printMessage" class="bg-gray-700 flex flex-col-reverse overflow-y-auto space-y-reverse space-y-1 w-[700px] h-[500px]">
      
      </div>

      <form  id="messageForm" class="mt-5 bg-gray-900">
        <input id="sendMessage" type="text" required placeholder="Type message here" class="w-[650px] placeholder-gray-400">
        <button type="submit" id="sendButton" class="p-2 bg-blue-900 hover:bg-blue-950">Send</button>
      </form>

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
      const data = JSON.parse(event.data);
      if (data.event === "broadcast_message") {
        if (data.is_dm == false)
        {
          const newMessage = document.createElement('div');
          newMessage.className = 'text-white bg-gray-600 p-2 rounded w-fit relative';
        
          const senderSpan = document.createElement('span');
          senderSpan.textContent = data.sender;
          senderSpan.className = 'font-bold text-blue-300 cursor-pointer hover:underline';
          senderSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUserMenu(senderSpan, data.senderid, data.sender);
          });
        
          newMessage.appendChild(senderSpan);
          newMessage.appendChild(document.createTextNode(": " + data.content));
          container?.prepend(newMessage);
        }
        else if (data.is_dm == true)
        {
          if (data.is_blocked == false)
          {
            const newMessage = document.createElement('div');
            newMessage.className = 'text-white bg-pink-800 p-2 rounded w-fit relative';

            newMessage.appendChild(document.createTextNode(data.sender + " whispered: " + data.content));
            container?.prepend(newMessage);
          }
        }
      }
    };
    
    ws?.addEventListener("message", wsListener);

    form.addEventListener('submit', e => {
        e.preventDefault();
        const dm: any = parseMessage(input.value);
        const value = input.value.trim();

        if (!value) return;
        
        const MyMessage = document.createElement('div');

        if (dm.is_dm == false)
        {
          MyMessage.textContent = value;
          MyMessage.className = 'text-white bg-gray-600 p-2 rounded w-fit self-end text-right';
        }
        else if (dm.is_dm == true)
        {
          MyMessage.textContent = "whispering to " + dm.name + ": " + dm.content;
          MyMessage.className = 'text-white bg-pink-800 p-2 rounded w-fit self-end text-right';
        }
        container?.prepend(MyMessage);
        ws?.send(JSON.stringify({ event: "broadcast_message", content: value }));
        input.value = '';
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

  sendAndWait({ event: "check_is_blocked", blocked: username}).then(blocked_message => {
    console.log(blocked_message.result);

    let block_unblock: string;

    if (blocked_message.result === true)
      block_unblock = "unblock";
    else
      block_unblock = "block";

    ['Invite', 'Block', 'Profile'].forEach(action => {
      const btn = document.createElement('button');
      if (action === 'Block' && blocked_message.result === true)
        btn.textContent = 'Unblock';
      else
        btn.textContent = action;
      btn.className = 'hover:bg-gray-700 px-2 py-1 text-left';
      btn.addEventListener('click', () => {

        if (action === 'Profile')
          loadPage(profilePage);

        if (action === 'Block')
        {
          sendAndWait({ event: "swap_blocked", id: userid}).then(message => {
            if (message.success === false)
              alert("Couldn't " + block_unblock + " the user " + username + ".");
          });
        }

        menu.remove();
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

function parseMessage(message: string)
{
  if (!message.startsWith('#'))
    return {name: "", content: "", is_dm: false};

  let i = 1;
  let tempname = "";

  while (i < message.length && message[i] !== ' ')
  {
    tempname += message[i];
    i++;
  }

  if (i >= message.length)
    return {name: "", content: "", is_dm: false};

  i++;

  let tempcontent = message.slice(i);

  return {name: tempname, content :tempcontent, is_dm: true};
}