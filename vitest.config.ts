import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Resolve the same @/ imports in tests that Next.js resolves from tsconfig.
export default defineConfig({
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
