/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig(() => {
  return {
    define: {
      __APP_ENV__: process.env.VITE_STRAPI_URL,
    },
    plugins: [react(), TanStackRouterVite(), tsconfigPaths()],
    test: {
      globals: true,
      include: ["./tests/*.test.ts"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@interfaces": path.resolve(__dirname, "./types")
      },
    },
  },
});
