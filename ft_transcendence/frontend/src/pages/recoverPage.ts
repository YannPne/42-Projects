import { loadPage, type Page } from "./Page.ts";
import { ws } from "../websocket.ts";
import { profilePage } from "./profilePage.ts";
import { loginPage } from "./loginPage.ts";

export const recoverPage: Page = {
  url: "/recover",
  title: "Recover password",

  getPage() {
    return `
      <div class="h-full flex flex-col items-center justify-center">
        <div class="bg-gray-700 flex flex-col items-center justify-center p-5 rounded-4xl">
		      <h2 class="text-2xl font-bold">Recover password</h2>
          <form id="recover" class="flex flex-col mt-5 space-y-2">
            <label>
              <p>New password: </p>
              <input id="password" type="password" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <div class="flex justify-center">
              <button class="rounded-2xl bg-gray-900 hover:bg-gray-950 p-2 mt-5 cursor-pointer">Save</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  onMount() {
    if (ws != undefined) {
      loadPage(profilePage, undefined, "REPLACE");
      return;
    }

    const form = document.querySelector<HTMLFormElement>("#recover")!;
    const password = document.querySelector<HTMLInputElement>("#password")!;

    form.onsubmit = async (event) => {
      event.preventDefault();

      const key = new URLSearchParams(location.search).get("key");
      if (key == null) {
        alert("The URL appears to be invalid, please use the exact one provided by email.");
        return;
      }

      const response = await fetch(location.origin + "/api/recover/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, password: password.value })
      });

      if (response.status == 204) {
        alert("Password change successful");
        loadPage(loginPage);
      } else if (response.status == 401 || response.status == 400)
        alert(await response.text());
      else {
        console.error(response);
        alert("Unexpected response status");
      }
    };
  },

  onUnmount() {
  },

  toJSON() {
    return this.url;
  }
};