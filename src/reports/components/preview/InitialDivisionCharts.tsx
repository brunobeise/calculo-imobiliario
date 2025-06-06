import InitialEquityDivisionChart from "@/components/charts/InitialEquityDivisionChart";
import { DirectFinancingCaseData } from "@/pages/propostas/@id/calculators/DirectFinancingCalculator";
import { FinancingPlanningData } from "@/pages/propostas/@id/calculators/FinancingPlanningCalculator";
import { PropertyData } from "@/propertyData/PropertyDataContext";

interface InitialDivisionChartsProps {
  caseData: FinancingPlanningData | DirectFinancingCaseData;
  propertyData: PropertyData;
  color: string;
  secondary: string;
}

export default function InitialDivisionCharts(
  props: InitialDivisionChartsProps
) {
  const { color, caseData, propertyData, secondary } = props;

  return (
    <div style={{ color: secondary }} className="w-full px-24 lg:px-12 mt-10">
      <p className="mb-10 text-lg">
        A análise demonstra que, ao focar no lucro final,{" "}
        <strong>
          {" "}
          o financiamento imobiliário apresenta-se como uma opção vantajosa.{" "}
        </strong>{" "}
        Observa-se um retorno significativo, tornando-se uma alternativa eficaz
        para maximizar os ganhos financeiros em investimentos no setor
        imobiliário
      </p>
      <div className="grid grid-cols-2 gap-4 border rounded-md">
        <div className="flex flex-col items-center border-r p-6">
          <h2 style={{ color }} className="text-primary font-bold text-lg">
            Divisão inicial do capital
          </h2>
          <div className="mt-4 w-full flex justify-center">
            <InitialEquityDivisionChart
              color={color}
              labels={["Entrada", "Taxas"]}
              values={[propertyData.downPayment, propertyData.financingFees]}
            />
          </div>
        </div>

        <div className="flex flex-col items-center p-6">
          <h2 style={{ color }} className="text-primary font-bold text-lg">
            Divisão final do capital
          </h2>
          <div className="mt-4 w-full flex justify-center">
            <InitialEquityDivisionChart
              color={color}
              labels={["Valor Imóvel", "Renda Fixa", "Saldo Devedor"]}
              values={[
                caseData.finalRow.propertyValue,
                caseData.finalRow.totalCapital,
                caseData.finalRow.outstandingBalance,
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
