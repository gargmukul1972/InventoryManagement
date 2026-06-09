import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import fs from "node:fs";
import path from "node:path";

/**
 * SAFE FIX: ensures correct asset resolution in production
 */
function fixMFAssets() {
  return {
    name: "fix-mf-assets",
    apply: "build",
    closeBundle() {
      const distPath = path.resolve(__dirname, "dist/assets");

      if (!fs.existsSync(distPath)) return;

      const files = fs.readdirSync(distPath);

      const remoteEntryFile = files.find(f =>
        f.includes("remoteEntry")
      );

      if (!remoteEntryFile) return;

      const filePath = path.join(distPath, remoteEntryFile);

      let code = fs.readFileSync(filePath, "utf8");

      /**
       * SAFE PATCH:
       * only adjusts asset base WITHOUT touching module logic
       */
      code = code.replace(
        /const base = '\/'/g,
        "const base = '/assets/'"
      );

      fs.writeFileSync(filePath, code);
    }
  };
}

export default defineConfig({
  plugins: [
    react(),

    federation({
      name: "inventory",

      filename: "remoteEntry.js",

      exposes: {
        "./App": "./src/App.jsx",
      },

      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
        },
      },
    }),

    fixMFAssets(), // SAFE PATCH ONLY AFTER BUILD
  ],

  base: "/", // keep unchanged (SAFE for Render)

  build: {
    target: "esnext",

    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,

    minify: false,
    cssCodeSplit: false,

    rollupOptions: {
      output: {
        format: "esm",

        // IMPORTANT: prevents broken chunk paths
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});