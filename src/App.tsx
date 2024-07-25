import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import PropertyDataCard from "./components/ProperyDataCard";
import { financingRoutes } from "./routes/financiamento";
import { auxiliarRoutes } from "./routes/auxiliar";
import { relatorioRoutes } from "./routes/relatorios";
import UserConfig from "./pages/userConfig";
import { PropertyDataProvider } from "./propertyData/PropertyDataContext";
import Scrap from "./scrapping/Scrap";

export interface Route {
  title: string;
  href: string;
  description: string;
  element: JSX.Element;
}

export default function App() {
  const routes = [...financingRoutes, ...auxiliarRoutes, ...relatorioRoutes];

  return (
    <BrowserRouter>
      <PropertyDataProvider>
        <Header />
        <PropertyDataCard />

        <Routes>
          <Route path="/user" element={<UserConfig />} />
          <Route path="/scrap" element={<Scrap />} />
          {routes.map((r) => (
            <Route key={r.title} element={r.element} path={r.href} />
          ))}
        </Routes>
      </PropertyDataProvider>
    </BrowserRouter>
  );
}
