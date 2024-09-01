import { Sheet } from "@mui/joy";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import { numeroParaReal } from "@/lib/formatter";
import { useContext } from "react";
import { FinanceOrCashData } from "./CaseData";

interface ConclusionProps {
  context: "financing" | "inCash";
  caseData: FinanceOrCashData;
}

interface InfoRowProps {
  label: string;
  value: number;
  valueClass?: string;
}

const InfoRow = ({ label, value, valueClass }: InfoRowProps) => {
  if (value !== 0)
    return (
      <div className="flex justify-between items-center">
        <span>{`- ${label}`}</span>
        <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
        <span className={valueClass}>{numeroParaReal(value)}</span>
      </div>
    );
};

export default function Conclusion({ caseData, context }: ConclusionProps) {
  const { propertyData } = useContext(propertyDataContext);

  if (caseData[context].detailedTable.length > 0)
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
            value={caseData[context].finalRow.propertyValue}
            valueClass="text-green"
          />
          <InfoRow
            label="Aplicado"
            value={caseData[context].finalRow.totalCapital}
            valueClass="text-green"
          />
          <InfoRow
            label="Dívida"
            value={caseData[context].finalRow.outstandingBalance}
            valueClass="text-red"
          />
          <InfoRow
            label="Valor Investido"
            value={
              propertyData.financingFees +
              propertyData.downPayment +
              (propertyData.personalBalance -
                (propertyData.financingFees + propertyData.downPayment))
            }
            valueClass="text-red"
          />
          <InfoRow
            label="Corretagem"
            value={caseData[context].finalRow.propertyValue * 0.06}
            valueClass="text-red"
          />
          <InfoRow
            label="Imposto Ganho de Capital"
            value={caseData[context].capitalGainsTax}
            valueClass="text-red"
          />
          <InfoRow
            label="Lucro (R$)"
            value={caseData[context].totalProfit}
            valueClass="text-green font-bold"
          />
          <div className="flex justify-between items-center">
            <span>{`- Lucro (%)`}</span>
            <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
            <span className="text-green font-bold">
              {caseData[context].totalProfitPercent.toFixed(2) + "% / "}
              {(
                caseData[context].totalProfitPercent / propertyData.finalYear
              ).toFixed(2) + "% (ano)"}
            </span>
          </div>
        </div>

        {caseData[context].breakEven !== 0 && (
          <p className="text-xs mt-5">
            *Break-even no mês <strong>{caseData[context].breakEven}</strong>
          </p>
        )}
      </Sheet>
    );
}
