import type { Page } from "./Page.ts";

export const notFoundPage: Page = {
  url: "/404",
  title: "404 Not Found",

  getPage() {
    return `
      <p class="flex h-full items-center justify-center text-5xl font-bold">
        404 Not Found
      <div>
    `;
  },

  onMount() {
  },

  onUnmount() {
  },

  toJSON() {
    return this.url;
  }
};
