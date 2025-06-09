import dayjs from "dayjs";
import { toBRL } from "@/lib/formatter";
import { DraggableCard } from "./DraggableCard";
import { PropertyData } from "@/propertyData/PropertyDataContext";

interface FinancingCardProps {
  color: string;
  secondary: string;
  totalFinancing: number;
  propertyData: PropertyData;
  id: string;
  index: number;
  moveCard: (dragIndex: unknown, hoverIndex: unknown) => void;
  hasBankFinancing: boolean;
}

const FinancingCard = ({
  color,
  secondary,
  totalFinancing,
  propertyData,
  id,
  index,
  moveCard,
  hasBankFinancing,
}: FinancingCardProps) => {
  if (totalFinancing < 0 || !propertyData.installmentValue || !hasBankFinancing)
    return null;

  const baseFinanced =
    (propertyData?.propertyValue || 0) -
    (propertyData?.downPayment || 0) -
    (propertyData?.discharges?.reduce?.(
      (acc, val) =>
        !val.isConstructionInterest ? acc + val.originalValue : acc,
      0
    ) || 0) -
    (propertyData?.subsidy || 0);

  const hasCorrectionRate = Number(propertyData?.financingCorrectionRate) > 0;

  return (
    <DraggableCard id={id} index={index} moveCard={moveCard} isResizing={false}>
      <div className="rounded-3xl p-4 border h-min break-inside-avoid">
        <h3 style={{ color }} className="text-xl mb-2">
          Financiamento
        </h3>

        <p className="text-2xl font-bold" style={{ color }}>
          {toBRL(baseFinanced)}
        </p>

        {hasCorrectionRate && (
          <i className="text-xs mb-4" style={{ color: secondary }}>
            {propertyData.financingCorrectionDescription}
          </i>
        )}

        <ul className="list-none space-y-2 text-sm mt-4">
          <li>
            <span style={{ color: secondary }} className="text-sm">
              Início:{" "}
            </span>
            <strong style={{ color }}>
              {dayjs(propertyData.initialFinancingMonth, "MM/YYYY")
                .format("MMMM [de] YYYY")
                .replace(/^./, (match) => match.toUpperCase())}
            </strong>
          </li>
          <li>
            <span style={{ color: secondary }} className="text-sm">
              Parcelas mensais:{" "}
            </span>
            <strong>{toBRL(propertyData.installmentValue)}</strong>{" "}
            {propertyData.amortizationType === "SAC" && "(decrescente)"}
          </li>
        </ul>
      </div>
    </DraggableCard>
  );
};

export default FinancingCard;
