/* eslint-disable @typescript-eslint/no-explicit-any */
import { toBRL } from "@/lib/formatter";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { Divider } from "@mui/joy";
import dayjs, { Dayjs } from "dayjs";
import { DraggableCard } from "./DraggableCard";
import { Resizable } from "react-resizable";
import { useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { usePageContext } from "vike-react/usePageContext";

interface DownPaymentCardProps {
  entryDetails: {
    originalDate: Dayjs;
    date: string;
    partLabel: string;
    amount: string;
    description: string;
  }[];
  propertyData: PropertyData;
  color: string;
  secondary: string;
  separateDocumentation: boolean;
  id: string;
  index: number;
  moveCard: (dragIndex: any, hoverIndex: any) => void;
  initialHeight: number;
  handleHeight?: (id: string, value: number) => void;
  type?: string;
}

export const DownPaymentCard = ({
  entryDetails,
  propertyData,
  color,
  secondary,
  separateDocumentation,
  id,
  index,
  moveCard,
  initialHeight,
  handleHeight,
  type,
}: DownPaymentCardProps) => {
  const [height, setHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const pageContext = usePageContext();
  const isProposalRoute =
    pageContext.urlPathname.includes("/proposta/") ||
    pageContext.urlPathname.includes("/portfolio/");

  const debouncedHandleHeight = useMemo(
    () =>
      debounce((height: number) => {
        handleHeight("downPaymentHeight", height);
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

  const grouped = propertyData.discharges
    .filter((i) => i.isDownPayment)
    .reduce((acc, curr) => {
      const key = curr.originalValue;
      if (!acc[key]) {
        const baseDate = dayjs(propertyData.initialDate, "MM/YYYY");
        const calculatedDate = baseDate.add(curr.initialMonth, "month");
        acc[key] = { count: 0, startDate: calculatedDate };
      }
      acc[key].count += 1;
      return acc;
    }, {} as Record<number, { count: number; startDate: dayjs.Dayjs }>);

  const groups = Object.entries(grouped).sort(([, a], [, b]) =>
    a.startDate.diff(b.startDate)
  );

  return (
    <DraggableCard
      id={id}
      index={index}
      moveCard={moveCard}
      isResizing={isResizing}
    >
      <div
        style={
          {
            "--scroll-thumb-color": color,
          } as React.CSSProperties
        }
        className="rounded-3xl p-4 pe-3 border h-min break-inside-avoid"
      >
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
          <div>
            <div
              style={{ height: height + "px" }}
              className="overflow-y-auto scrollbar "
            >
              {type === "signal" ? (
                <>
                  <h3 style={{ color }} className="text-xl mb-2">
                    Entrada total:
                  </h3>
                  <p style={{ color }} className="text-2xl font-bold mb-2">
                    {toBRL(
                      propertyData.discharges.reduce(
                        (acc, val) =>
                          val.isDownPayment ? acc + val.originalValue : 0,
                        0
                      )
                    )}
                  </p>
                  <p style={{ color: secondary }} className="text-sm mb-2">
                    - Sinal:{" "}
                    <strong style={{ color }}>
                      {toBRL(propertyData.downPayment)}
                    </strong>
                  </p>
                  <p style={{ color: secondary }} className="text-sm mb-2">
                    Entrada Parcelada:
                  </p>
                  {groups.map(([value, { count, startDate }], index) => (
                    <p
                      key={index}
                      style={{ color: secondary }}
                      className="text-sm"
                    >
                      {count}x{" "}
                      <strong style={{ color }}>{toBRL(Number(value))}</strong>
                      {groups.length > 1 && startDate ? (
                        <span style={{ marginLeft: "8px" }}>
                          • {startDate.locale("pt-br").format("MMMM [de] YYYY")}
                        </span>
                      ) : null}
                    </p>
                  ))}

                  <Divider className="!mt-2" />
                  <ul className="list-none space-y-2 mt-2">
                    {entryDetails.map((detail, i) => (
                      <li key={i} className="text-sm">
                        <span>{`${i + 1}) ${detail.date}`}</span>
                        <ul>
                          <li style={{ color: secondary }}>
                            • {detail.partLabel}{" "}
                            <strong style={{ color }}>{detail.amount}</strong>
                          </li>
                        </ul>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3 style={{ color }} className="text-xl mb-2">
                    {entryDetails.length > 1 ? "Entrada no ato:" : "Entrada"}
                  </h3>
                  <p style={{ color }} className="text-2xl font-bold mb-2">
                    {toBRL(propertyData.downPayment)}
                  </p>
                  <div>
                    {propertyData.discharges.some((d) => d.isDownPayment) && (
                      <span
                        style={{ color: secondary }}
                        className="block mt-4 mb-[5px] text-sm "
                      >
                        Entrada parcelada:
                      </span>
                    )}
                    <ul className="list-none space-y-3">
                      {propertyData.downPayment > 0 && (
                        <>
                          <ul
                            style={{ color: secondary }}
                            className="ml-1 my-1"
                          >
                            {propertyData.financingFeesDate ===
                              propertyData.initialDate &&
                              !separateDocumentation &&
                              propertyData.financingFees > 0 && (
                                <li style={{ color: secondary }}>
                                  • Documentação:{" "}
                                  <strong style={{ color }}>
                                    {toBRL(propertyData.financingFees)}
                                  </strong>
                                </li>
                              )}
                            {entryDetails
                              .filter((d) => d.description)
                              .map((detail, i) => (
                                <li key={i} style={{ color: secondary }}>
                                  • {detail.description}{" "}
                                  <strong style={{ color }}>
                                    {detail.amount}
                                  </strong>
                                </li>
                              ))}
                          </ul>
                        </>
                      )}

                      {entryDetails.map((detail, i) => {
                        const isDocumentationDate =
                          dayjs(detail.originalDate).format("MM/YYYY") ===
                          propertyData.financingFeesDate;

                        const hasDocumentation = entryDetails.some(
                          (d) =>
                            d.partLabel === "Documentação:" &&
                            isDocumentationDate
                        );

                        if (detail.description) return null;
                        if (hasDocumentation && separateDocumentation)
                          return null;

                        return (
                          <li key={i} className="text-sm">
                            <span>{`${i + 1}) ${detail.date}`}</span>
                            <ul>
                              <li style={{ color: secondary }}>
                                • {detail.partLabel}{" "}
                                <strong style={{ color }}>
                                  {detail.amount}
                                </strong>
                              </li>

                              {isDocumentationDate &&
                                !hasDocumentation &&
                                !separateDocumentation &&
                                propertyData.financingFees > 0 && (
                                  <li style={{ color: secondary }}>
                                    • Documentação:{" "}
                                    <strong style={{ color }}>
                                      {toBRL(propertyData.financingFees)}
                                    </strong>
                                  </li>
                                )}
                            </ul>
                          </li>
                        );
                      })}

                      {propertyData.financingFeesDate !==
                        propertyData.initialDate &&
                        !entryDetails.some(
                          (detail) =>
                            dayjs(detail.originalDate).format("MM/YYYY") ===
                            propertyData.financingFeesDate
                        ) && (
                          <li className="text-sm">
                            <span>
                              {dayjs(propertyData.financingFeesDate, "MM/YYYY")
                                .format("MMMM [de] YYYY")
                                .replace(/^./, (match) => match.toUpperCase())}
                            </span>
                            <ul>
                              <li style={{ color: secondary }}>
                                • Documentação:{" "}
                                <strong style={{ color }}>
                                  {toBRL(propertyData.financingFees)}
                                </strong>
                              </li>
                            </ul>
                          </li>
                        )}
                    </ul>

                    {propertyData.discharges.some((d) => d.isDownPayment) && (
                      <>
                        <Divider className="!my-4" />
                        <span
                          style={{ color: secondary }}
                          className="block text-sm"
                        >
                          Total Parcelado:{" "}
                          <strong style={{ color }}>
                            {" "}
                            {toBRL(
                              propertyData.discharges
                                .filter((d) => d.isDownPayment)
                                .reduce(
                                  (acc, val) => acc + val.originalValue,
                                  0
                                )
                            )}
                          </strong>
                        </span>
                        {propertyData.downPayment > 0 && (
                          <span
                            style={{ color: secondary }}
                            className="block mt-2 text-sm"
                          >
                            Ato + Parcelamento:{" "}
                            <strong style={{ color }}>
                              {" "}
                              {toBRL(
                                propertyData.discharges
                                  .filter((d) => d.isDownPayment)
                                  .reduce(
                                    (acc, val) => acc + val.originalValue,
                                    0
                                  ) + propertyData.downPayment
                              )}
                            </strong>
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Resizable>
      </div>
    </DraggableCard>
  );
};
