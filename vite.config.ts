import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Proxy setup for avoiding CORS issues
  server: {
    proxy: {
      "/api/jet": {
        target: "https://uk.api.just-eat.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/jet/, ""),
      },
    },
  },
});
