import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import ImovelDataCard from "./components/ImovelDataCard";
import FinanciamentoXAvista from "./pages/financiamentoxavista";

export default function App() {
  const routes = [
    {
      title: "Financiamento X Á Vista",
      href: "/financiamentoxavista",
      description:
        "Compara as duas hipóteses quando o cliente tem o saldo para comprar a vista.",
      element: <FinanciamentoXAvista />,
    },
  ];

  return (
    <BrowserRouter>
      <Header routes={routes} />
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
