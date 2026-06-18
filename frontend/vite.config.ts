import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:3000"
  const apiProxyConfig = {
    target: apiProxyTarget,
    changeOrigin: true,
    rewrite: (requestPath: string) => requestPath.replace(/^\/api/, ""),
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": apiProxyConfig,
      },
    },
    preview: {
      proxy: {
        "/api": apiProxyConfig,
      },
    },
  }
})