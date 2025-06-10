import { loadPage, type Page } from "./Page.ts";
import { profilePage } from "./profilePage.ts";
import { closeWs, ws } from "../websocket.ts";
import { loginPage } from "./loginPage.ts";
import { send, sendAndWait } from "../Event.ts";
import qrcode from "qrcode";
import { loggedNavProfile } from "../main.ts";

export const settingsPage: Page = {
  title: "Settings",
  url: "/settings",

  getPage() {
    return `
      <div class="flex flex-col h-full">
        <div class="flex">
          <button id="go-back" class="cursor-pointer absolute text-gray-300">&LeftArrow; Go back to Profile</button>
          <h1 class="flex-1 text-center font-bold text-3xl my-5 underline">Settings</h1>
        </div>
        <div class="flex flex-1">
          <div class="flex-1 p-2">
            <h2 class="text-center p-3 text-xl font-bold">Personal information</h2>
            <div class="space-y-2 *:flex *:flex-col">
              <form id="avatar">
                <label>Avatar:</label>
                <div class="flex-1 flex gap-2 items-center">
                  <img src="/avatar.webp" alt="Avatar" class="w-15 h-15 bg-gray-900 rounded-full border">
                  <input type="file" required accept="image/*" class="flex-1 bg-gray-500 p-1 rounded-lg cursor-pointer">
                  <button class="py-1 px-2 bg-blue-500 hover:bg-blue-600 rounded-lg"><i class="fa fa-pencil"></i> Update</button>
                </div>
              </form>
              <form id="username">
                <label>Username:</label>
                <div class="flex-1 flex gap-2">
                  <input type="text" required class="flex-1 bg-gray-500 p-1 rounded-lg">
                  <button class="py-1 px-2 bg-blue-500 hover:bg-blue-600 rounded-lg"><i class="fa fa-pencil"></i> Update</button>
                </div>
              </form>
              <form id="display-name">
                <label>Display Name:</label>
                <div class="flex-1 flex gap-2">
                  <input type="text" required class="flex-1 bg-gray-500 p-1 rounded-lg">
                  <button class="py-1 px-2 bg-blue-500 hover:bg-blue-600 rounded-lg"><i class="fa fa-pencil"></i> Update</button>
                </div>
              </form>
              <form id="email">
                <label>Email:</label>
                <div class="flex-1 flex gap-2">
                  <input type="email" required class="flex-1 bg-gray-500 p-1 rounded-lg">
                  <button class="py-1 px-2 bg-blue-500 hover:bg-blue-600 rounded-lg"><i class="fa fa-pencil"></i> Update</button>
                </div>
              </form>
              <form id="password">
                <label>Password:</label>
                <div class="flex-1 flex gap-2">
                  <input type="password" required class="flex-1 bg-gray-500 p-1 rounded-lg">
                  <button class="py-1 px-2 bg-blue-500 hover:bg-blue-600 rounded-lg"><i class="fa fa-pencil"></i> Update</button>
                </div>
              </form>
            </div>
          </div>
          <div class="h-full border border-gray-500"></div>
          <div class="flex-1 p-2">
            <h2 class="text-center p-3 text-xl font-bold">Security</h2>
            <ul class="space-y-3">
              <li class="border rounded-xl p-3">
                <p class="text-lg">2-Factor authentication</p>
                <p class="text-gray-400">Adds an extra layer of security by requiring a code from your phone in addition to your password.</p>
                <div class="flex justify-end items-center mt-5 gap-2">
                  <p>Current status: <span id="status-2fa"></span></p>
                  <button id="enable-2fa" class="rounded-lg cursor-pointer border border-blue-500 bg-blue-500/20 hover:bg-blue-500 px-3 py-1">Enable</button>
                  <button id="disable-2fa" class="rounded-lg cursor-pointer border border-red-500 bg-red-500/20 hover:bg-red-500 px-3 py-1">Disable</button>
                </div>
              </li>
              <li class="border rounded-xl p-3">
                <p class="text-lg">Hide profile</p>
                <p class="text-gray-400">Prevent other users from seeing your profile.</p>
                <div class="flex justify-end mt-5 *:border *:py-1 *:px-3">
                  <button id="visible" class="rounded-l-lg">Visible</button>
                  <button id="hidden" class="rounded-r-lg">Hidden</button>
                </div>
              </li>
              <li class="border rounded-xl p-3">
                <p class="text-lg">Remove account</p>
                <p class="text-gray-400">Remove your account and all associated information.</p>
                <div class="rounded-lg p-2 border border-orange-500 bg-orange-500/20 flex gap-2 items-center my-2 m-5">
                  <i class="fa fa-warning text-orange-500"></i>
                  <p>This action cannot be undone.</p>
                </div>
                <div class="flex justify-end mt-5">
                  <button id="remove" class="rounded-lg cursor-pointer bg-red-700 hover:bg-red-800 py-1 px-3">Remove</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div id="modal-2fa" class="fixed inset-0 bg-black/50 flex items-center justify-center" style="display: none">
        <div class="bg-gray-800 p-10 rounded-4xl shadow-lg w-full max-w-md">
          <h1 class="font-bold text-xl text-center mb-5">2FA setup - Authenticator app</h1>
            <ol class="list-decimal list-outside space-y-2">
              <li>
                Use an authenticator app for TOTP codes like Google Authenticator or Authy
              </li>
              <li>
                Scan this QRCode:
                <canvas id="qrcode"></canvas>
                <p>Or enter this secret in your app:</p>
                <div id="secret" class="overflow-auto bg-gray-900 p-1"></div>
              </li>
              <li>
                <p>Input the value indicated by your authentication app:</p>
                <input id="verify" type="text" class="bg-gray-700 p-1 rounded">
              </li>
            </ol>
            <div class="flex justify-end gap-3">
              <button id="cancel" class="cursor-pointer m-2 hover:underline">Cancel</button>
              <button id="validate" class="cursor-pointer p-2 bg-blue-800 hover:bg-blue-900 rounded-2xl">Validate</button>
            </div>
        </div>
      </div>
    `;
  },

  async onMount() {
    if (ws == undefined) {
      loadPage(loginPage, this, "REPLACE");
      return;
    }

    const goBack = document.querySelector<HTMLButtonElement>("#go-back")!;
    const avatar = document.querySelector<HTMLFormElement>("#avatar")!;
    const avatarIcon = avatar.querySelector("img")!;
    const avatarInput = avatar.querySelector("input")!;
    const status2fa = document.querySelector<HTMLSpanElement>("#status-2fa")!;
    const enable2fa = document.querySelector<HTMLSpanElement>("#enable-2fa")!;
    const disable2fa = document.querySelector<HTMLSpanElement>("#disable-2fa")!;
    const visible = document.querySelector<HTMLButtonElement>("#visible")!;
    const hidden = document.querySelector<HTMLButtonElement>("#hidden")!;
    const remove = document.querySelector<HTMLButtonElement>("#remove")!;

    goBack.onclick = () => loadPage(profilePage);

    const settings = await sendAndWait({ event: "get_settings" });

    setupInfo(document.querySelector("#username")!, settings.username, "username");
    const displayName = document.querySelector<HTMLFormElement>("#display-name")!;
    setupInfo(displayName, settings.displayName, "displayName", () =>
      loggedNavProfile.querySelector("p")!.innerText = displayName.querySelector("input")!.value);
    setupInfo(document.querySelector("#email")!, settings.email, "email");
    setupInfo(document.querySelector("#password")!, "****************************************", "password");

    if (settings.avatar != undefined)
      avatarIcon.src = URL.createObjectURL(new Blob([new Uint8Array(settings.avatar)]));
    avatar.onsubmit = async (event) => {
      event.preventDefault();

      if (avatarInput.files == null || avatarInput.files.length == 0 || !avatarInput.files[0].type.startsWith("image/")) {
        alert("Please select a valid image.");
        return;
      }

      const response = await sendAndWait({
        event: "update_info",
        avatar: Array.from(new Uint8Array(await avatarInput.files[0].arrayBuffer()))
      });

      if (response.success) {
        loadPage(this);
        loggedNavProfile.querySelector("img")!.src = URL.createObjectURL(avatarInput.files[0])
      } else
        alert("An error occurred when updating the avatar.");
    };

    if (settings.enabled2fa) {
      status2fa.innerText = "ENABLED";
      status2fa.classList.add("text-green-500");
      enable2fa.style.display = "none";
    } else {
      status2fa.innerText = "DISABLED";
      status2fa.classList.add("text-red-500");
      disable2fa.style.display = "none";
    }

    enable2fa.onclick = async () => await setup2fa();
    disable2fa.onclick = async () => {
      if (confirm("Are you sure disabling 2FA is a reasonable choice?")) {
        send({ event: "setup_2fa", enable: false });
        loadPage(this);
      }
    };

    if (!settings.hidden) {
      visible.classList.add("border-green-500", "bg-green-500");
      hidden.classList.add("border-gray-400", "bg-gray-400/20", "hover:bg-gray-400", "cursor-pointer");
    } else {
      visible.classList.add("border-green-500", "bg-green-500/20", "hover:bg-green-500", "cursor-pointer");
      hidden.classList.add("border-gray-400", "bg-gray-400");
    }

    visible.onclick = () => {
      if (settings.hidden) {
        send({ event: "hide_profile", hide: false });
        loadPage(this);
      }
    };
    hidden.onclick = () => {
      if (!settings.hidden) {
        send({ event: "hide_profile", hide: true });
        loadPage(this);
      }
    };

    remove.onclick = () => {
      if (confirm("Are you sure you want to delete your account?")) {
        sendAndWait({ event: "remove_account" }).then(message => {
          if (message.success) {
            closeWs();
            loadPage(loginPage, profilePage);
          } else
            alert("An error occurred while removing your account.");
        });
      }
    };
  },

  onUnmount() {
  },

  toJSON() {
    return this.url;
  }
};

