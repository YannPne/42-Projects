import { homePage } from "./homePage.ts";
import { chooseGamePage } from "./chooseGamePage.ts";
import { pongPage } from "./pongPage.ts";
import { babylonPage } from "./babylonPage.ts";
import { loginPage } from "./loginPage.ts";
import { registerPage } from "./registerPage.ts";
import { profilePage } from "./profilePage.ts";


export type Page = {
  url: string;
  title: string;
  navbar: boolean | string;
  getPage(): string;
  onMount(data?: any): void;
  onUnmount(): void;
};

export const pages: Page[] = [
  homePage,
  chooseGamePage,
  pongPage,
  babylonPage,
  loginPage,
  registerPage,
  profilePage
];

let currentPage: Page | undefined;

export function loadPage(page: Page, data?: any) {
  currentPage?.onUnmount();
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = page.getPage();

  history.pushState({}, "", page.url);
  document.title = "ft_transcendence | " + page.title;

  page.onMount(data);
  currentPage = page;
}

export function findPage(url: string) {
  return pages.find(p => p.url == url) ?? pages[0];
}

window.addEventListener("popstate", () => {
  loadPage(findPage(window.location.pathname));
});