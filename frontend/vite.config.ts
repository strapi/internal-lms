/// <reference types="vitest" />
/// <reference types="vite/client" />

import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  test: {
    // allows you to use stuff like describe, it, vi without importing
    globals: true,
    include: ["./tests/*.test.ts"],
  },
});
