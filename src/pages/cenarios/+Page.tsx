import "react-toastify/dist/ReactToastify.css";
import logo from "@/assets/imobDeal.png";
import CaseTypeCard from "@/components/shared/CaseTypeCard";
import FinancingPlanningImage from "@/assets/financingPlanning.png";
import DirectFinancingImage from "@/assets/financiamentodireto.png";

export default function Cenarios() {
  return (
    <div className="w-full h-screen items-center flex flex-col justify-center">
      <div className="flex items-center mb-10 flex-col">
        <img className="w-[120px]" src={logo} />
        <span className="text-primary">
          Imob<span className="font-bold">Deal</span>
        </span>
      </div>

      <div className="w-full flex justify-center">
        <div className="gap-12 uw:gap-12 flex justify-items-center">
          <CaseTypeCard
            title="Financiamento Bancário"
            link={"/planejamentofinanciamento"}
            desc={
              "Faz um plano de aquisição com a estratégia de financiamento imobiliário."
            }
            image={FinancingPlanningImage}
          />

          <CaseTypeCard
            title="Parcelamento Direto"
            link={"/parcelamentodireto"}
            desc={
              "Elabora um plano de aquisição para financiamento direto com a construtora, alinhado às necessidades do cliente."
            }
            image={DirectFinancingImage}
          />
          {/* <CaseTypeCard
            comingSoon
            link={""}
            desc={"Faz um plano de aquisição de financimento para imóvel rural"}
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
          /> */}
        </div>
      </div>
    </div>
  );
}
