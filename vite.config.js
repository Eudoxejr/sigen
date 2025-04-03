import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({
    jsxImportSource: "@emotion/react",
    jsxRuntime: "automatic",
    babel: {
      plugins: ["@emotion/babel-plugin"],
    },
  })],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  }
});
