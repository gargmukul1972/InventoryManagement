import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "inventory",
      filename: "remoteEntry.js",

      // IMPORTANT: expose your app entry safely
      exposes: {
        "./App": "./src/App.jsx",
      },

      shared: ["react", "react-dom"],
    }),
  ],

  build: {
    target: "esnext",

    minify: false,

    cssCodeSplit: false,

    rollupOptions: {
      output: {
        // CRITICAL FIX: ensures correct asset placement
        format: "esm",
      },
    },
  },

  base: "/", // safe for Render deployment
});