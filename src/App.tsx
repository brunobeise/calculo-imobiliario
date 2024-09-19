import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import { financingRoutes } from "./routes/financing";
import { auxiliarRoutes } from "./routes/auxiliar";
import { relatorioRoutes } from "./routes/reports";
import { PropertyDataProvider } from "./propertyData/PropertyDataContext";
import Scrap from "./scrapping/Scrap";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "@/assets/CÁLCULO-IMOBILIÁRIO.png";
import rural from "@/assets/rurallfinancing.png";
import invest from "@/assets/financingOrInvest.png";
import obra from "@/assets/jurosdeobra.png";
export interface Route {
  title: string;
  href: string;
  description: string;
  element: JSX.Element;
}

import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import Login from "./pages/Login";
import UserConfig from "./pages/UserConfig";
import CaseCard from "./components/shared/CaseCard";
import DrawerMenu from "./components/DrawerMenu";
import RealEstateConfig from "./pages/RealEstateConfig";

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default function App() {
  const routes = [...financingRoutes, ...auxiliarRoutes, ...relatorioRoutes];

  function Home() {
    const { isAuthenticated, user } = useAuth();
    -+
    console.log(user);

    return isAuthenticated ? <Welcome /> : <Login />;
  }

  function Welcome() {
    return (
      <div>
        <div className="flex justify-center mb-10">
          <img className="w-[120px]" src={logo} />
        </div>

        <div className="w-full flex justify-center">
          <div className="gap-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 justify-items-center">
            {financingRoutes.map((i) => (
              <CaseCard
                key={i.title}
                link={i.href}
                desc={i.description}
                image={i.image}
                title={i.title}
              />
            ))}
            <CaseCard
              comingSoon
              link={""}
              desc={
                "Faz um plano de aquisição de financimento para imóvel rural"
              }
              image={rural}
              title={"Planejamento para imóvel agrícola"}
            />
            <CaseCard
              comingSoon
              link={""}
              desc={
                "Analisa como o investimento em imóveis se compara a outros métodos de investimento."
              }
              image={invest}
              title={"Comprar imóvel vs. investimento"}
            />
            <CaseCard
              comingSoon
              link={""}
              desc={
                "Faz um plano de aquisição para compra de um imóvel na planta, considerando juros de obra até ficar pronto."
              }
              image={obra}
              title={"Financiamento de imóvel na planta"}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <PropertyDataProvider>
          <ToastContainer
            position="top-center"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}
          />
          <Header />
          <DrawerMenu />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/usuario"
              element={
                <PrivateRoute>
                  <UserConfig />
                </PrivateRoute>
              }
            />
            <Route
              path="/imobiliaria"
              element={
                <PrivateRoute>
                  <RealEstateConfig />
                </PrivateRoute>
              }
            />
            <Route
              path="/scrap"
              element={
                <PrivateRoute>
                  <Scrap />
                </PrivateRoute>
              }
            />
            {routes.map((r) => (
              <Route
                key={r.title}
                path={r.href}
                element={<PrivateRoute>{r.element}</PrivateRoute>}
              />
            ))}
          </Routes>
        </PropertyDataProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
