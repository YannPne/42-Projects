import { connectWs, ws } from "../websocket.ts";
import { loginPage } from "./loginPage.ts";
import { findPage, loadPage, type Page } from "./Page.ts";
import { privacyPage } from "./privacyPage.ts";
import { profilePage } from "./profilePage.ts";

export const registerPage: Page<Page<any> | string> = {
  url: "/register",
  title: "Register",

  getPage() {
    return /* html */ `
      <div class="h-full flex flex-col items-center justify-center">
        <div class="bg-gray-700 flex flex-col items-center justify-center p-5 rounded-4xl">
          <h2 class="text-2xl font-bold">Register</h2>
          <form id="register" enctype="multipart/form-data" class="flex flex-col mt-5 mb-5 space-y-2">
            <label>
              <p>Username:</p>
              <input name="username" type="text" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <label>
              <p>Display name:</p>
              <input name="displayName" type="text" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <label>
              <p>Password:</p>
              <input name="password" type="password" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <label>
              <p>Email:</p>
              <input name="email" type="email" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <label>
              <p>Avatar:</p>
              <input name="avatar" type="file" accept="image/*" class="border rounded-lg cursor-pointer text-gray-400 bg-gray-700 border-gray-600" />
            </label>
            <label class="flex items-center gap-2 text-sm mt-4">
              <input id="checkPrivacy" type="checkbox" required class="accent-gray-700">
              <span>
                I have read and agree to the
                <a id="linkPrivacy" href="/privacy" target="_blank" class="underline hover:text-white">Privacy Policy</a>.
              </span>
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

  onMount(requestedPage) {
    if (typeof requestedPage == "string")
      requestedPage = findPage(requestedPage);

    if (ws != undefined) {
      loadPage(requestedPage ?? profilePage, undefined, "REPLACE");
      return;
    }

    const registerForm = document.querySelector<HTMLFormElement>("#register")!;
    const loginLink = document.querySelector<HTMLAnchorElement>("#login")!;
    const privacyLink = document.querySelector<HTMLAnchorElement>("#linkPrivacy")!;

    privacyLink.onclick = event => {
      event.preventDefault();
      loadPage(privacyPage);
    }

    loginLink.onclick = event => {
      event.preventDefault();
      loadPage(loginPage, requestedPage);
    };

    registerForm.onsubmit = async (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);
      const response = await fetch(location.origin + "/api/register", {
        method: "POST",
        body: formData
      });


      if (response.status == 200) {
        sessionStorage.setItem("token", await response.text());
        await connectWs();
        loadPage(requestedPage ?? profilePage);
      } else if (response.status == 409)
        alert("Username / display name / email already exists");
      else
        alert(await response.text());
    };
  },

  onUnmount() {
  },

  toJSON() {
    return this.url;
  }
};
