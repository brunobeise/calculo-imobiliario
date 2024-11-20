import CompleteAnalysisChart from "@/components/charts/CompleteAnalysisChart";
import { FinancingPlanningData } from "@/pages/planejamentofinanciamento/@id/CaseData";
import { FaChartLine } from "react-icons/fa";
import SectionTitle from "./SectionTitle";

interface DetailChartAnalysisProps {
  color: string;
  secondary: string;
  caseData: FinancingPlanningData;
}

export default function DetailChartAnalysis(props: DetailChartAnalysisProps) {
  const { caseData, color, secondary } = props;

  return (
    <div className="px-12 my-10 w-full">
      <SectionTitle
        color={color}
        secondary={secondary}
        icon={<FaChartLine />}
        title="Análise Gráfica Detalhada"
      />
      <div className="flex flex-col gap-5 w-full">
        <p style={{ color: secondary }}>
          {caseData.finalRow.totalCapital > 0 ? (
            <>
              No próximo gráfico, você verá a projeção do lucro líquido do
              imóvel, considerando a valorização acumulada, a quitação do saldo
              devedor e o rendimento no mercado financeiro (renda fixa). Esse
              cálculo evidencia o retorno financeiro esperado, consolidando a
              compra como um investimento rentável.
            </>
          ) : (
            <>
              No próximo gráfico, você verá a projeção do lucro líquido do
              imóvel, considerando apenas a valorização acumulada e a quitação
              do saldo devedor. Esse cálculo evidencia o retorno financeiro
              esperado, consolidando a compra como um investimento rentável.
            </>
          )}
        </p>
        <CompleteAnalysisChart
          title="Evolução Patrimonial"
          color={color}
          investedEquityValues={caseData.detailedTable.map(
            (i) => i.totalCapital
          )}
          outstandingBalanceValues={caseData.detailedTable.map(
            (i) => i.outstandingBalance
          )}
          propertyValues={caseData.detailedTable.map((i) => i.propertyValue)}
        />
        <p style={{ color: secondary }}>
          {caseData.finalRow.totalCapital > 0 ? (
            <>
              No próximo gráfico, você verá a projeção do lucro líquido do
              imóvel, considerando a valorização acumulada, a quitação do saldo
              devedor e o rendimento no mercado financeiro (renda fixa). Esse
              cálculo evidencia o retorno financeiro esperado, consolidando a
              compra como um investimento rentável.
            </>
          ) : (
            <>
              No próximo gráfico, você verá a projeção do lucro líquido do
              imóvel, considerando apenas a valorização acumulada e a quitação
              do saldo devedor. Esse cálculo evidencia o retorno financeiro
              esperado, consolidando a compra como um investimento rentável.
            </>
          )}
        </p>
        <CompleteAnalysisChart
          title="Lucro Previsto"
          color={color}
          profitValues={caseData.detailedTable.map((i) => i.monthlyProfit)}
        />
      </div>
    </div>
  );
}
