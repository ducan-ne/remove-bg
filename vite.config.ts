import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import cssInject from "vite-plugin-css-injected-by-js"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [react(), cssInject()],
  resolve:
    process.env.NODE_ENV === "production"
      ? {
          alias: {
            "@huggingface/transformers":
              "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0-alpha.9",
          },
        }
      : {},
  build: {
    target: "esnext",
    rollupOptions:
      process.env.TARGET === "bannerify"
        ? {
            external: ["react/jsx-runtime", "react", "react-dom"],
            input: resolve(__dirname, "src/App.tsx"),
            preserveEntrySignatures: "exports-only",
            output: {
              entryFileNames: "index.js",
              format: "esm",
            },
          }
        : {},
  },
})
