import { toBRL } from "@/lib/formatter";
import { useMemo, useState } from "react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { DraggableCard } from "./DraggableCard";
import debounce from "lodash.debounce";
import { usePageContext } from "vike-react/usePageContext";

const ReinforcementsCard = ({
  color,
  secondary,
  totalReinforcementParts,
  highlightSumPaymentsValues,
  totalReinforcement,
  reinforcementDetails,
  groupMonthlyInstallments,
  discharges,
  id,
  index,
  moveCard,
  initialHeight,
  handleHeight,
}) => {
  const [height, setHeight] = useState(initialHeight);
  const pageContext = usePageContext();
  const isProposalRoute = pageContext.urlPathname.includes("/proposta/");
  const [isResizing, setIsResizing] = useState(false);
  const isOnlyMonthly = discharges.every((detail) => detail.type === "Mensal");
  const isOnlyAnnual = discharges.every((detail) => detail.type === "Anual");

  let title = "Reforços";
  if (isOnlyMonthly) title = "Reforços Mensais";
  else if (isOnlyAnnual) title = "Reforços Anuais";

  const showSummaryFormat =
    groupMonthlyInstallments &&
    reinforcementDetails.length === 1 &&
    reinforcementDetails[0]?.totalInstallments;

  const debouncedHandleHeight = useMemo(
    () =>
      debounce((height: number) => {
        handleHeight("reinforcementsHeight", height);
      }, 200),
    [handleHeight]
  );

  const handleResize = (_, { size }) => {
    setHeight(size.height);
    debouncedHandleHeight(size.height);
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  if (discharges.length === 0) return null;

  return (
    <DraggableCard
      id={id}
      index={index}
      moveCard={moveCard}
      isResizing={isResizing}
    >
      <div
        style={{ "--scroll-thumb-color": color } as React.CSSProperties}
        className="relative rounded-3xl break-inside-avoid"
      >
        <Resizable
          height={height}
          width={Infinity}
          axis="y"
          minConstraints={[10, 20]}
          onResize={handleResize}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          resizeHandles={isProposalRoute ? [] : ["s"]}
        >
          <div className="rounded-3xl p-4 pr-2 border h-min">
            <h3 style={{ color }} className="text-xl mb-2">
              {title} {!showSummaryFormat && `(${totalReinforcementParts}x)`}
            </h3>

            {showSummaryFormat ? (
              <p style={{ color }} className="text-lg mb-2">
                {reinforcementDetails[0].totalInstallments}x de{" "}
                <strong style={{ color }} className="font-bold text-xl">
                  {toBRL(reinforcementDetails[0].amount)}
                </strong>
                <p className="!text-sm mt-3" style={{ color: secondary }}>
                  Início em {reinforcementDetails[0].date}
                </p>
              </p>
            ) : (
              highlightSumPaymentsValues && (
                <p style={{ color }} className="text-2xl font-bold mb-4">
                  {toBRL(totalReinforcement)}
                </p>
              )
            )}

            <div
              style={{ height: height + "px" }}
              className="overflow-y-auto scrollbar"
            >
              <ul className="list-none space-y-3">
                {reinforcementDetails.map((detail, i) => (
                  <li key={i} className="text-sm">
                    {detail.totalInstallments && groupMonthlyInstallments ? (
                      <ul style={{ color: secondary }} className="ml-1">
                        <li>
                          • Parcelas mensais ({detail.totalInstallments}x):{" "}
                          <strong style={{ color }}>
                            {toBRL(detail.amount)}
                          </strong>
                        </li>
                      </ul>
                    ) : (
                      <>
                        <span style={{ color }}>
                          {i + 1}) {detail.date}
                        </span>
                        <ul style={{ color: secondary }} className="ml-1">
                          {detail.parts?.map((part, j) => (
                            <li key={j}>
                              • {part.partNumber}ª Parte:{" "}
                              <strong style={{ color }}>{part.amount}</strong>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Resizable>
      </div>
    </DraggableCard>
  );
};

export default ReinforcementsCard;
