// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        game: resolve(__dirname, "game.html"),
        riddle: resolve(__dirname, "riddle.html"),
      },
    },
  },
});
