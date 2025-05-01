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

  const { financingFeesDescription } = propertyData;

  let installmentsPart = "";
  let descriptionPart = "";
  if (financingFeesDescription) {
    const match = financingFeesDescription.match(
      /^(\d+x de R\$ [\d.,]+)(?: - (.*))?$/
    );
    if (match) {
      installmentsPart = match[1];
      descriptionPart = match[2] || "";
    } else {
      installmentsPart = financingFeesDescription;
    }
  }

  return (
    <DraggableCard id={id} index={index} moveCard={moveCard} isResizing={false}>
      <div className="rounded-3xl p-4 border h-min break-inside-avoid">
        <h3 style={{ color }} className="text-xl mb-2">
          Documentação
        </h3>
        <p style={{ color }} className="text-2xl font-bold">
          {toBRL(financingFees)}
        </p>
        <div className="max-h-[400px] overflow-y-auto scrollbar mt-4 text-sm">
          {installmentsPart && (
            <p className="font-medium" style={{ color: secondary }}>
              {installmentsPart}
            </p>
          )}
          {descriptionPart && (
            <p className="text-xs text-gray-500 mt-1">{descriptionPart}</p>
          )}

          {propertyData.financingFeesDate !== propertyData.initialDate &&
            !installmentsPart && (
              <ul className="list-none space-y-2 mt-4">
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
