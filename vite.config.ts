import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import cssInject from "vite-plugin-css-injected-by-js"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [
    react(),
    cssInject(),
  ],
  build: {
    target: "esnext",
    rollupOptions: {
      external: ["react/jsx-runtime", "react", "react-dom"],
      input: resolve(__dirname, "src/App.tsx"),
      preserveEntrySignatures: "exports-only",
      output: {
        entryFileNames: "index.js",
        format: "esm",
      },
    },
  },
})
