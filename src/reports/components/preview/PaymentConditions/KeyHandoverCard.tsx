import React from "react";
import { GiHouseKeys } from "react-icons/gi";
import { toBRL } from "@/lib/formatter";
import { DraggableCard } from "./DraggableCard";

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
  const keyHandover = discharges.find((d) =>
    d.type?.includes("Entrega das Chaves")
  );

  if (!keyHandover) return null;

  const date = computeDischargeDate(initialDate, keyHandover.month);
  const value = keyHandover.originalValue;

  return (
    <DraggableCard id={id} index={index} moveCard={moveCard} isResizing={false}>
      <div className="relative rounded-3xl break-inside-avoid">
        <div
          style={{ "--scroll-thumb-color": color } as React.CSSProperties}
          className="rounded-3xl p-4 pr-2 border h-min"
        >
          <h3
            style={{ color }}
            className="text-lg flex items-center gap-2 mb-2"
          >
            Entrega das Chaves <GiHouseKeys className="text-3xl" />
          </h3>
          <p style={{ color }} className="text-2xl font-bold mb-4">
            {toBRL(value)}
          </p>
          <div className="max-h-[400px] overflow-y-auto scrollbar">
            <ul className="list-none space-y-3">
              <li className="text-sm">
                <span style={{ color: secondary }}>
                  Data: <span style={{ color }}>{date}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DraggableCard>
  );
};

export default KeyHandoverCard;
