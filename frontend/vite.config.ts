import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  server: {
    proxy: {
      "/api": {
        target: `http://${process.env.IS_DOCKER ? "backend" : "localhost"}:3000`,
        ws: true
      }
    }
  }
});