import { PropertyData } from "@/propertyData/PropertyDataContext";
import { ComparativeMonthlyInvestmentGrowthChart } from "@/components/charts/ComparativeMontlyInvestmentGrowthChart";
import ComparativeTotalEquityGrowth from "@/components/charts/ComparativeTotalEquityGrowth";
import { IsolatedFinanceOrCashData } from "../../Context";

export default function Comparative() {
  const propertyData: PropertyData = JSON.parse(
    localStorage.getItem("isolatedFinancingOrInCashPropertyData") || ""
  );

  const caseData: IsolatedFinanceOrCashData = JSON.parse(
    localStorage.getItem("isolatedFinancingOrInCashCaseData") || ""
  );

  return (
    <div className="px-12 text-center">
      <h3 className="text-2xl font-bold text-center leading-7 my-5">
        Comparativo:
      </h3>
      <div className="">
        <div className="min-h-[280mm]">
          <div className="mt-10 mb-5">
            <p className="mb-5">
              No cenário de financiamento, o montante inicial disponível para
              investimento em renda fixa é substancialmente maior, o que resulta
              em rendimentos mais significativos desde o início. Esta vantagem
              inicial impulsiona um crescimento mais acelerado e exponencial ao
              longo do tempo, amplificando o efeito dos juros compostos sobre o
              capital investido.
            </p>

            <ComparativeMonthlyInvestmentGrowthChart
              finalYear={propertyData.finalYear}
              financingValues={caseData.financing.detailedTable.map(
                (r) =>
                  r.rentValue +
                  r.initialCapitalYield +
                  propertyData.installmentValue
              )}
              inCashValues={caseData.inCash.detailedTable.map(
                (r) =>
                  r.rentValue +
                  r.initialCapitalYield +
                  propertyData.installmentValue
              )}
            />
          </div>
          <div className="mt-10">
            <p className="mb-5">
              Neste cenário, o gráfico ilustra a evolução do patrimônio nos dois
              contextos - financiamento e pagamento à vista - destacando o
              crescimento progressivo do valor líquido do investimento
              imobiliário ao longo do tempo.
            </p>

            <ComparativeTotalEquityGrowth
              finalYear={propertyData.finalYear}
              financingValues={caseData.financing.detailedTable.map(
                (r) =>
                  (r.monthlyProfit /
                    (propertyData.downPayment + propertyData.financingFees)) *
                  100
              )}
              inCashValues={caseData.inCash.detailedTable.map(
                (r) =>
                  (r.monthlyProfit /
                    (propertyData.propertyValue + propertyData.inCashFees)) *
                  100
              )}
            />
          </div>
        </div>
       
       
      </div>
    </div>
  );
}
