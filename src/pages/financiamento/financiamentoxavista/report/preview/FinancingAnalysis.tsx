import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import CompleteAnalysisChart from "@/components/charts/CompleteAnalysisChart";
import FinalEquityDivisionChart from "@/components/charts/FinalEquityDivisionChart";
import InitialEquityDivisionChart from "@/components/charts/InitialEquityDivisionChart";
import { MonthlyInvestmentGrowthChart } from "@/components/charts/MonthlyInvestmentGrowthChart";
import { FinanceOrCashData } from "@/pages/financiamento/financiamentoxavista/Context";
import { useContext } from "react";
import { FinanceOrCashReportContext } from "../Context";

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

  const { financeOrCashReportState } = useContext(FinanceOrCashReportContext);

  return (
    <div className="px-10 pageBreakAfter">
      {financeOrCashReportState.financingTitle.active && (
        <h3 className="text-2xl font-bold text-center leading-7 mb-5 mt-5">
          {financeOrCashReportState.financingTitle.content}
        </h3>
      )}

      {financeOrCashReportState.financingDivisionCharts.active && (
        <div className="grid grid-cols-2 mb-5 px-12">
          <div>
            <p className="text-center">Divisão inicial do capital:</p>
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
      )}

      <div className="px-3">
        {financeOrCashReportState.financingMonthlyInvestmentGrowthChart
          .active && (
          <>
            <p className="text-justify text-sm mb-2">
              {
                financeOrCashReportState.financingMonthlyInvestmentGrowthChart
                  .content
              }
            </p>
            <div className="px-8">
              <MonthlyInvestmentGrowthChart
                data={caseData.financing.detailedTable.map(
                  (i) =>
                    i.rentValue +
                    i.initialCapitalYield +
                    i.rentalIncomeYield -
                    propertyData.installmentValue
                )}
              />
            </div>
          </>
        )}

        {financeOrCashReportState.financingCompleteAnalysis.active && (
          <>
            <p className="!text-center text-sm mt-5 font-bold">
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
          </>
        )}
      </div>
    </div>
  );
}