function setupInfo(form: HTMLFormElement, defaultValue: string, eventName: string, onSuccess?: () => void) {
  const input = form.querySelector("input")!;
  input.placeholder = defaultValue;

  form.onsubmit = async (event) => {
    event.preventDefault();
    const response = await sendAndWait({
      event: "update_info",
      [eventName]: input.value
    });

    if (response.success) {
      loadPage(settingsPage);
      if (onSuccess != undefined)
        onSuccess();
    } else
      alert("This value is unavailable.");
  };
}

async function setup2fa() {
  const modal = document.querySelector<HTMLDivElement>("#modal-2fa")!;
  const qrcodeCanvas = modal.querySelector<HTMLCanvasElement>("#qrcode")!;
  const secret = modal.querySelector<HTMLSpanElement>("#secret")!;
  const verify = modal.querySelector<HTMLInputElement>("#verify")!;
  const validate = modal.querySelector<HTMLButtonElement>("#validate")!;
  const cancel = modal.querySelector<HTMLButtonElement>("#cancel")!;

  const message = await sendAndWait({ event: "setup_2fa", enable: true });
  await qrcode.toCanvas(qrcodeCanvas, `otpauth://totp/ft_transcendence:${message.username}?secret=${message.secret}&issuer=ft_transcendence`);
  secret.innerText = message.secret!;
  modal.style.display = "";
  verify.value = "";

  validate.onclick = async () => {
    const message = await sendAndWait({ event: "setup_2fa_check", code: verify.value });
    if (message.success) {
      modal.style.display = "none";
      loadPage(settingsPage);
    } else
      alert("Invalid code");
  };

  cancel.onclick = () => modal.style.display = "none";
}