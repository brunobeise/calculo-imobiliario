import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import { useContext } from "react";
import { financingOrCashData } from "./CaseData";
import ConclusionCaseStructure from "@/components/structure/ConclusionCaseStructure";

interface ConclusionProps {
  context: "financing" | "inCash";
  caseData: financingOrCashData;
}

export default function Conclusion({ caseData, context }: ConclusionProps) {
  const { propertyData } = useContext(propertyDataContext);

  if (!propertyData) return null;

  const data = [
    {
      label: "Valor do imóvel",
      value: caseData[context].finalRow.propertyValue,
      valueClass: "text-green",
    },
    {
      label: "Aplicado",
      value: caseData[context].finalRow.totalCapital,
      valueClass: "text-green",
    },
    {
      label: "Dívida",
      value: caseData[context].finalRow.outstandingBalance,
      valueClass: "text-red",
    },
    {
      label: "Valor Investido",
      value:
        propertyData.financingFees +
        propertyData.downPayment +
        (propertyData.personalBalance -
          (propertyData.financingFees + propertyData.downPayment)),
      valueClass: "text-red",
    },
    {
      label: "Corretagem",
      value: caseData[context].finalRow.propertyValue * 0.06,
      valueClass: "text-red",
    },
    {
      label: "Imposto Ganho de Capital",
      value: caseData[context].capitalGainsTax,
      valueClass: "text-red",
    },
    {
      label: "Lucro (R$)",
      value: caseData[context].totalProfit,
      valueClass: "text-green font-bold",
    },
  ];

  return (
    <ConclusionCaseStructure
      title="Conclusão"
      subtitle={`Resultado após ${propertyData.finalYear} anos`}
      data={data}
      profitPercent={{
        totalProfit: caseData[context].totalProfit,
        totalProfitPercent: caseData[context].totalProfitPercent,
        finalYear: propertyData.finalYear,
      }}
      finalNotes={
        caseData[context].breakEven !== 0
          ? `Break-even no mês ${caseData[context].breakEven}`
          : undefined
      }
      isPercentLastLine={true}
    />
  );
}
