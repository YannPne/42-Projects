import { homePage } from "./homePage.ts";
import { modePage } from "./modePage.ts";
import { chooseGamePage } from "./chooseGamePage.ts";
import { pongPage } from "./pongPage.ts";
import { loginPage } from "./loginPage.ts";
import { registerPage } from "./registerPage.ts";
import { privacyPage } from "./privacyPage.ts";
import { profilePage } from "./profilePage.ts";
import { settingsPage } from "./settingsPage.ts";
import { recoverPage } from "./recoverPage.ts";
import { notFoundPage } from "./notFoundPage.ts";
import {startPage} from "./startPage.ts";

export type Page<T = undefined> = {
  url: string;
  title: string;
  getPage(): string;
  onMount(data?: T): void;
  onUnmount(): void;
  toJSON(): string;
};

export const pages: Page<any>[] = [
  homePage,
  modePage,
  chooseGamePage,
  startPage,
  pongPage,
  // chatPage, -- We don't want access to the chat in a specific page
  loginPage,
  registerPage,
  recoverPage,
  profilePage,
  settingsPage,
  privacyPage,
  notFoundPage
];

let currentPage: Page<any> | undefined;

export function loadPage<T>(page: Page<T>, data?: T, historyState: "PUSH" | "REPLACE" | "NONE" = "PUSH") {
  currentPage?.onUnmount();
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = page.getPage();
  currentPage = page;

  let json: any = null;
  if (data != undefined) {
    if ((data as any).toJSON != undefined)
      json = (data as any).toJSON();
    else
      json = data;
  }

  if (historyState == "PUSH")
    history.pushState(json, "", page.url);
  else if (historyState == "REPLACE")
    history.replaceState(json, "", page.url);
  document.title = "ft_transcendence | " + page.title;
  page.onMount(data);
}

export function findPage(url: string) {
  return pages.find(p => p.url == url) ?? notFoundPage;
}

window.addEventListener("popstate", event => {
  loadPage(findPage(window.location.pathname), event.state, "NONE");
});