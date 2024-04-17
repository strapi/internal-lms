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
    // Path to your setup script that we will go into detail below
    setupFiles: ["./tests/setup.integration.ts"],
    // Up to you, I usually put my integration tests inside of integration
    // folders
    include: ["./tests/*.test.ts"],
  },
});
