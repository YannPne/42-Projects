import {connectWs, ws} from "../main.ts";
import {type Page } from "./Page.ts";

export const loginPage: Page = {
  url: "/login",
  title: "Login",

  getPage(): string {
    return `
    <h2>Login</h2>


    <form>

        <input id="username" type="text" name="username" placeholder="Nom d'utilisateur" required />
        <input id="password" type="password" name="password" placeholder="Mot de passe" required />
        <button id="login" type="button">Login</button>
    </form>
    


        <div class="link">
        Pas encore de compte ? <a onclick="loadRegister()">register</a>
        </div>
    `;
  },

  onMount() {
    const username = document.querySelector<HTMLInputElement>("#username")!;
    const password = document.querySelector<HTMLInputElement>("#password")!;

    document.querySelector<HTMLButtonElement>("#login")!.onclick = () => {
        console.log(ws);
        ws?.send(JSON.stringify({event: "login", username: username.value, password: password.value}))
    };
  },

  onUnmount() {
  }
};
