import PongPage from "./PongPage.ts";
import ChooseGamePage from "./ChooseGamePage.ts";

export type Page = {
  url: string;
  title: string;
  getPage(): string;
  onMount(): void;
  onUnmount(): void;
};

const pages: Page[] = [
  ChooseGamePage,
  PongPage,
];

function findPage(url: string) {
  return pages.find(p => p.url == url) ?? pages[0];
}

let currentPage: Page | undefined;

export function loadPage(page: Page) {
  currentPage?.onUnmount();
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = page.getPage();
  page.onMount();
  currentPage = page;

  history.pushState({}, "", page.url);
  document.title = "ft_transcendence | " + page.title;
}

window.addEventListener("popstate", () => {
  loadPage(findPage(window.location.pathname));
});

loadPage(findPage(window.location.pathname));