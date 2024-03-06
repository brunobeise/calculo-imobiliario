import { propertyDataContext } from "@/PropertyDataContext";
import CompleteAnalysisChart from "@/components/charts/CompleteAnalysisChart";
import FinalEquityDivisionChart from "@/components/charts/FinalEquityDivisionChart";
import InitialEquityDivisionChart from "@/components/charts/InitialEquityDivisionChart";
import { MonthlyInvestmentGrowthChart } from "@/components/charts/MonthlyInvestmentGrowthChart";
import { FinanceOrCashData } from "@/pages/financiamento/financiamentoxavista/Context";
import { useContext } from "react";

export default function InCashAnalysis() {
  const { propertyData } = useContext(propertyDataContext);

  const { propertyValue, appreciatedPropertyValue } = propertyData;

  const caseData: FinanceOrCashData = JSON.parse(
    localStorage.getItem("financingOrInCashCaseData") || ""
  );

  return (
    <div className="px-10 pageBreakAfter">
      <h3 className="text-2xl font-bold text-center leading-7 mb-5">
        Análise de Compra À Vista:
      </h3>
      <div className="grid grid-cols-2 mb-5 px-12">
        <div>
          <p className="text-center">Divisão incial do capital:</p>
          <InitialEquityDivisionChart
            labels={["Compra do Imóvel"]}
            values={[propertyValue]}
          />
        </div>
        <div>
          <p className="text-center">Divisão final do capital:</p>
          <FinalEquityDivisionChart
            labels={["Valor do Imóvel", "Renda Fixa"]}
            values={[
              appreciatedPropertyValue,
              caseData.inCash.investedEquityFinal,
            ]}
          />
        </div>
      </div>
      <div className="px-3">
        <p className="text-center text-sm">
          Todo mês, somamos o aluguel e os rendimentos da renda fixa. O que
          sobra é reinvestido. O capital começa zerado, mas não tem desconto de
          parcelas. Com o aumento periódico do aluguel, o montante na renda fixa
          tende a crescer ao longo do tempo:
        </p>
        <div className="px-8">
          <MonthlyInvestmentGrowthChart
            propertyData={propertyData}
            context="inCash"
          />
        </div>
        <p className="text-center text-sm mt-5">Análise completa:</p>
        <div className="px-8">
          <CompleteAnalysisChart propertyData={propertyData} context="inCash" />
        </div>
      </div>
    </div>
  );
}
