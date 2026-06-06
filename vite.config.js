import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"
import tailwindcss from "@tailwindcss/vite"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: "/8848uk/",  // ← ADD THIS LINE
  root: projectRoot,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "./src"),
    },
  },
})