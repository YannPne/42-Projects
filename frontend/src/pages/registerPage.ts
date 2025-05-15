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
        <input id="avatar" type="file" name="avatar" placeholder="avatar"  />
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

      await connectWs();
      ws?.send(JSON.stringify({
        event: "register",
        username: username.value,
        pseudo: pseudo.value,
        password: password.value
      }));

      const formData = new FormData();
      formData.append('avatar', avatar.files[0]);
      fetch('http://localhost:3000/upload/avatar', {
        method: 'POST',
        body: formData
      });

  
      // const formData = new FormData();
      // formData.append("avatar", avatar.files[0]);
  
      //  const res = await fetch("http://localhost:3000/upload/avatar", {
      //    method: "POST",
      //    headers: {
      //      "Authorize": "Bearer " + username.value
      //    },
      //    body: formData
      //  });

      loadPage(homePage);
    };
  },
  

  onUnmount() {
  }
};
