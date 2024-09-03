import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import { financingRoutes } from "./routes/financiamento";
import { auxiliarRoutes } from "./routes/auxiliar";
import { relatorioRoutes } from "./routes/relatorios";
import UserConfig from "./pages/UserConfig";
import { PropertyDataProvider } from "./propertyData/PropertyDataContext";
import Scrap from "./scrapping/Scrap";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export interface Route {
  title: string;
  href: string;
  description: string;
  element: JSX.Element;
}

import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import Login from "./pages/Login";

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" />;
};

export const notify = (
  type: "success" | "info" | "error" | "warning",
  message: string
) => {
  toast[type](message);
};

export default function App() {
  const routes = [...financingRoutes, ...auxiliarRoutes, ...relatorioRoutes];

  function Home() {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Welcome /> : <Login />;
  }

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
    <AuthProvider>
      <BrowserRouter>
        <PropertyDataProvider>
          <ToastContainer
            position="top-center"
            autoClose={5000}
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

          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/user"
              element={
                <PrivateRoute>
                  <UserConfig />
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
