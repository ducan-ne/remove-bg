import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import cssInject from "vite-plugin-css-injected-by-js"
import { resolve } from "node:path"
import fs from "node:fs/promises"

export default defineConfig({
  plugins: [
    react(),
     cssInject(),
     {
      name: 'index.js',
      apply: 'build',
      async writeBundle() {
        const manifest = JSON.parse(await fs.readFile("dist/.vite/manifest.json", "utf-8"))
        await fs.writeFile("dist/index.js", `export {default} from "./${manifest["src/App.tsx"].file}"`)
      }
     }
  ],
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
    manifest: true,
    target: "esnext",
    rollupOptions:
      process.env.TARGET === "bannerify"
        ? {
            external: ["react/jsx-runtime", "react", "react-dom"],
            input: resolve(__dirname, "src/App.tsx"),
            preserveEntrySignatures: "exports-only",
            output: {
              entryFileNames: "index.[hash].js",
              format: "esm",
            },
          }
        : {},
  },
})
