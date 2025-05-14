import { homePage } from "./homePage.ts";
import { chooseGamePage } from "./chooseGamePage.ts";
import { pongPage } from "./pongPage.ts";
import { babylonPage } from "./babylonPage.ts";

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
];

let currentPage: Page | undefined;

export function loadPage(page: Page, data?: any) {
  currentPage?.onUnmount();
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = page.getPage();
  page.onMount(data);
  currentPage = page;

  history.pushState({}, "", page.url);
  document.title = "ft_transcendence | " + page.title;
}

export function findPage(url: string) {
  return pages.find(p => p.url == url) ?? pages[0];
}

window.addEventListener("popstate", () => {
  loadPage(findPage(window.location.pathname));
});