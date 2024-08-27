import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
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

  function Welcome() {
    return (
      <div className="absolute top-[50%] w-full left-[50%] text-center translate-y-[-50%] translate-x-[-50%]">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Bem vindo ao sistema Cálculo imobiliário!
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Selecione um contexto no canto superior esquerdo para continuar
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <PropertyDataProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Welcome />} />
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
