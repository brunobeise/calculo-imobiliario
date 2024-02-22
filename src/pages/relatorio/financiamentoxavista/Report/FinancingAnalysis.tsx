import { propertyDataContext } from "@/PropertyDataContext";
import CompleteAnalysisChart from "@/components/charts/CompleteAnalysisChart";
import FinalEquityDivisionChart from "@/components/charts/FinalEquityDivisionChart";
import InitialEquityDivisionChart from "@/components/charts/InitialEquityDivisionChart";
import { MonthlyInvestmentGrowthChart } from "@/components/charts/MonthlyInvestmentGrowthChart";
import { FinanceOrCashData } from "@/pages/financiamento/financiamentoxavista/Context";
import { useContext } from "react";

export default function FinancingAnalysis() {
  const { propertyData } = useContext(propertyDataContext);

  const {
    outstandingBalance,
    personalBalance,
    financingFees,
    downPayment,
    appreciatedPropertyValue,
  } = propertyData;

  const caseData: FinanceOrCashData = JSON.parse(
    localStorage.getItem("financingOrInCashCaseData") || ""
  );

  return (
    <div className="px-10">
      <h3 className="text-2xl font-bold text-center leading-7 mb-5">
        Análise do Financiamento:
      </h3>
      <div className="grid grid-cols-2 mb-5 px-12">
        <div>
          <p className="text-center">Divião incial do capital:</p>
          <InitialEquityDivisionChart
            labels={["Renda Fixa", "Entrada", "Taxas"]}
            values={[
              personalBalance - financingFees - downPayment,
              downPayment,
              financingFees,
            ]}
          />
        </div>
        <div>
          <p className="text-center">Divião final do capital:</p>
          <FinalEquityDivisionChart
            labels={["Valor do Imóvel", "Renda Fixa", "Saldo Devedor"]}
            values={[
              appreciatedPropertyValue,
              caseData.financing.investedEquityFinal,
              outstandingBalance,
            ]}
          />
        </div>
      </div>
      <div className="px-3">
        <p className="text-center text-sm">
          Todo mês, somamos o aluguel e os rendimentos da renda fixa para pagar
          as parcelas. O que sobra é reinvestido. Com o aumento periódico do
          aluguel e parcelas fixas, o montante na renda fixa tende a crescer ao
          longo do tempo:
        </p>
        <div className="px-8">
          <MonthlyInvestmentGrowthChart
            propertyData={propertyData}
            context="financing"
          />
        </div>
        <p className="text-center text-sm mt-5">Análise completa:</p>
        <div className="px-8">
          <CompleteAnalysisChart
            propertyData={propertyData}
            context="financing"
          />
        </div>
      </div>
    </div>
  );
}
