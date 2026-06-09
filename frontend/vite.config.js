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

/**
 * Custom transform plugin to wrap BrowserRouter and MainLayout dynamically.
 * Strips them when running as a microfrontend nested within the Host App's router.
 */
function wrapBrowserRouter() {
  return {
    name: "wrap-browser-router",
    transform(code, id) {
      if (id.includes("AppRoutes.jsx")) {
        let newCode = code;
        // 1. Rename the imported BrowserRouter to OriginalBrowserRouter
        newCode = newCode.replace(/BrowserRouter\s*,/, "BrowserRouter as OriginalBrowserRouter,");
        // 2. Rename the imported MainLayout to OriginalMainLayout
        newCode = newCode.replace(/\bMainLayout\s+from/, "OriginalMainLayout from");
        // 3. Prepend importing useInRouterContext, createElement, and Fragment
        newCode = `import { useInRouterContext } from "react-router-dom";\nimport { createElement, Fragment } from "react";\n` + newCode;
        // 4. Define the wrapper components at the end of the file using plain JS
        newCode += `
          function BrowserRouter({ children }) {
            const inRouter = useInRouterContext();
            return inRouter ? createElement(Fragment, null, children) : createElement(OriginalBrowserRouter, null, children);
          }
          function MainLayout({ children }) {
            const inRouter = useInRouterContext();
            return inRouter ? createElement(Fragment, null, children) : createElement(OriginalMainLayout, null, children);
          }
        `;
        return {
          code: newCode,
          map: null
        };
      }
    }
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
    wrapBrowserRouter(),
  ],

  build: {
    target: "esnext",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
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