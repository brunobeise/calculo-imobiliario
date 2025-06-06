import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import logo from "@/assets/imobDeal.png";
import CaseTypeCard from "@/components/shared/CaseTypeCard";
import FinancingPlanningImage from "@/assets/financingPlanning.png";
import DirectFinancingImage from "@/assets/financiamentodireto.png";
import NewProposalForm from "@/components/NewProposalForm/NewProposalForm";
import { ProposalTypes } from "@/types/proposalTypes";

export default function Cenarios() {
  const [selectedType, setSelectedType] = useState<ProposalTypes>();

  return (
    <div className="w-full pb-12 md:pb-0 md:h-screen items-center flex flex-col justify-center">
      {!selectedType && (
        <>
          <div className="flex items-center mb-10 flex-col">
            <img className="w-[120px]" src={logo} />
            <span className="text-primary">
              Imob<span className="font-bold">Deal</span>
            </span>
          </div>

          <div className="w-full flex justify-center">
            <div className="gap-12 uw:gap-12 grid grid-cols-1 md:grid-cols-2">
              <CaseTypeCard
                title="Financiamento Bancário"
                link={""} // link vazio pois vamos abrir inline
                desc={
                  "Faz um plano de aquisição com a estratégia de financiamento imobiliário."
                }
                image={FinancingPlanningImage}
                onClick={() =>
                  setSelectedType(ProposalTypes.FinancamentoBancário)
                }
              />

              <CaseTypeCard
                title="Parcelamento Direto"
                link={""}
                desc={
                  "Elabora um plano de aquisição para financiamento direto com a construtora, alinhado às necessidades do cliente."
                }
                image={DirectFinancingImage}
                onClick={() =>
                  setSelectedType(ProposalTypes.ParcelamentoDireto)
                }
              />
            </div>
          </div>
        </>
      )}

      {selectedType && (
        <div className="w-full px-4">
          <NewProposalForm type={selectedType} />
        </div>
      )}
    </div>
  );
}
