import { findPage, loadPage } from "./pages/Page.ts";
import { closeWs, connectWs } from "./websocket.ts";
import { chooseGamePage } from "./pages/chooseGamePage.ts";

export const loggedNav = document.querySelector<HTMLElement>("#logged-nav")!;
export const unloggedNav = document.querySelector<HTMLElement>("#unlogged-nav")!;
export const loggedNavProfile = document.querySelector<HTMLDivElement>("#logged-nav-profile")!;
const loggedNavMenu = document.querySelector<HTMLDivElement>("#logged-nav-menu")!;
const footerIntra = document.querySelector<HTMLParagraphElement>("#footer-intra")!;

loggedNavProfile.onclick = () => {
  loggedNavMenu.style.display = "";
};

document.addEventListener("click", event => {
  if (!loggedNavProfile.contains(event.target as Node | null))
    loggedNavMenu.style.display = "none";
});

for (let entry of loggedNavMenu.querySelectorAll("a, button")) {
  entry.addEventListener("click", event => {
    loggedNavMenu.style.display = "none";
    event.stopPropagation();
  });
}

loggedNavMenu.querySelector("button")!.addEventListener("click", () => {
  closeWs();
});

// Navbar anchors
for (let a of document.querySelectorAll("a")) {
  if (footerIntra.contains(a))
    continue;
  a.onclick = event => {
    event.preventDefault();
    if (unloggedNav.contains(a))
      loadPage(findPage(a.getAttribute("href") ?? ""), chooseGamePage);
    else
      loadPage(findPage(a.getAttribute("href") ?? ""));
  };
}

start();

async function start() {
  if (sessionStorage.getItem("token") != null) {
    try {
      await connectWs();
    } catch (e) {
    }
  }
  loadPage(findPage(window.location.pathname), undefined, "NONE");
}
