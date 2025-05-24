import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import * as fs from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        ws: true
      }
    },
    https: {
      cert: fs.readFileSync(resolve(__dirname, "fullchain.crt")),
      key: fs.readFileSync(resolve(__dirname, "privkey.key"))
    }
  }
});