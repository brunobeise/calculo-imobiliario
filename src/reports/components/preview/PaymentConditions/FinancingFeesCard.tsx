import dayjs from "dayjs";
import { toBRL } from "@/lib/formatter";
import { DraggableCard } from "./DraggableCard";

const FinancingFeesCard = ({
  color,
  secondary,
  financingFees,
  propertyData,
  separateDocumentation,
  id,
  index,
  moveCard,
}) => {
  if (!separateDocumentation || financingFees === 0) return null;
  return (
    <DraggableCard
      id={id}
      index={index}
      moveCard={moveCard}
      isResizing={false}
    >
      <div className="rounded-3xl p-4 border h-min break-inside-avoid">
        <h3 style={{ color }} className="text-xl mb-2">
          Documentação
        </h3>
        <p style={{ color }} className="text-2xl font-bold">
          {toBRL(financingFees)}
        </p>
        <div className="max-h-[400px] overflow-y-auto scrollbar">
          {propertyData.financingFeesDate !== propertyData.initialDate && (
            <ul className="list-none space-y-2 text-sm mt-4">
              <span style={{ color: secondary }}>Data do pagamento:</span>
              <li>
                <strong>
                  {dayjs(propertyData.financingFeesDate, "MM/YYYY")
                    .format("MMMM [de] YYYY")
                    .replace(/^./, (match) => match.toUpperCase())}
                </strong>
              </li>
            </ul>
          )}
        </div>
      </div>
    </DraggableCard>
  );
};

export default FinancingFeesCard;
