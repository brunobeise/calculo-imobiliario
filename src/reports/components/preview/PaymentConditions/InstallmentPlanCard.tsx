import React from "react";
import { toBRL } from "@/lib/formatter";
import { DraggableCard } from "./DraggableCard";

const InstallmentPlanCard = ({
  color,
  secondary,
  groupMonthlyInstallments,
  installmentPlanDetails,
  totalInstallmentPlan,
  totalInstallmentPlanParts,
  id,
  index,
  moveCard,
}) => {
  const onlyMonthlyInstallments =
    groupMonthlyInstallments &&
    installmentPlanDetails.length === 1 &&
    installmentPlanDetails[0]?.totalInstallments;

  if (totalInstallmentPlanParts === 0) return null;

  const showDatePerLine = installmentPlanDetails.length > 1;

  return (
    <DraggableCard id={id} index={index} moveCard={moveCard} isResizing={false}>
      <div className="relative rounded-3xl break-inside-avoid">
        <div
          style={{ "--scroll-thumb-color": color } as React.CSSProperties}
          className="rounded-3xl p-4 pr-2 border h-min"
        >
          <h3 style={{ color }} className="text-xl mb-2">
            Parcelamento
            {!onlyMonthlyInstallments && ` (${totalInstallmentPlanParts}x)`}
          </h3>

          {onlyMonthlyInstallments ? (
            <p style={{ color }} className="text-lg mb-2">
              {installmentPlanDetails[0].totalInstallments}x de{" "}
              <strong style={{ color }} className="font-bold text-xl">
                {toBRL(installmentPlanDetails[0].amount)}
              </strong>
              <p className="!text-sm mt-3" style={{ color: secondary }}>
                Início em {installmentPlanDetails[0].date}
              </p>
            </p>
          ) : (
            <p style={{ color }} className="text-2xl font-bold mb-4">
              {toBRL(totalInstallmentPlan)}
            </p>
          )}

          <div className="max-h-[400px] overflow-y-auto scrollbar">
            <ul className="list-none space-y-3">
              {installmentPlanDetails.map((detail, i) => (
                <li key={i} className="text-sm">
                  {detail.totalInstallments && groupMonthlyInstallments ? (
                    <>
                      {!onlyMonthlyInstallments && (
                        <ul style={{ color: secondary }} className="ml-1">
                          <li>
                            • Parcelas mensais ({detail.totalInstallments}x):{" "}
                            <strong style={{ color }}>
                              {toBRL(detail.amount)}
                            </strong>
                            {showDatePerLine && (
                              <span
                                className="block text-xs mt-1"
                                style={{ color: secondary }}
                              >
                                Início:{" "}
                                <span style={{ color }}>{detail.date}</span>
                              </span>
                            )}
                          </li>
                        </ul>
                      )}
                    </>
                  ) : (
                    <>
                      {showDatePerLine && (
                        <span
                          className="block text-sm font-medium mb-1"
                          style={{ color }}
                        >
                          {detail.date}
                        </span>
                      )}
                      <ul style={{ color: secondary }} className="ml-1">
                        {detail.parts?.map((part, j) => (
                          <li key={j}>
                            • {part.partNumber}ª Parcela:{" "}
                            <strong style={{ color }}>
                              {toBRL(part.amount)}
                            </strong>
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
      </div>
    </DraggableCard>
  );
};

export default InstallmentPlanCard;
