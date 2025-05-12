import { loadPage, type Page } from "./Page.ts";
import { chooseGamePage } from "./chooseGamePage.ts";
import { babylonPage } from "./babylonPage.ts";

export const homePage: Page = {
  url: "/",
  title: "Accueil",

  getPage(): string {
    return `
    <button id="chooseGame">Rejoindre une partie</button>
    <button id="babylon">Babylon</button>
    `;
  },

  onMount() {
    document.querySelector<HTMLButtonElement>("#chooseGame")!.onclick = () => {
      loadPage(chooseGamePage);
    };
    document.querySelector<HTMLButtonElement>("#babylon")!.onclick = () => {
      loadPage(babylonPage);
    };
  },

  onUnmount() {
  }
};
