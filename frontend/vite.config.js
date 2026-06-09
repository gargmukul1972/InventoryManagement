import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'inventory', // ✅ your app name
      filename: 'remoteEntry.js',

      // SAFE: leave empty for now (no breaking changes)
      remotes: {},

      exposes: {
        // keep empty unless you want micro-frontend sharing
        // './ExampleComponent': './src/components/ExampleComponent.jsx',
      },

      shared: ['react', 'react-dom']
    })
  ],

  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },

  server: {
    port: 5173
  }
})