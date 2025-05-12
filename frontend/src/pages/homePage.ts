import { loadPage, type Page } from "./Page.ts";
import { chooseGamePage } from "./chooseGamePage.ts";

export const homePage: Page = {
  url: "/",
  title: "Accueil",

  getPage(): string {
    return `
    <button id="button">Rejoindre une partie</button>
    `;
  },

  onMount() {
    document.querySelector<HTMLButtonElement>("#button")!.onclick = () => {
      loadPage(chooseGamePage);
    };
  },

  onUnmount() {
  }
};
