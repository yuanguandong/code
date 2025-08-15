import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isCodeSandbox = "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default defineConfig({
  root: "src/",
  publicDir: "../static/",
  base: "./",
  server: {
    host: true,
    open: !isCodeSandbox, // Open if it's not a CodeSandbox
    allowedHosts: ['home.atool.me'],
    proxy: {
      "/api": {
        target: "http://localhost:8123",
        // target:"https://womgtn5nsobsj66dwluquuprbsva7qpg.ui.nabu.casa",
        changeOrigin: true,
      },
      "/mi": {
        target: "https://api.io.mi.com/app",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [react({
    jsxRuntime: 'automatic',
    jsxImportSource: 'react'
  })],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
});
