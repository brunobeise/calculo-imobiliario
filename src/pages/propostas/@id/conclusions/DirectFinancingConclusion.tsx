import { toBRL } from "@/lib/formatter";
import ConclusionCaseStructure from "@/components/structure/ConclusionCaseStructure";
import { DirectFinancingCaseData } from "../calculators/DirectFinancingCalculator";

interface ConclusionProps {
  caseData: DirectFinancingCaseData;
  finalYear: number;
}

export default function DirectFinancingConclusion({
  caseData,
  finalYear,
}: ConclusionProps) {
  const data = [
    {
      label: "Valor do imóvel",
      value: caseData.finalRow.propertyValue,
      valueClass: "text-green",
    },
    {
      label: "Aplicado",
      value: caseData.finalRow.totalCapital,
      valueClass: "text-green",
    },
    {
      label: "Dívida",
      value: caseData.finalRow.outstandingBalance,
      valueClass: "text-red",
    },
    {
      label: "Valor Investido",
      value: caseData.totalInvestment,
      valueClass: "text-red",
      tooltipText: "VP: " + toBRL(caseData.investedEquityPresentValue),
    },
    {
      label: "Corretagem",
      value: caseData.brokerageFee,
      valueClass: "text-red",
    },
    {
      label: "Imposto Máximo Ganho de Capital",
      value: caseData.capitalGainsTax,
      valueClass: "text-red",
    },
    {
      label: "Lucro (R$)",
      value: caseData.totalProfit,
      valueClass: "text-green font-bold",
    },
  ];

  return (
    <ConclusionCaseStructure
      title="Conclusão"
      subtitle={`Resultado após ${finalYear} anos`}
      data={data}
      isPercentLastLine
      profitPercent={{
        totalProfit: caseData.totalProfit,
        totalProfitPercent: caseData.totalProfitPercent,
        finalYear,
      }}
    />
  );
}
