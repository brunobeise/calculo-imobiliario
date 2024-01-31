import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./theme.tsx";
import { ImovelDataProvider } from "./imovelDataContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ImovelDataProvider>
        <App />
      </ImovelDataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
