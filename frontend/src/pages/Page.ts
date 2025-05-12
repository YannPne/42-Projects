import { homePage } from "./homePage.ts";
import { chooseGamePage } from "./chooseGamePage.ts";
import { pongPage } from "./pongPage.ts";

export type Page = {
  url: string;
  title: string;
  getPage(): string;
  onMount(): void;
  onUnmount(): void;
};

const pages: Page[] = [
  homePage,
  chooseGamePage,
  pongPage,
];

let currentPage: Page | undefined;

export function loadPage(page: Page) {
  currentPage?.onUnmount();
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = page.getPage();
  page.onMount();
  currentPage = page;

  history.pushState({}, "", page.url);
  document.title = "ft_transcendence | " + page.title;
}

function findPage(url: string) {
  return pages.find(p => p.url == url) ?? pages[0];
}

window.addEventListener("popstate", () => {
  loadPage(findPage(window.location.pathname));
});

loadPage(findPage(window.location.pathname));