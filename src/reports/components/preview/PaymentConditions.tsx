import React, { useMemo } from "react";
import { LuCircleDollarSign } from "react-icons/lu";
import dayjs from "dayjs";
import { toBRL } from "@/lib/formatter";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import SectionTitle from "./SectionTitle";

interface PaymentConditionsProps {
  color: string;
  secondary: string;
  propertyData: PropertyData;
  isAdvancedMode?: boolean;
  hasBankFinancing?: boolean;
  separateDocumentation: boolean;
  groupMonthlyInstallments: boolean;
}

const PaymentConditions: React.FC<PaymentConditionsProps> = ({
  color,
  secondary,
  propertyData,
  isAdvancedMode,
  hasBankFinancing = true,
  separateDocumentation,
  groupMonthlyInstallments,
}) => {
  const { discharges, initialDate, downPayment, financingFees } = propertyData;

  const {
    entryDetails,
    totalDownPayment,
    totalParts,
    reinforcementDetails,
    totalReinforcement,
    totalReinforcementParts,
    totalFinancing,
    constructionInterestDetails,
  } = useMemo(() => {
    const downPaymentDischarges = discharges.filter(
      (d) => d.isDownPayment && !d.isConstructionInterest
    );
    const reinforcementDischarges = discharges.filter(
      (d) => !d.isDownPayment && !d.isConstructionInterest
    );
    const constructionInterestDischarges = discharges.filter(
      (d) => d.isConstructionInterest
    );

    const computeDischargeDate = (initialDate, monthsToAdd) => {
      const [month, year] = initialDate.split("/").map(Number);
      return dayjs(`${year}-${month}-01`)
        .add(monthsToAdd, "month")
        .format("MMMM [de] YYYY")
        .replace(/^./, (match) => match.toUpperCase());
    };

    let entryDetails = downPaymentDischarges
      .map((discharge, index) => ({
        originalDate: dayjs(initialDate, "MM/YYYY").add(
          discharge.month,
          "month"
        ),
        date: computeDischargeDate(initialDate, discharge.month),
        partLabel: `${index + 2}ª Parte:`,
        amount: toBRL(discharge.originalValue),
        description: discharge.description,
      }))
      .sort((a, b) => (a.originalDate.isBefore(b.originalDate) ? -1 : 1));

    if (
      propertyData.financingFeesDate !== propertyData.initialDate &&
      !entryDetails.some(
        (detail) =>
          dayjs(detail.originalDate).format("MM/YYYY") ===
          propertyData.financingFeesDate
      )
    ) {
      entryDetails.push({
        originalDate: dayjs(propertyData.financingFeesDate, "MM/YYYY"),
        date: dayjs(propertyData.financingFeesDate, "MM/YYYY")
          .format("MMMM [de] YYYY")
          .replace(/^./, (match) => match.toUpperCase()),
        partLabel: "Documentação:",
        amount: toBRL(financingFees),
        description: "",
      });
    }

    entryDetails = entryDetails.sort((a, b) =>
      a.originalDate.isBefore(b.originalDate) ? -1 : 1
    );

    const totalDownPayment =
      downPayment +
      financingFees +
      downPaymentDischarges.reduce((sum, d) => sum + d.originalValue, 0);

    const totalFinancing = Math.round(
      propertyData.propertyValue -
        downPaymentDischarges.reduce((sum, d) => sum + d.originalValue, 0) -
        reinforcementDischarges.reduce((sum, d) => sum + d.originalValue, 0) -
        propertyData.downPayment -
        propertyData.subsidy
    );

    const totalReinforcement = Math.round(
      reinforcementDischarges.reduce((sum, d) => sum + d.originalValue, 0)
    );

    const totalParts = downPaymentDischarges.length + 1;

    let globalPartNumber = 1;
    let reinforcementDetails = [];

    if (groupMonthlyInstallments) {
      const monthlyInstallments = reinforcementDischarges
        .filter((d) => d.type === "Mensal")
        .reduce(
          (acc, discharge) => {
            acc.amount = discharge.originalValue;
            acc.totalInstallments += 1;
            return acc;
          },
          {
            date: computeDischargeDate(
              initialDate,
              reinforcementDischarges[0]?.month
            ),
            amount: 0,
            totalInstallments: 0,
          }
        );

      if (monthlyInstallments.totalInstallments > 0) {
        reinforcementDetails.push(monthlyInstallments);
      }

      const otherInstallments = reinforcementDischarges
        .filter((d) => d.type !== "Mensal")
        .sort((a, b) => a.month - b.month)
        .reduce((acc, discharge) => {
          const date = computeDischargeDate(initialDate, discharge.month);
          const existingMonth = acc.find((item) => item.date === date);

          if (existingMonth) {
            existingMonth.parts.push({
              partNumber: globalPartNumber++,
              amount: toBRL(discharge.originalValue),
            });
          } else {
            acc.push({
              date,
              parts: [
                {
                  partNumber: globalPartNumber++,
                  amount: toBRL(discharge.originalValue),
                },
              ],
            });
          }

          return acc;
        }, []);

      reinforcementDetails = [...reinforcementDetails, ...otherInstallments];
    } else {
      reinforcementDetails = reinforcementDischarges
        .sort((a, b) => a.month - b.month)
        .reduce((acc, discharge) => {
          const date = computeDischargeDate(initialDate, discharge.month);
          const existingMonth = acc.find((item) => item.date === date);

          if (existingMonth) {
            existingMonth.parts.push({
              partNumber: globalPartNumber++,
              amount: toBRL(discharge.originalValue),
            });
          } else {
            acc.push({
              date,
              parts: [
                {
                  partNumber: globalPartNumber++,
                  amount: toBRL(discharge.originalValue),
                },
              ],
            });
          }

          return acc;
        }, []);
    }

    const totalReinforcementParts = reinforcementDischarges.length;

    // 🆕 Criando array de juros de obra (Construction Interest)
    const constructionInterestDetails = constructionInterestDischarges
      .sort((a, b) => a.month - b.month)
      .map((discharge) => ({
        date: computeDischargeDate(initialDate, discharge.month),
        amount: toBRL(discharge.value),
        description: discharge.description,
      }));

    return {
      entryDetails,
      totalDownPayment,
      totalParts,
      reinforcementDetails,
      totalReinforcement,
      totalReinforcementParts,
      totalFinancing,
      constructionInterestDetails,
    };
  }, [
    discharges,
    propertyData.financingFeesDate,
    propertyData.initialDate,
    propertyData.propertyValue,
    propertyData.downPayment,
    propertyData.subsidy,
    downPayment,
    financingFees,
    groupMonthlyInstallments,
    initialDate,
  ]);

  const DownPaymentCard = () => (
    <div className="rounded-3xl p-4 border h-min">
      <h3 style={{ color }} className="text-xl mb-2">
        Entrada ({totalParts}x)
      </h3>
      <p style={{ color }} className="text-2xl font-bold mb-4">
        {toBRL(
          separateDocumentation
            ? totalDownPayment - financingFees
            : totalDownPayment
        )}
      </p>
      <div className="max-h-[400px] overflow-y-auto scrollbar ">
        <ul className="list-none space-y-3 ">
          <li className="text-sm">
            <span style={{ color: color }}>
              1){" "}
              {dayjs(initialDate, "MM/YYYY")
                .format("MMMM [de] YYYY")
                .replace(/^./, (match) => match.toUpperCase())}
            </span>
            <ul style={{ color: secondary }} className="ml-1 my-1">
              {propertyData.downPayment > 0 && (
                <li>
                  • 1ª Parte:{" "}
                  <strong style={{ color }}>{toBRL(downPayment)}</strong>
                </li>
              )}

              {propertyData.financingFeesDate === propertyData.initialDate &&
                !separateDocumentation &&
                financingFees > 0 && (
                  <li style={{ color: secondary }}>
                    • Documentação:{" "}
                    <strong style={{ color }}>{toBRL(financingFees)}</strong>
                  </li>
                )}
              {entryDetails
                .filter((d) => d.description)
                .map((detail, i) => (
                  <li key={i} style={{ color: secondary }}>
                    • {detail.description}{" "}
                    <strong style={{ color }}>{detail.amount}</strong>
                  </li>
                ))}
            </ul>
          </li>

          {entryDetails.map((detail, i) => {
            const isDocumentationDate =
              dayjs(detail.originalDate).format("MM/YYYY") ===
              propertyData.financingFeesDate;

            const hasDocumentation = entryDetails.some(
              (d) => d.partLabel === "Documentação:" && isDocumentationDate
            );

            if (detail.description) return null;
            if (hasDocumentation && separateDocumentation) return null;

            return (
              <li key={i} className="text-sm">
                <span>{`${i + 2}) ${detail.date}`}</span>
                <ul>
                  <li style={{ color: secondary }}>
                    • {detail.partLabel}{" "}
                    <strong style={{ color }}>{detail.amount}</strong>
                  </li>

                  {isDocumentationDate &&
                    !hasDocumentation &&
                    !separateDocumentation &&
                    financingFees > 0 && (
                      <li style={{ color: secondary }}>
                        • Documentação:{" "}
                        <strong style={{ color }}>
                          {toBRL(financingFees)}
                        </strong>
                      </li>
                    )}
                </ul>
              </li>
            );
          })}

          {propertyData.financingFeesDate !== propertyData.initialDate &&
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
                    <strong style={{ color }}>{toBRL(financingFees)}</strong>
                  </li>
                </ul>
              </li>
            )}
        </ul>
      </div>
    </div>
  );

  const FinancingFeesCard = () => (
    <div className="rounded-3xl p-4 border h-min">
      <h3 style={{ color }} className="text-xl mb-2">
        Documentação
      </h3>
      <p style={{ color }} className="text-2xl font-bold ">
        {toBRL(financingFees)}
      </p>
      <div className="max-h-[400px] overflow-y-auto scrollbar ">
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
  );

  const FinancingCard = () => (
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
            {" "}
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
  );

  const ReinforcementsCard = () => (
    <div className="!overflow-hidden relative rounded-3xl break-inside-avoid">
      <div
        style={
          {
            "--scroll-thumb-color": color,
          } as React.CSSProperties
        }
        className="rounded-3xl p-4 pr-2 border h-min "
      >
        <h3 style={{ color }} className="text-xl mb-2">
          {hasBankFinancing ? "Reforços" : "Parcelamento"} (
          {totalReinforcementParts}x)
        </h3>
        <p style={{ color }} className="text-2xl font-bold mb-4">
          {toBRL(totalReinforcement)}
        </p>
        <div className="max-h-[400px] overflow-y-auto scrollbar ">
          <ul className="list-none space-y-3">
            {reinforcementDetails.map((detail, i) => (
              <li key={i} className="text-sm">
                {detail.totalInstallments && groupMonthlyInstallments ? (
                  <ul style={{ color: secondary }} className="ml-1">
                    <li>
                      • Parcelas mensais ({detail.totalInstallments}x):{" "}
                      <strong style={{ color }}>{toBRL(detail.amount)}</strong>
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
    </div>
  );

  const ConstructionInterestCard = () => (
    <div className="!overflow-hidden relative rounded-3xl">
      <div
        style={
          {
            "--scroll-thumb-color": color,
          } as React.CSSProperties
        }
        className="rounded-3xl p-4 pr-2 border h-min "
      >
        <h3 style={{ color }} className="text-xl mb-2">
          Juros de Obra
        </h3>
        <p style={{ color }} className="text-2xl font-bold mb-4">
          {toBRL(
            discharges.reduce(
              (acc, val) =>
                val.isConstructionInterest ? acc + val.value : acc,
              0
            )
          )}
        </p>
        <div className="max-h-[400px] overflow-y-auto scrollbar ">
          <ul className="list-none space-y-3">
            {constructionInterestDetails.length > 0 && (
              <>
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
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  const cards = useMemo(() => {
    let count = 0;

    count++;
    if (separateDocumentation && financingFees > 0) count++;
    if (totalReinforcementParts > 0 && hasBankFinancing) count++;
    if (totalReinforcementParts > 0) count++;
    if (discharges.some((d) => d.isConstructionInterest)) count++;

    return count;
  }, [
    separateDocumentation,
    totalReinforcementParts,
    financingFees,
    hasBankFinancing,
    discharges,
  ]);

  const columnsClass = useMemo(() => {
    if (cards >= 3) return "lg:columns-3";
    if (cards === 2) return "lg:columns-2";
    return "columns-1";
  }, [cards]);

  return (
    <div style={{ color }} className="p-3 px-8">
      <SectionTitle
        color={color}
        secondary={secondary}
        icon={<LuCircleDollarSign />}
        title="Condição de Pagamento"
      />
      <div className="text-xl mb-6">
        <span>
          Valor do imóvel:{" "}
          <b style={{ color: color }} className="font-bold">
            {toBRL(propertyData.propertyValue)}
          </b>
        </span>
      </div>
      <div className={`columns-2 ${columnsClass} space-y-5 gap-4 `}>
        <DownPaymentCard />
        {separateDocumentation && financingFees > 0 && <FinancingFeesCard />}

        {totalReinforcementParts > 0 && hasBankFinancing && <FinancingCard />}

        {totalReinforcementParts > 0 && <ReinforcementsCard />}

        {discharges.filter((d) => d.isConstructionInterest).length > 0 && (
          <ConstructionInterestCard />
        )}
      </div>

      {isAdvancedMode && (
        <div className="mt-6 text-xs">
          {Object.entries(
            discharges.reduce(
              (
                acc: { [key: string]: { types: Set<string>; value: number } },
                discharge
              ) => {
                if (
                  discharge.indexType &&
                  discharge.indexValue &&
                  discharge.type.toLowerCase() !== "aporte único"
                ) {
                  const key = `${discharge.indexType} - ${discharge.indexValue}`;
                  if (!acc[key])
                    acc[key] = {
                      types: new Set(),
                      value: discharge.indexValue,
                    };
                  acc[key].types.add(discharge.type.toLowerCase());
                }
                return acc;
              },
              {}
            )
          ).map(([key, { types, value }], i) => (
            <p key={i} className="text-grayText">
              *Os aportes{" "}
              {Array.from(types)
                .map((type) => {
                  const lastLetter = type.slice(-1);
                  switch (lastLetter) {
                    case "l":
                      return type.slice(0, -1) + "is";
                    case "r":
                      return type.slice(0, -1) + "res";
                    case "s":
                      return type;
                    default:
                      return type + "s";
                  }
                })
                .join(", ")}{" "}
              serão ajustados à taxa de {key} (cons. {value}% / mês).
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentConditions;
