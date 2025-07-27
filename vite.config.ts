import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "./",
  plugins: [react(), tsconfigPaths()],
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    target: "esnext",
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
    // Path aliases handled by vite-tsconfig-paths
  },
  server: {
    open: true,
    port: 5173,
  },
  envDir: ".",
});
