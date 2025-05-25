import { homePage } from "./homePage.ts";
import { chooseGamePage } from "./chooseGamePage.ts";
import { pongPage } from "./pongPage.ts";
import { babylonPage } from "./babylonPage.ts";
import { loginPage } from "./loginPage.ts";
import { registerPage } from "./registerPage.ts";
import { profilePage } from "./profilePage.ts";
import { chatPage } from "./chatPage.ts";
import { privacyPage } from "./privacyPage.ts";


export type Page<T = undefined> = {
  url: string;
  title: string;
  navbar: boolean | string;
  getPage(): string;
  onMount(data?: T): void;
  onUnmount(): void;
};

export const pages: Page[] = [
  homePage,
  chooseGamePage,
  pongPage,
  babylonPage,
  loginPage,
  registerPage,
  profilePage,
  chatPage,
  privacyPage,
];

let currentPage: Page<any> | undefined;

export function loadPage<T>(page: Page<T>, data?: T) {
  currentPage?.onUnmount();
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = page.getPage();
  currentPage = page;
  history.pushState({}, "", page.url);
  document.title = "ft_transcendence | " + page.title;
  page.onMount(data);
}

export function findPage(url: string) {
  return pages.find(p => p.url == url) ?? pages[0];
}

window.addEventListener("popstate", () => {
  loadPage(findPage(window.location.pathname));
});