
import CompleteAnalysisChart from "@/components/charts/CompleteAnalysisChart";
import FinalEquityDivisionChart from "@/components/charts/FinalEquityDivisionChart";
import InitialEquityDivisionChart from "@/components/charts/InitialEquityDivisionChart";
import { MonthlyInvestmentGrowthChart } from "@/components/charts/MonthlyInvestmentGrowthChart";

import { IsolatedFinanceOrCashData } from "../../Context";
import { PropertyData } from "@/propertyData/PropertyDataContext";

export default function InCashAnalysis() {
  const propertyData: PropertyData = JSON.parse(
    localStorage.getItem("isolatedFinancingOrInCashPropertyData") || ""
  );

  const { propertyValue, appreciatedPropertyValue, inCashFees } = propertyData;

  const caseData: IsolatedFinanceOrCashData = JSON.parse(
    localStorage.getItem("isolatedFinancingOrInCashCaseData") || ""
  );

  return (
    <div className="px-10 pageBreakAfter">
      <h3 className="text-2xl font-bold text-center leading-7 my-5">
        Análise de Compra À Vista:
      </h3>
      <div className="grid grid-cols-2 mb-5 px-14">
        <div>
          <p className="text-center">Divisão incial do capital:</p>
          <InitialEquityDivisionChart
            labels={["Compra do Imóvel", "Taxas"]}
            values={[propertyValue, inCashFees]}
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
        <p className="text-justify text-sm">
          Todo mês, somamos o aluguel e os rendimentos da renda fixa. O que
          sobra é reinvestido. O capital começa zerado, mas não tem desconto de
          parcelas. Com o aumento periódico do aluguel, o montante na renda fixa
          tende a crescer ao longo do tempo:
        </p>
        <div className="px-8">
          <MonthlyInvestmentGrowthChart
            data={caseData.inCash.detailedTable.map(
              (i) => i.rentValue + i.initialCapitalYield 
            )}
          />
        </div>
        <p className="text-center text-sm mt-5 font-bold mb-2">Análise completa:</p>
        <div className="px-8">
          <CompleteAnalysisChart
            investedEquityValues={caseData.inCash.detailedTable.map(
              (i) => i.totalCapital
            )}
           
            propertyValues={caseData.inCash.detailedTable.map(
              (i) => i.propertyValue
            )}
            
          />
        </div>
      </div>
    </div>
  );
}
