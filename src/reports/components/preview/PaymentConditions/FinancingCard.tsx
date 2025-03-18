import dayjs from "dayjs";
import { toBRL } from "@/lib/formatter";
import { DraggableCard } from "./DraggableCard";

const FinancingCard = ({
  color,
  secondary,
  totalFinancing,
  propertyData,
  id,
  index,
  moveCard,
}) => {
  if (totalFinancing < 0 || !propertyData.installmentValue) return null;
  return (
    <DraggableCard id={id} index={index} moveCard={moveCard} isResizing={false}>
      <div className="rounded-3xl p-4 border h-min break-inside-avoid">
        <h3 style={{ color }} className="text-xl mb-2">
          Financiamento
        </h3>
        <p style={{ color }} className="text-2xl font-bold mb-4">
          {toBRL(totalFinancing)}
        </p>
        <ul className="list-none space-y-2 text-sm">
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
            <strong>{toBRL(propertyData.installmentValue)}</strong>
            {propertyData.amortizationType === "SAC" ? "(decrescente)" : ""}
          </li>
        </ul>
      </div>
    </DraggableCard>
  );
};

export default FinancingCard;
