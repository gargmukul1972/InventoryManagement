import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Workaround: https://github.com/originjs/vite-plugin-federation/issues/740 */
function fixFederationCssForVite8() {
  return {
    name: "fix-federation-css-vite8",
    apply: "build",
    closeBundle() {
      const assetsDir = path.resolve(__dirname, "dist", "assets");
      const remoteEntry = path.join(assetsDir, "remoteEntry.js");
      if (!fs.existsSync(remoteEntry)) return;

      const cssFiles = fs
        .readdirSync(assetsDir)
        .filter((file) => file.endsWith(".css"));

      let code = fs.readFileSync(remoteEntry, "utf8");
      code = code.replace(/`__v__css__[^`]*`/g, JSON.stringify(cssFiles));
      fs.writeFileSync(remoteEntry, code);
    },
  };
}

export default defineConfig({
  base: "/",

  plugins: [
    react(),

    federation({
      name: "inventory",
      filename: "remoteEntry.js",
      exposes: {
        "./Routes": "./src/routes/AppRoutes.jsx",
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
        "react-router": {
          singleton: true,
          requiredVersion: false,
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: false,
        },
      },
    }),

    fixFederationCssForVite8(),
  ],

  build: {
    target: "esnext",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      },
    },
  },

  server: {
    port: 5002,
    cors: true,
  },

  preview: {
    port: 5002,
    strictPort: true,
    cors: true,
  },
});