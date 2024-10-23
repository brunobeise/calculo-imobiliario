// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import vike from "vike/plugin";
import path from "path";
import vercel from "vite-plugin-vercel";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  ssr: {
    noExternal: [
      "@mui/joy",
      "@mui/material",
      "@mui/system",
      "@mui/utils",
      "@mui/icons-material",
      "@mui/styled-engine",
      "@emotion/react",
      "@emotion/styled",
      "@mui/base",
    ],
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true,
    },
  },
  plugins: [react(), vike({ prerender: true }), vercel()],
});
