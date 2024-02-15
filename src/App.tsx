import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import PropertyDataCard from "./components/ProperyDataCard";

import { financiamentoRoutes } from "./routes/financiamento";
import { auxiliarRoutes } from "./routes/auxiliar";
import { relatorioRoutes } from "./routes/relatorios";

export interface Route {
  title: string;
  href: string;
  description: string;
  element: JSX.Element;
}

export default function App() {
  const routes = [
    ...financiamentoRoutes,
    ...auxiliarRoutes,
    ...relatorioRoutes,
  ];

  return (
    <BrowserRouter>
      <Header />
      <PropertyDataCard />

      <Routes>
        <Route path="/" element={<></>} />
        {routes.map((r) => (
          <Route key={r.title} element={r.element} path={r.href} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
