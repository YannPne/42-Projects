import { connectWs, ws } from "../main.ts";
import { loadPage, type Page } from "./Page.ts";
import { registerPage } from "./registerPage.ts";
import { profilePage } from "./profilePage.ts";

export const loginPage: Page = {
  url: "/login",
  title: "Login",
  navbar: false,

  getPage(): string {
    return `
      <div class="h-full flex flex-col items-center justify-center">
        <div class="bg-gray-700 flex flex-col items-center justify-center p-5 rounded-4xl">
		      <h2 class="text-2xl font-bold">Login</h2>
          <form id="login" class="flex flex-col mt-5 mb-5 space-y-2">
            <label>
              <p>Username: </p>
              <input id="username" type="text" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <label>
              <p>Password: </p>
              <input id="password" type="password" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <div class="flex justify-center">
              <button class="rounded-2xl bg-gray-900 hover:bg-gray-950 p-2 mt-5 cursor-pointer">Login</button>
            </div>
          </form>
          <div>
            <span>Not have an account? </span>
            <a id="register" href="/register" class="underline">Register</a>
          </div>
        </div>
      </div>
	`;
  },

  onMount(requestedPage?: Page) {
    if (ws != undefined) {
      loadPage(profilePage);
      return;
    }

    const username = document.querySelector<HTMLInputElement>("#username")!;
    const password = document.querySelector<HTMLInputElement>("#password")!;
    const loginButton = document.querySelector<HTMLFormElement>("#login")!;
    const registerLink = document.querySelector<HTMLAnchorElement>("#register")!;

    registerLink.onclick = (event) => {
      event.preventDefault();
      loadPage(registerPage, requestedPage);
    };

    loginButton.onsubmit = async (event) => {
      event.preventDefault();

      const loginResponse = await fetch("http://" + document.location.hostname + ":3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.value, password: password.value })
      });

      if (loginResponse.status == 401) {
        alert("Wrong username / password");
        return;
      } else if (loginResponse.status != 200) {
        console.error(loginResponse.body);
        return;
      }

      sessionStorage.setItem("token", await loginResponse.text());
      await connectWs();
      loadPage(requestedPage ?? profilePage);
    };
  },

  onUnmount() {
  }
};
