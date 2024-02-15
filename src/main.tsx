import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./theme.tsx";
import { PropertyDataProvider } from "./PropertyDataContext.tsx";
import "@/assets/fonts/font.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <PropertyDataProvider>
        <App />
      </PropertyDataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
