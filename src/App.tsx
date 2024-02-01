import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import ImovelDataCard from "./components/ImovelDataCard";
import FinanciamentoXAvista from "./pages/financiamento/financiamentoxavista";
import JurosCompostos from "./pages/auxiliares/JurosCompostos";

export interface Route {
  title: string;
  href: string;
  description: string;
  element: JSX.Element;
}

export default function App() {
  const financiamentoRoutes = [
    {
      title: "Financiamento X A Vista",
      href: "/financiamentoxavista",
      description:
        "Compara as duas hipóteses quando o cliente tem o saldo para comprar a vista.",
      element: <FinanciamentoXAvista />,
    },
  ];

  const auxiliarRoutes = [
    {
      title: "Juros Compostos",
      href: "/juroscompostos",
      description: "Cálculo de juros compostos com aporte mensal",
      element: <JurosCompostos />,
    },
  ];

  const routes = [...financiamentoRoutes, ...auxiliarRoutes];

  return (
    <BrowserRouter>
      <Header
        financiamentoRoutes={financiamentoRoutes}
        auxiliarRoutes={auxiliarRoutes}
      />
      <ImovelDataCard />

      <Routes>
        <Route path="/" element={<></>} />
        {routes.map((r) => (
          <Route key={r.title} element={r.element} path={r.href} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
