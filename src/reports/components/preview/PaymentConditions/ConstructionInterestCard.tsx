import { toBRL } from "@/lib/formatter";
import { DraggableCard } from "./DraggableCard";
import { Resizable } from "react-resizable";
import { useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { usePageContext } from "vike-react/usePageContext";

const ConstructionInterestCard = ({
  color,
  secondary,
  highlightSumPaymentsValues,
  discharges,
  constructionInterestDetails,
  id,
  index,
  moveCard,
  initialHeight,
  handleHeight,
}) => {
  const [height, setHeight] = useState(initialHeight);
  const pageContext = usePageContext();
  const isProposalRoute =
    pageContext.urlPathname.includes("/proposta/") ||
    pageContext.urlPathname.includes("/portfolio/");
  const debouncedHandleHeight = useMemo(
    () =>
      debounce((height: number) => {
        handleHeight("contructionInterestHeight", height);
      }, 200),
    [handleHeight]
  );

  const handleResize = (_, { size }) => {
    setHeight(size.height);
    debouncedHandleHeight(size.height);
  };
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  if (constructionInterestDetails.length === 0) return null;

  return (
    <DraggableCard
      isResizing={isResizing}
      id={id}
      index={index}
      moveCard={moveCard}
    >
      <div className="relative rounded-3xl break-inside-avoid">
        <div className="rounded-3xl p-4 pr-2 border h-min">
          <h3 style={{ color }} className="text-xl mb-2">
            Evolução de Obra
          </h3>
          {highlightSumPaymentsValues && (
            <p style={{ color }} className="text-2xl font-bold mb-4">
              {toBRL(
                discharges.reduce(
                  (acc, val) =>
                    val.isConstructionInterest ? acc + val.value : acc,
                  0
                )
              )}
            </p>
          )}
          <Resizable
            height={height}
            width={Infinity}
            axis="y"
            minConstraints={[100, 20]}
            onResize={handleResize}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
            resizeHandles={isProposalRoute ? [] : ["s"]}
          >
            <div
              style={
                {
                  "--scroll-thumb-color": color,
                  height: height + "px",
                } as React.CSSProperties
              }
              className=" overflow-y-auto scrollbar"
            >
              <ul className="list-none space-y-3">
                {constructionInterestDetails.map((interest, k) => (
                  <li key={`interest-${k}`} className="text-sm">
                    <span style={{ color: secondary }}>
                      {k + 1}) {interest.date}
                    </span>
                    <ul style={{ color: secondary }} className="ml-1">
                      <li>
                        • <strong style={{ color }}>{interest.amount}</strong>
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </Resizable>
        </div>
      </div>
    </DraggableCard>
  );
};
export default ConstructionInterestCard;
