import {connectWs, ws} from "../main.ts";
import { loginPage } from "./loginPage.ts";
import {loadPage, type Page } from "./Page.ts";

export const registerPage: Page = {
  url: "/register",
  title: "register",

  getPage(): string {
    return `
    <h2>register</h2>


    <form>

        <input id="username" type="text" name="username" placeholder="Nom d'utilisateur" required />
        <input id="password" type="password" name="password" placeholder="Mot de passe" required />
        <button id="register" type="button">register</button>
    </form>
    


        <div class="link">
        Pas encore de compte ? <a onclick="loadRegister()">register</a>
        </div>
    `;
  },

  onMount() {
    const username = document.querySelector<HTMLInputElement>("#username")!;
    const password = document.querySelector<HTMLInputElement>("#password")!;
    
    document.querySelector<HTMLButtonElement>("#register")!.onclick = async () => {
        await connectWs();
        ws?.send(JSON.stringify({event: "register", username: username.value, password: password.value}))
        loadPage(loginPage);
    };
  },

  onUnmount() {
  }
};
