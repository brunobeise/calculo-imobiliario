// vite.config.ts
import { defineConfig } from "file:///C:/Users/User/Desktop/projects/parisotto-imoveis/calculo-imobiliario/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/User/Desktop/projects/parisotto-imoveis/calculo-imobiliario/node_modules/@vitejs/plugin-react-swc/index.mjs";
import vike from "file:///C:/Users/User/Desktop/projects/parisotto-imoveis/calculo-imobiliario/node_modules/vike/dist/esm/node/plugin/index.js";
import path from "path";
import vercel from "file:///C:/Users/User/Desktop/projects/parisotto-imoveis/calculo-imobiliario/node_modules/vite-plugin-vercel/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\User\\Desktop\\projects\\parisotto-imoveis\\calculo-imobiliario";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
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
      "@mui/base"
    ]
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true
    }
  },
  plugins: [react(), vike({ prerender: true }), vercel()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERlc2t0b3BcXFxccHJvamVjdHNcXFxccGFyaXNvdHRvLWltb3ZlaXNcXFxcY2FsY3Vsby1pbW9iaWxpYXJpb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXNlclxcXFxEZXNrdG9wXFxcXHByb2plY3RzXFxcXHBhcmlzb3R0by1pbW92ZWlzXFxcXGNhbGN1bG8taW1vYmlsaWFyaW9cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1VzZXIvRGVza3RvcC9wcm9qZWN0cy9wYXJpc290dG8taW1vdmVpcy9jYWxjdWxvLWltb2JpbGlhcmlvL3ZpdGUuY29uZmlnLnRzXCI7Ly8gdml0ZS5jb25maWcuanNcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgdmlrZSBmcm9tIFwidmlrZS9wbHVnaW5cIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdmVyY2VsIGZyb20gXCJ2aXRlLXBsdWdpbi12ZXJjZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuXG4gIHNzcjoge1xuICAgIG5vRXh0ZXJuYWw6IFtcbiAgICAgIFwiQG11aS9qb3lcIixcbiAgICAgIFwiQG11aS9tYXRlcmlhbFwiLFxuICAgICAgXCJAbXVpL3N5c3RlbVwiLFxuICAgICAgXCJAbXVpL3V0aWxzXCIsXG4gICAgICBcIkBtdWkvaWNvbnMtbWF0ZXJpYWxcIixcbiAgICAgIFwiQG11aS9zdHlsZWQtZW5naW5lXCIsXG4gICAgICBcIkBlbW90aW9uL3JlYWN0XCIsXG4gICAgICBcIkBlbW90aW9uL3N0eWxlZFwiLFxuICAgICAgXCJAbXVpL2Jhc2VcIixcbiAgICBdLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgd2F0Y2g6IHtcbiAgICAgIHVzZVBvbGxpbmc6IHRydWUsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksIHZpa2UoeyBwcmVyZW5kZXI6IHRydWUgfSksIHZlcmNlbCgpXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sWUFBWTtBQU5uQixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFFQSxLQUFLO0FBQUEsSUFDSCxZQUFZO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQSxJQUNkO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxLQUFLLEVBQUUsV0FBVyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUM7QUFDeEQsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
