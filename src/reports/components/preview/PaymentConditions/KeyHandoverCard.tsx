import { GiHouseKeys } from "react-icons/gi";
import { toBRL } from "@/lib/formatter";
import { DraggableCard } from "./DraggableCard";
import { Discharge } from "@/propertyData/PropertyDataDischargesControl";

const KeyHandoverCard = ({
  color,
  secondary,
  discharges,
  initialDate,
  computeDischargeDate,
  id,
  index,
  moveCard,
}) => {
  const keyHandover: Discharge = discharges.find((d) =>
    d.type?.includes("Entrega das Chaves")
  );

  if (!keyHandover) return null;

  const date = computeDischargeDate(initialDate, keyHandover.month);

  return (
    <DraggableCard id={id} index={index} moveCard={moveCard} isResizing={false}>
      <div className="relative rounded-3xl break-inside-avoid">
        <div
          style={{ borderColor: secondary }}
          className="rounded-3xl p-5 border shadow-sm"
        >
          <h3
            style={{ color }}
            className="text-lg font-semibold flex items-center gap-2 mb-2"
          >
            Entrega das Chaves{" "}
            <GiHouseKeys className="text-2xl" style={{ color }} />
          </h3>

          <p style={{ color }} className="text-3xl font-bold mb-2">
            {toBRL(keyHandover.originalValue)}
          </p>

          {keyHandover.value !== keyHandover.originalValue &&
            keyHandover.indexType && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mt-1 italic">
                  Correção baseada no índice {keyHandover.indexType} (
                  {keyHandover.indexValue} %/m)
                </p>
              </div>
            )}

          <p className="text-sm text-gray-600">
            <span className="font-medium">Data:</span>{" "}
            <span style={{ color }} className="font-medium">
              {date}
            </span>
          </p>
        </div>
      </div>
    </DraggableCard>
  );
};

export default KeyHandoverCard;
