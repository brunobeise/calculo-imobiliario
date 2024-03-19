
import CompleteAnalysisChart from "@/components/charts/CompleteAnalysisChart";
import FinalEquityDivisionChart from "@/components/charts/FinalEquityDivisionChart";
import InitialEquityDivisionChart from "@/components/charts/InitialEquityDivisionChart";
import { MonthlyInvestmentGrowthChart } from "@/components/charts/MonthlyInvestmentGrowthChart";
import { IsolatedFinanceOrCashData } from "../../Context";
import { PropertyData } from "@/propertyData/PropertyDataContext";

export default function FinancingAnalysis() {
  const propertyData: PropertyData = JSON.parse(
    localStorage.getItem("isolatedFinancingOrInCashPropertyData") || ""
  );

  const {
    outstandingBalance,
    financingFees,
    downPayment,
    appreciatedPropertyValue,
  } = propertyData;

  const caseData: IsolatedFinanceOrCashData = JSON.parse(
    localStorage.getItem("isolatedFinancingOrInCashCaseData") || ""
  );

  return (
    <div className="px-10 pageBreakAfter">
      <h3 className="text-2xl font-bold text-center leading-7 mb-5 mt-5">
        Análise do Financiamento:
      </h3>
      <div className="grid grid-cols-2 mb-5 px-12">
        <div className="px-2">
          <p className="text-center">Divisão inicial do capital:</p>
          <div>
            <InitialEquityDivisionChart
              labels={["Entrada", "Taxas"]}
              values={[downPayment, financingFees]}
            />
          </div>
        </div>
        <div>
          <p className="text-center">Divisão final do capital:</p>
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
        <p className="text-justify text-sm ">
          Todo mês, somamos o aluguel e os rendimentos da renda fixa para pagar
          as parcelas. O que sobra é reinvestido. Com o aumento periódico do
          aluguel e parcelas fixas, com o tempo, esse valor que era negativo, começa a ser positivo com o passar dos anos.
        </p>
        <div className="px-8">
          <MonthlyInvestmentGrowthChart
            data={caseData.financing.detailedTable.map(
              (i) =>
                i.rentValue +
                i.initialCapitalYield -
                propertyData.installmentValue
            )}
          />
        </div>
        <p className="text-justify !text-center text-md mt-5 mb-2 font-bold">
          Análise completa:
        </p>
        <div className="px-8">
          <CompleteAnalysisChart
            investedEquityValues={caseData.financing.detailedTable.map(
              (i) => i.totalCapital
            )}
            outstandingBalanceValues={caseData.financing.detailedTable.map(
              (i) => i.outstandingBalance
            )}
            propertyValues={caseData.financing.detailedTable.map(
              (i) => i.propertyValue
            )}
          />
        </div>
      </div>
    </div>
  );
}
