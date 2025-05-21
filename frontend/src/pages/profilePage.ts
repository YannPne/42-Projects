import { loadPage, type Page } from "./Page.ts";
import { awaitWs, closeWs, ws } from "../main.ts";
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
      
      <p id="username" class="text-5xl pb-1 font-bold"></p>
      <p id="email" class="text-2xl font-bold pb-4"></p>
      <i id="btn_hide" class="fas fa-eye pb-2 cursor-pointer"></i>
      <p id="status" class="text-xl pb-5 font-bold">online</p>

      <div class="flex justify-between space-x-8 w-full max-w-7xl px-4 mt-6">

        <div id="div_history" class="bg-gray-700 space-y-1 p-4 w-1/3 min-h-[200px] rounded-xl">
          <ul id="match-history" class="pl-3">
            <li class="text-3xl pb-5">Match History:</li>
          </ul>
        </div>
      
        <div class="flex flex-col space-y-40">
          <div class="bg-gray-700 p-6 rounded-xl text-white flex flex-col items-center">
            <p class="text-3xl pb-2">Winrate:</p>
            <p id="winrate" class="text-4xl font-bold pb-4">50%</p>
          </div>

          <div id="manage" class="bg-gray-700 p-6 rounded-xl text-white flex flex-col items-center mt-4 space-y-3">
            <p class="text-3xl pb-2">Manage:</p>
            <button class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-40">2FA</button>
            <button class="bg-white hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-200 w-40">Google</button>
            <button id="edit-profile-btn" class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded w-40">Edit profile</button>
            <button id="delete" class="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-40">Delete Account</button>
          </div>
      </div>

      <div id="div_friend" class="bg-gray-700 p-4 w-1/3 min-h-[200px] rounded-xl flex flex-col justify-between">
        <ul id="friends-list" class="pl-3 space-y-1 overflow-y-auto">
          <li class="text-3xl pb-5">Friend List:</li>
        </ul>

        <form id="add_friend" class="flex items-center space-x-2 mt-5 w-full">
          <input id="username_to_add" placeholder="username" type="text" required class="p-1 bg-gray-600 rounded-lg flex-1" />
          <button class="rounded-2xl bg-green-600 hover:bg-green-600 p-2 cursor-pointer">ADD</button>
        </form>
      </div>

      <div id="edit-profile-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div class="bg-gray-800 rounded-lg p-6 w-96">
          <h2 class="text-white text-xl mb-4">Modifier mes infos</h2>
          <form id="edit-profile-form" class="flex flex-col space-y-4">
            <input type="text" id="edit_username" name="displayName" placeholder="Username" class="p-2 rounded bg-gray-700 text-white" required />
            <input type="text" id="edit_displayName" name="displayName" placeholder="Pseudo" class="p-2 rounded bg-gray-700 text-white" required />
            <input type="email" id="edit_email" name="email" placeholder="Email" class="p-2 rounded bg-gray-700 text-white" required />
            <input type="password" id="edit_password" name="password" placeholder="password" class="p-2 rounded bg-gray-700 text-white" />
            <input type="file" id="edit_avatar" accept="image/*" class="border rounded-lg cursor-pointer text-gray-400 bg-gray-700 border-gray-600" />
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-btn" class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">Annuler</button>
              <button type="submit" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Sauvegarder</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
    `;
  },


  async onMount(requestedPage: any) {
    if (ws == undefined) {
      loadPage(loginPage, profilePage);
      return;
    }

    await awaitWs();

    let currentProfile: string = requestedPage ? requestedPage : "";

    // BUTTON HIDE
    const btn_hide = document.querySelector<HTMLElement>("#btn_hide")!;
    const div_history = document.querySelector<HTMLDivElement>("#div_history")!;
    const div_friend = document.querySelector<HTMLDivElement>("#div_friend")!;
    const email = document.querySelector<HTMLParagraphElement>("#email")!;
    const toggleElements = [div_history, div_friend, email];

    let visible: boolean;

    function setBtnEye(visible: boolean)
    {
      btn_hide.classList.toggle("fa-eye", visible);
      btn_hide.classList.toggle("fa-eye-slash", !visible);

      toggleElements.forEach(el => {
        el.classList.toggle("text-white", visible);
        el.classList.toggle("text-gray-400", !visible);
      });
    }
    
    btn_hide.addEventListener("click", () => {
      visible = !visible;
      ws!.send(JSON.stringify({event: "set_hide_profile", hide: visible}));
      setBtnEye(visible);
    });
    
    // EDIT PROFILE
    const editBtn = document.querySelector('#edit-profile-btn')!;
    const modal = document.querySelector('#edit-profile-modal')!;
    const cancelBtn = document.querySelector('#cancel-btn')!;
    const statusElement = document.querySelector<HTMLParagraphElement>('#status')!;
    const form = document.querySelector<HTMLFormElement>('#edit-profile-form');

    editBtn.addEventListener('click', async () => {
      modal.classList.remove('hidden');
      const data = await sendAndWait({event: "get_info_profile"});
      document.querySelector<HTMLInputElement>('#edit_username')!.value = data.name!;
      document.querySelector<HTMLInputElement>('#edit_displayName')!.value = data.displayName!;
      document.querySelector<HTMLInputElement>('#edit_email')!.value = data.email!;
    });

    cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    loadPage(profilePage);
    });

    form!.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userName = document.querySelector<HTMLInputElement>("#edit_username")!;
      const displayName = document.querySelector<HTMLInputElement>("#edit_displayName")!;
      const email = document.querySelector<HTMLInputElement>("#edit_email")!;
      const avatar = document.querySelector<HTMLInputElement>("#edit_avatar")!;
      const password = document.querySelector<HTMLInputElement>("#edit_password")!;

      if (avatar.files && avatar.files.length != 0 && !avatar.files[0].type.startsWith("image/")) {
        alert("Please select a valid image.");
        return;
      }

      const message = await sendAndWait({
        event: "update_info",
        username: userName.value,
        displayName: displayName.value,
        password: password.value,
        email: email.value,
      });

      if (!message.success)
        alert("Username or display name already exist");

      const formData = new FormData();
      if (avatar.files && avatar.files?.length > 0)
        formData.append("avatar", avatar.files[0]);
      formData.append("username", userName.value);
      await fetch("http://localhost:3000/upload/avatar", {
        method: "POST",
        body: formData
    });

    modal.classList.add('hidden');
    loadPage(profilePage);
    });

    // DELETE ACCOUNT
    document.querySelector<HTMLButtonElement>("#delete")!.onclick = async () => {
      const confirmDelete = confirm("Are you sure you want to delete your account?");
      
      if (!confirmDelete)
        return;

      sendAndWait({ event: "del_account" }).then(message => {
        if (message.success) {
          closeWs();
          loadPage(loginPage, profilePage);
        }
        else
          alert("An error occurred.")
      });
    };

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
        else
          alert("The user does not exist.")
      });
    };

    // REMOVE FRIEND
    document.querySelector<HTMLButtonElement>("#friends-list")!.onclick = async (event) => {
      const target = event.target as HTMLElement;

      if (target.tagName === "BUTTON" && target.dataset.friend) {
        const friendName = target.dataset.friend;

        const message = await sendAndWait({ event: "remove_friend", name: friendName });

        if (message.success) 
        {
          const li = target.closest("li");
          li?.remove();
        }
        else
          alert("An error occurred.")
      }
    };

    
    // GET INFO PROFILE
    sendAndWait({event: "get_info_profile"}).then( async (message: any) => {

      if (currentProfile == "")
        currentProfile = message.name;
      
      // username
      document.querySelector("#username")!.innerHTML = message.displayName + " Profile";

      // email
      document.querySelector("#email")!.innerHTML = message.email;

      // hide profile
      visible = message.hideProfile != null ? message.hideProfile : true;
      setBtnEye(visible);

      // status
      if (message.status)
      {
          statusElement.textContent = "online";
          statusElement.classList.remove("text-gray-500");
          statusElement.classList.add("text-green-500");
      }
      else
      {
        statusElement.textContent = "offline";
        statusElement.classList.remove("text-green-500");
        statusElement.classList.add("text-gray-500");
      }

      // friend list
      const friendsList = document.querySelector<HTMLAnchorElement>("#friends-list")!;
      const friendsCount = message.friends?.length;

      if (friendsCount === 0) 
      {
        const li = document.createElement("li");
        li.textContent = "No friend yet :'(";
        friendsList?.appendChild(li);
      } 
      else 
      {
        const status = await sendAndWait({event: "get_status", friends: message.friends});

        for (let i = 0; i < friendsCount; i++) 
        {
          const friend = message.friends[i];
          const li = document.createElement("li");

          let status_display = status.status![i] ? "bg-green-500" : "bg-gray-500";
          li.id = `friend-${i}`;
          li.className = "flex items-center gap-2";

          li.innerHTML = `
            <div class="w-full flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2.5 h-2.5 ${status_display} rounded-full mr-2 shadow-md"></span>
                <a href="#" class="friend-link hover:underline" data-friend="${friend}">${friend}</a>
              </div>
              <button id="btn_remove" class="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800" data-friend="${friend}">
                Remove
              </button>
            </div>
          `;
          friendsList?.appendChild(li);friendsList?.appendChild(li);

          const friendLink = li.querySelector<HTMLAnchorElement>(".friend-link");
          friendLink?.addEventListener("click", async (e) => {
            e.preventDefault();
            const friendName = friendLink.dataset.friend!;
          
            await ws!.send(JSON.stringify({ event: "set_profile", name: friendName }));

            loadPage(profilePage, currentProfile);

          });
          
        }
      } 

      // avatar
      const imageElement = document.querySelector<HTMLImageElement>("#image")!;

      if (!message.avatar)
        imageElement.src = 'avatar.webp';
      else 
      {
        const mimeType = message.avatar.type || 'image/jpeg';
        const byteArray = new Uint8Array(message.avatar.data);
        const imageBlob = new Blob([byteArray], { type: mimeType });
        const imageUrl = URL.createObjectURL(imageBlob);
        imageElement.src = imageUrl;
      }

      hideprofile(message.name == currentProfile, message.hideProfile);
    });

    // GAME HISTORY
    sendAndWait({event: "get_games_history"}).then( (message: any) => {
      const historyList = document.querySelector("#match-history")
      const matchCount = message.name1?.length;

      if (matchCount === 0) {
        const li = document.createElement("li");
        li.textContent = "No matches played yet.";
        historyList?.appendChild(li);
        document.querySelector("#winrate")!.innerHTML = "- %";
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
        document.querySelector("#winrate")!.innerHTML = ~~(winrate / matchCount * 100) + "%";
      }      
    });

    function hideprofile(hideProfile: boolean, hideData: boolean)
    {
      if (!hideProfile)
      {
        btn_hide.style.visibility = "hidden";
        document.querySelector("#manage")!.classList.add("hidden");
        document.querySelector("#add_friend")!.classList.add("hidden");
        const btnRemove = document.querySelector("#btn_remove");
        btnRemove && btnRemove.classList.add("hidden");

        toggleElements.forEach(el => {
          el.classList.toggle("text-white", true);
        });
      }
      else
      {
        btn_hide.style.visibility = "visible";
        document.querySelector("#manage")!.classList.remove("hidden");
        document.querySelector("#add_friend")!.classList.remove("hidden");
        const btnRemove = document.querySelector("#btn_remove");
        btnRemove && btnRemove.classList.remove("hidden");
      }

      if (!hideData && !hideProfile)
      {
        Array.from(div_history.children).forEach(child => {
          (child as HTMLElement).style.visibility = "hidden";
        });
        Array.from(div_friend.children).forEach(child => {
          (child as HTMLElement).style.visibility = "hidden";
        });
        email.style.visibility = "hidden";
      }
      else
      {
        Array.from(div_history.children).forEach(child => {
          (child as HTMLElement).style.visibility = "visible";
        });
        Array.from(div_friend.children).forEach(child => {
          (child as HTMLElement).style.visibility = "visible";
        });
        email.style.visibility = "visible";
      }
    }
  },

  onUnmount() {
    
  }
};
