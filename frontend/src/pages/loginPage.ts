import { connectWs, ws } from "../websocket.ts";
import { findPage, loadPage, type Page } from "./Page.ts";
import { registerPage } from "./registerPage.ts";
import { profilePage } from "./profilePage.ts";

export const loginPage: Page<Page<any> | string> = {
  url: "/login",
  title: "Login",

  getPage() {
    return `
      <div class="h-full flex flex-col items-center justify-center">
        <div class="bg-gray-700 flex flex-col items-center justify-center p-5 rounded-4xl">
		      <h2 class="text-2xl font-bold">Login</h2>
          <form id="login" class="flex flex-col mt-5 mb-5 space-y-2">
            <label>
              <p>Username: </p>
              <input name="username" type="text" required class="p-1 bg-gray-600 rounded-lg w-full" />
            </label>
            <label>
              <p>Password: </p>
              <input name="password" type="password" required class="p-1 bg-gray-600 rounded-lg w-full" />
              <p class="text-right text-gray-400">
               Forget password? 
               <button id="recover" type="button" class="cursor-pointer underline">Recover it</button>
              </p>
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

  onMount(requestedPage) {
    if (typeof requestedPage == "string")
      requestedPage = findPage(requestedPage);

    if (ws != undefined) {
      loadPage(requestedPage ?? profilePage, undefined, "REPLACE");
      return;
    }

    const loginForm = document.querySelector<HTMLFormElement>("#login")!;
    const registerLink = document.querySelector<HTMLAnchorElement>("#register")!;
    const recover = document.querySelector<HTMLButtonElement>("#recover")!;

    registerLink.onclick = (event) => {
      event.preventDefault();
      loadPage(registerPage, requestedPage);
    };

    recover.onclick = () => {
      const response = prompt("Please insert your email");
      if (response == null)
        return;

      fetch("https://" + document.location.host + "/api/recover", {
        method: "POST",
        body: response
      }).then();

      alert(`If the email '${response}' is linked to a user, an email will be sent to them`);
    };

    loginForm.onsubmit = async (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);

      const require2fa = await fetch("https://" + document.location.host + "/api/require_2fa", {
        method: "POST",
        body: formData.get("username") as string
      });

      if (await require2fa.json()) {
        const code2fa = prompt("Please enter your 2FA code");
        if (code2fa == null)
          return;
        formData.append("2fa", code2fa);
      }

      const loginResponse = await fetch("https://" + document.location.host + "/api/login", {
        method: "POST",
        body: formData
      });

      if (loginResponse.status == 401) {
        alert("Wrong username / password");
        return;
      } else if (loginResponse.status == 403) {
        alert("Invalid 2FA code");
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
  },

  toJSON() {
    return this.url;
  }
};
