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
}

const PaymentConditions: React.FC<PaymentConditionsProps> = ({
  color,
  secondary,
  propertyData,
  isAdvancedMode,
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
  } = useMemo(() => {
    const downPaymentDischarges = discharges.filter((d) => d.isDownPayment);
    const reinforcementDischarges = discharges.filter((d) => !d.isDownPayment);

    const computeDischargeDate = (initialDate: string, monthsToAdd: number) => {
      const [month, year] = initialDate.split("/").map(Number);
      return dayjs(`${year}-${month}-01`)
        .add(monthsToAdd, "month")
        .format("MMMM [de] YYYY")
        .replace(/^./, (match) => match.toUpperCase());
    };

    const entryDetails = downPaymentDischarges.map((discharge, index) => ({
      date: computeDischargeDate(initialDate, discharge.month),
      partLabel: `${index + 2}ª Parte:`,
      amount: toBRL(discharge.originalValue),
    }));

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

    const totalReinforcement = Math.round( reinforcementDischarges.reduce(
      (sum, d) => sum + d.originalValue,
      0
    ))

    const totalParts = downPaymentDischarges.length + 1;

    let globalPartNumber = 1;

    const reinforcementDetails = reinforcementDischarges
      .sort((a, b) => a.month - b.month)
      .reduce(
        (
          acc: {
            date: string;
            parts: { partNumber: number; amount: string }[];
          }[],
          discharge
        ) => {
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
        },
        []
      );

    const totalReinforcementParts = reinforcementDischarges.length;

    return {
      entryDetails,
      totalDownPayment,
      totalParts,
      reinforcementDetails,
      totalReinforcement,
      totalReinforcementParts,
      totalFinancing,
    };
  }, [
    discharges,
    downPayment,
    financingFees,
    propertyData.propertyValue,
    propertyData.downPayment,
    propertyData.subsidy,
    initialDate,
  ]);

  return (
    <div style={{ color }} className="p-3 px-8">
      <SectionTitle
        color={color}
        secondary={secondary}
        icon={<LuCircleDollarSign />}
        title="Condição de Pagamento"
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 palce-items-center">
        <div className="gap-3 flex flex-col">
          <div className="rounded-3xl p-4 border h-min">
            <h3 style={{ color }} className="text-xl mb-2">
              Entrada ({totalParts}x)
            </h3>
            <p style={{ color }} className="text-2xl font-bold mb-4">
              {toBRL(totalDownPayment)}
            </p>
            <ul className="list-none space-y-3">
              <li className="text-sm">
                <span style={{ color: color }}>
                  1){" "}
                  {dayjs(initialDate, "MM/YYYY")
                    .format("MMMM [de] YYYY")
                    .replace(/^./, (match) => match.toUpperCase())}
                </span>
                <ul style={{ color: secondary }} className="ml-1 my-1">
                  <li>
                    • 1ª Parte:{" "}
                    <strong style={{ color }}>{toBRL(downPayment)}</strong>
                  </li>
                  <li className="mt-1">
                    • Documentação:{" "}
                    <strong style={{ color }}>{toBRL(financingFees)}</strong>
                  </li>
                </ul>
              </li>
              {entryDetails.map((detail, i) => (
                <li key={i} className="text-sm">
                  <span>
                    {i + 2}) {detail.date}
                  </span>
                  <ul>
                    <li style={{ color: secondary }}>
                      • {detail.partLabel}{" "}
                      <strong style={{ color }}>{detail.amount}</strong>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          {totalReinforcementParts > 0 && (
            <div className="rounded-3xl p-4 border h-min lg:invisible">
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
                  {propertyData.amortizationType === "SAC"
                    ? "(decrescente)"
                    : ""}
                </li>
              </ul>
            </div>
          )}
        </div>

        {totalReinforcementParts > 0 && (
          <>
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
                  Reforços ({totalReinforcementParts}x)
                </h3>
                <p style={{ color }} className="text-2xl font-bold mb-4">
                  {toBRL(totalReinforcement)}
                </p>
                <div className="max-h-[400px] overflow-y-auto scrollbar ">
                  <ul className="list-none space-y-3">
                    {reinforcementDetails.map((detail, i) => (
                      <li key={i} className="text-sm">
                        <span style={{ color }}>
                          {i + 1}) {detail.date}
                        </span>
                        <ul style={{ color: secondary }} className="ml-1">
                          {detail.parts.map((part, j) => (
                            <li key={j}>
                              • {part.partNumber}ª Parte:{" "}
                              <strong style={{ color }}>{part.amount}</strong>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        <div
          className={`rounded-3xl p-4 border h-min  ${
            totalReinforcementParts > 0 ? "hidden lg:block" : ""
          }`}
        >
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
                Parcelas mensais:{"  "}
              </span>
              <strong>{toBRL(propertyData.installmentValue)}</strong>{" "}
              {propertyData.amortizationType === "SAC" ? "(decrescente)" : ""}
            </li>
          </ul>
        </div>
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
                  discharge.indexType && // Só considera se houver indexType
                  discharge.indexValue && // Só considera se houver indexValue
                  discharge.type.toLowerCase() !== "aporte único" // Ignora "aporte único"
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
