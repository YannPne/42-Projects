import { sendAndWait } from "../Event.ts";
import {connectWs, ws} from "../main.ts";
import { homePage } from "./homePage.ts";
import {loadPage, type Page } from "./Page.ts";
import { registerPage } from "./registerPage.ts";

export const loginPage: Page = {
  url: "/login",
  title: "Login",
	navbar: true,

  getPage(): string {
	return `
	<h2>Login</h2>


	<form>

		<input id="username" type="text" name="username" placeholder="Nom d'utilisateur" required />
		<input id="password" type="password" name="password" placeholder="Mot de passe" required />
		<button id="login" type="button">Login</button>
	</form>
	


		<div class="link">
		Pas encore de compte ? <a id="register" href="/register">register</a>
		</div>
	`;
  },

  onMount() {

	const username = document.querySelector<HTMLInputElement>("#username")!;
	const password = document.querySelector<HTMLInputElement>("#password")!;

	document.querySelector<HTMLAnchorElement>("#register")!.onclick = (event) => {
		event.preventDefault();
		loadPage(registerPage)
	}


	document.querySelector<HTMLButtonElement>("#login")!.onclick = async () => {
	  if (username.value.trim() == "" && password.value == "")
		return;

	  if (!ws || ws.readyState !== WebSocket.OPEN) {
		await connectWs();
	  }

	  sendAndWait({event: "login", username: username.value.trim(), password: password.value}).then(message => {
		if (message.success === true)
			loadPage(homePage);
		else
			ws?.close();
	  });
	};
  },

  onUnmount() {
  }
};
