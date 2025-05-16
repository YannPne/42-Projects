import { loadPage, type Page } from "./Page.ts";
import { awaitWs, ws } from "../main.ts";
import { loginPage } from "./loginPage.ts";

export const profilePage: Page = {
  url: "/profile",
  title: "Profile",
  navbar: true,

  getPage(): string {
    return `
      <p>TODO</p>
    `;
  },

  async onMount() {
    if (ws == undefined) {
      loadPage(loginPage, profilePage);
      return;
    }

    await awaitWs();
  },

  onUnmount() {
  }
};
