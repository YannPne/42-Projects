import { sendAndWait } from "../Event.ts";
import { connectWs, ws } from "../main.ts";
import { loginPage } from "./loginPage.ts";
import { loadPage, type Page } from "./Page.ts";
import { profilePage } from "./profilePage.ts";

export const registerPage: Page = {
  url: "/register",
  title: "Register",
  navbar: false,

  getPage(): string {
    return /* html */ `
      <div class="h-full flex flex-col items-center justify-center">
        <div class="bg-gray-700 flex flex-col items-center justify-center p-5 rounded-4xl">
          <h2 class="text-2xl font-bold">Register</h2>
          <form id="register" class="flex flex-col mt-5 mb-5 space-y-2">
            <label>
              <p>Username:</p>
              <input id="username" type="text" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <label>
              <p>Display name:</p>
              <input id="displayName" type="text" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <label>
              <p>Password:</p>
              <input id="password" type="password" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <label>
              <p>Email:</p>
              <input id="email" type="email" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <label>
              <p>Avatar:</p>
              <input id="avatar" type="file" accept="image/*" class="border rounded-lg cursor-pointer text-gray-400 bg-gray-700 border-gray-600" />
            </label>
            <div class="flex justify-center">
              <button class="rounded-2xl bg-gray-900 hover:bg-gray-950 p-2 mt-5 cursor-pointer">Register</button>
            </div>
          </form>
          <div>
            <span>Already register? </span>
            <a id="login" href="/login" class="underline">Login</a>
          </div>
        </div>
      </div>
    `;
  },

  onMount(requestedPage: Page) {
    if (ws != undefined) {
      loadPage(profilePage);
      return;
    }

    const username = document.querySelector<HTMLInputElement>("#username")!;
    const password = document.querySelector<HTMLInputElement>("#password")!;
    const email = document.querySelector<HTMLInputElement>("#email")!;
    const displayName = document.querySelector<HTMLInputElement>("#displayName")!;
    const avatar = document.querySelector<HTMLInputElement>("#avatar")!;
    const registerButton = document.querySelector<HTMLFormElement>("#register")!;
    const loginLink = document.querySelector<HTMLAnchorElement>("#login")!;

    loginLink.onclick = (event) => {
      event.preventDefault();
      loadPage(loginPage, requestedPage);
    };

    registerButton.onsubmit = async (event) => {
      event.preventDefault();

      if (avatar.files && avatar.files.length != 0 && !avatar.files[0].type.startsWith("image/")) {
        alert("Please select a valid image.");
        return;
      }

      if (!ws || ws.readyState !== WebSocket.OPEN) {
        await connectWs();
      }

      const message = await sendAndWait({
        event: "register",
        username: username.value,
        displayName: displayName.value,
        password: password.value,
        email: email.value,
      });

      if (message.success === false)
        return;

      const formData = new FormData();
      if (avatar.files && avatar.files?.length > 0)
        formData.append("avatar", avatar.files[0]);
      formData.append("username", username.value);
      await fetch("http://localhost:3000/upload/avatar", {
        method: "POST",
        body: formData
      });

      loadPage(requestedPage ?? profilePage);
    };
  },


  onUnmount() {
  }
};
