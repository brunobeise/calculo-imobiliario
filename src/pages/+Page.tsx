import "react-toastify/dist/ReactToastify.css";
import logo from "@/assets/CÁLCULO-IMOBILIÁRIO.png";
import rural from "@/assets/rurallfinancing.png";
import invest from "@/assets/financingOrInvest.png";
import obra from "@/assets/jurosdeobra.png";
import avista from "@/assets/financiamentoxavista.png";
export interface Route {
  title: string;
  href: string;
  description: string;
  element: JSX.Element;
}

import { useAuth } from "../auth";
import Login from "../pages/Login";

import CaseTypeCard from "../components/shared/CaseTypeCard";

import { financingRoutes } from "@/routes/financing";

export default function App() {
  const { isAuthenticated } = useAuth();

  function Welcome() {
    return (
      <div>
        <div className="flex justify-center mb-10">
          <img className="w-[120px]" src={logo} />
        </div>

        <div className="w-full flex justify-center">
          <div className="gap-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 justify-items-center">
            {financingRoutes
              .filter((r) => !r.href.includes("/:id"))
              .map((i) => (
                <CaseTypeCard
                  key={i.title}
                  link={i.href}
                  desc={i.description}
                  image={i.image}
                  title={i.title}
                />
              ))}
            <CaseTypeCard
              comingSoon
              link={""}
              desc={
                "Compara as duas hipóteses quando o cliente tem o saldo para comprar a vista."
              }
              image={avista}
              title={"Financiamento vs. Compra à Vista"}
            />
            <CaseTypeCard
              comingSoon
              link={""}
              desc={
                "Faz um plano de aquisição de financimento para imóvel rural"
              }
              image={rural}
              title={"Planejamento para imóvel agrícola"}
            />
            <CaseTypeCard
              comingSoon
              link={""}
              desc={
                "Analisa como o investimento em imóveis se compara a outros métodos de investimento."
              }
              image={invest}
              title={"Comprar imóvel vs. investimento"}
            />
            <CaseTypeCard
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

  return isAuthenticated ? <Welcome /> : <Login />;
}
