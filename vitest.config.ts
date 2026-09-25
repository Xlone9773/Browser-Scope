import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    // Real canvas rendering (node-canvas prebuilt) made the graphics
    // fingerprint tests do actual work instead of failing fast; under full
    // suite parallelism on a phone SoC they can exceed the default 5s.
    // 10s still bounds genuine hangs.
    testTimeout: 10000,
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
    },
    include: ["**/*.test.{ts,tsx}"],
  },
});
