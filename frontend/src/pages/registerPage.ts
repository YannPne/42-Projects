import { sendAndWait } from "../Event.ts";
import {connectWs, ws} from "../main.ts";
import { homePage } from "./homePage.ts";
import { loginPage } from "./loginPage.ts";
import {loadPage, type Page } from "./Page.ts";

export const registerPage: Page = {
  url: "/register",
  title: "register",

  getPage(): string {
    return `
    <h2>register</h2>


    <form>

        <input id="username" type="text" name="username" placeholder="username" required />
        <input id="pseudo" type="text" name="pseudo" placeholder="pseudo" required />
        <input id="password" type="password" name="password" placeholder="password" required />
        <input id="avatar" type="file" name="avatar" placeholder="avatar" required />
        <button id="register" type="button">register</button>
    </form>
    


        <div class="link">
		    Deja un compte ? <a id="login" href="/login">login</a>
        
        </div>
    `;
  },

  onMount() {
    const username = document.querySelector<HTMLInputElement>("#username")!;
    const password = document.querySelector<HTMLInputElement>("#password")!;
    const pseudo = document.querySelector<HTMLInputElement>("#pseudo")!;
    const avatar = document.querySelector<HTMLInputElement>("#avatar")!;
  
    document.querySelector<HTMLAnchorElement>("#login")!.onclick = (event) => {
      event.preventDefault();
      loadPage(loginPage);
    };
  
    document.querySelector<HTMLButtonElement>("#register")!.onclick = async () => {

      if (!avatar.files || avatar.files.length === 0) {
        alert("Sélectionne un fichier.");
        return;
      }

      const message = await sendAndWait({
        event: "register",
        username: username.value,
        pseudo: pseudo.value,
        password: password.value,
        success: false
      });

      console.log(message);

      if (message.success === false)
        return;

      const formData = new FormData();
      formData.append('avatar', avatar.files[0]);
      await fetch('http://localhost:3000/upload/avatar', {
        method: 'POST',
        body: formData
      });

      loadPage(homePage);
    };
  },
  

  onUnmount() {
  }
};
