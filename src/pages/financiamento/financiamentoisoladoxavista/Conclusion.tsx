import { Sheet } from "@mui/joy";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import { numeroParaReal } from "@/lib/formatter";
import { useContext } from "react";
import { FinancingPlanningData } from "./CaseData";

interface ConclusionProps {
  caseData: FinancingPlanningData;
}

interface InfoRowProps {
  label: string;
  value: number;
  valueClass?: string;
}

const InfoRow = ({ label, value, valueClass }: InfoRowProps) => (
  <div className="flex justify-between items-center">
    <span>{`- ${label}`}</span>
    <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
    <span className={valueClass}>{numeroParaReal(value)}</span>
  </div>
);

export default function Conclusion({ caseData }: ConclusionProps) {
  const { propertyData } = useContext(propertyDataContext);

  if (caseData.detailedTable.length > 0)
    return (
      <Sheet
        variant="outlined"
        className="col-span-12 md:col-span-6 lg:col-span-4 order-last lg:order-none text-center p-5"
      >
        <h2 className="text-xl text-center my-2 font-bold">Conclusão</h2>
        <p className="text-md mb-7 text-center">
          Resultado após {propertyData.finalYear} anos
        </p>

        <div className="text-xl col-span-4 px-8">
          <InfoRow
            label="Valor do imóvel"
            value={caseData.finalRow.propertyValue}
            valueClass="text-green"
          />
          {!propertyData.isHousing && (
            <InfoRow
              label="Aplicado"
              value={caseData.finalRow.totalCapital}
              valueClass="text-green"
            />
          )}

          <InfoRow
            label="Dívida"
            value={caseData.finalRow.outstandingBalance}
            valueClass="text-red"
          />
          <InfoRow
            label="Valor Investido"
            value={
              propertyData.financingFees +
              propertyData.downPayment +
              caseData.finalRow.rentalShortfall
            }
            valueClass="text-red"
          />
          <InfoRow
            label="Corretagem"
            value={caseData.finalRow.propertyValue * 0.06}
            valueClass="text-red"
          />
          <InfoRow
            label="Imposto Ganho de Capital"
            value={caseData.capitalGainsTax}
            valueClass="text-red"
          />
          <InfoRow
            label="Lucro (R$)"
            value={caseData.totalProfit}
            valueClass="text-green font-bold"
          />
          <div className="flex justify-between items-center">
            <span>{`- Lucro (%)`}</span>
            <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
            <span className="text-green font-bold">
              {caseData.totalProfitPercent.toFixed(2) + "% / "}
              {(caseData.totalProfitPercent / propertyData.finalYear).toFixed(
                2
              ) + "% (ano)"}
            </span>
          </div>
        </div>

        {caseData.breakEven !== 0 && (
          <p className="text-xs mt-5">
            *Break-even no mês <strong>{caseData.breakEven}</strong>
          </p>
        )}
      </Sheet>
    );
}
