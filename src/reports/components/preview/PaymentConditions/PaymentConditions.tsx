import React, { useMemo } from "react";
import { LuCircleDollarSign } from "react-icons/lu";
import dayjs from "dayjs";
import { toBRL } from "@/lib/formatter";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import SectionTitle from "../SectionTitle";
import { DownPaymentCard } from "./DownPaymentCard";
import FinancingFeesCard from "./FinancingFeesCard";
import FinancingCard from "./FinancingCard";
import InstallmentPlanCard from "./InstallmentPlanCard";
import KeyHandoverCard from "./KeyHandoverCard";
import ConstructionInterestCard from "./ConstructionInterestCard";
import ReinforcementsCard from "./ReinforcementsCard";

interface PaymentConditionsProps {
  color: string;
  secondary: string;
  propertyData: PropertyData;
  isAdvancedMode?: boolean;
  hasBankFinancing?: boolean;
  separateDocumentation: boolean;
  groupMonthlyInstallments: boolean;
  propertyValue?: number;
  highlightSumPaymentsValues: boolean;
  config: {
    order: string[];
    downPaymentHeight: number;
    reinforcementsHeight: number;
    contructionInterestHeight: number;
  };
  handlePaymentConditionsConfig?: (payload: {
    order: string[];
    downPaymentHeight: number;
    reinforcementsHeight: number;
    contructionInterestHeight: number;
  }) => void;
}

const PaymentConditions: React.FC<PaymentConditionsProps> = ({
  color,
  secondary,
  propertyData,
  isAdvancedMode,
  hasBankFinancing = true,
  separateDocumentation,
  groupMonthlyInstallments,
  propertyValue,
  highlightSumPaymentsValues,
  config,
  handlePaymentConditionsConfig,
}) => {
  const { discharges, initialDate, downPayment, financingFees } = propertyData;

  const computeDischargeDate = (initialDate, monthsToAdd) => {
    const [month, year] = initialDate.split("/").map(Number);
    return dayjs(`${year}-${month}-01`)
      .add(monthsToAdd, "month")
      .format("MMMM [de] YYYY")
      .replace(/^./, (match) => match.toUpperCase());
  };

  const {
    entryDetails,
    reinforcementDetails,
    totalReinforcement,
    totalReinforcementParts,
    totalFinancing,
    constructionInterestDetails,
    installmentPlanDetails,
    totalInstallmentPlan,
    totalInstallmentPlanParts,
    reinforcementDischarges,
  } = useMemo(() => {
    const downPaymentDischarges = discharges.filter(
      (d) =>
        d.isDownPayment && !d.isConstructionInterest && !d.isInstallmentPlan
    );

    const reinforcementDischarges = discharges.filter(
      (d) =>
        !d.isDownPayment &&
        !d.isConstructionInterest &&
        !d.isInstallmentPlan &&
        !d.type.includes("Entrega das Chaves")
    );
    const constructionInterestDischarges = discharges.filter(
      (d) => d.isConstructionInterest
    );
    const installmentDischarges = discharges.filter((d) => d.isInstallmentPlan);

    // -------------------
    // ENTRADA (Down Payment)
    // -------------------
    let entryDetails = downPaymentDischarges
      .map((discharge, index) => ({
        originalDate: dayjs(initialDate, "MM/YYYY").add(
          discharge.month,
          "month"
        ),
        date: computeDischargeDate(initialDate, discharge.month),
        partLabel: `${index + 1}ª Parte:`,
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

    // -------------------
    // TOTAL DE FINANCIAMENTO
    // -------------------
    const totalFinancing = Math.round(
      propertyData.propertyValue -
        downPaymentDischarges.reduce((sum, d) => sum + d.originalValue, 0) -
        reinforcementDischarges.reduce((sum, d) => sum + d.originalValue, 0) -
        propertyData.downPayment -
        propertyData.subsidy
    );

    // -------------------
    // REFORÇOS
    // -------------------
    const totalReinforcement = Math.round(
      reinforcementDischarges.reduce((sum, d) => sum + d.originalValue, 0)
    );
    const totalParts = downPaymentDischarges.length + 1;

    let globalPartNumber = 1;
    let reinforcementDetails = [];

    if (groupMonthlyInstallments) {
      // Agrupando reforços mensais
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

      // Agrupando reforços que não são mensais
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

    // -------------------
    // JUROS DE OBRA
    // -------------------
    const constructionInterestDetails = constructionInterestDischarges
      .sort((a, b) => a.month - b.month)
      .map((discharge) => ({
        date: computeDischargeDate(initialDate, discharge.month),
        amount: toBRL(discharge.value),
        description: discharge.description,
      }));

    // -------------------
    // PARCELAMENTO (NOVO)
    // -------------------
    let globalInstallmentPlanNumber = 1;
    let installmentPlanDetails = [];

    if (groupMonthlyInstallments) {
      // 1) Parcelas Mensais
      const monthlyInstallments = installmentDischarges
        .filter((d) => d.type === "Mensal")
        .reduce(
          (acc, discharge) => {
            acc.amount = discharge.originalValue; // soma sempre com o último valor
            acc.totalInstallments += 1;
            return acc;
          },
          {
            date: computeDischargeDate(
              initialDate,
              installmentDischarges[0]?.month
            ),
            amount: 0,
            totalInstallments: 0,
          }
        );

      if (monthlyInstallments.totalInstallments > 0) {
        installmentPlanDetails.push(monthlyInstallments);
      }

      // 2) Parcelas que não são Mensais
      const otherInstallments = installmentDischarges
        .filter((d) => d.type !== "Mensal")
        .sort((a, b) => a.month - b.month)
        .reduce((acc, discharge) => {
          const date = computeDischargeDate(initialDate, discharge.month);
          const existingMonth = acc.find((item) => item.date === date);

          if (existingMonth) {
            existingMonth.parts.push({
              partNumber: globalInstallmentPlanNumber++,
              amount: discharge.originalValue, // armazenamos como número
            });
          } else {
            acc.push({
              date,
              parts: [
                {
                  partNumber: globalInstallmentPlanNumber++,
                  amount: discharge.originalValue,
                },
              ],
            });
          }

          return acc;
        }, []);

      installmentPlanDetails = [
        ...installmentPlanDetails,
        ...otherInstallments,
      ];
    } else {
      // Sem agrupar mensal
      installmentPlanDetails = installmentDischarges
        .sort((a, b) => a.month - b.month)
        .reduce((acc, discharge) => {
          const date = computeDischargeDate(initialDate, discharge.month);
          const existingMonth = acc.find((item) => item.date === date);

          if (existingMonth) {
            existingMonth.parts.push({
              partNumber: globalInstallmentPlanNumber++,
              amount: discharge.originalValue,
            });
          } else {
            acc.push({
              date,
              parts: [
                {
                  partNumber: globalInstallmentPlanNumber++,
                  amount: discharge.originalValue,
                },
              ],
            });
          }

          return acc;
        }, []);
    }

    const totalInstallmentPlan = Math.round(
      installmentDischarges.reduce((sum, d) => sum + d.originalValue, 0)
    );
    const totalInstallmentPlanParts = installmentDischarges.length;

    // -------------------
    // RETORNO
    // -------------------
    return {
      entryDetails,
      totalDownPayment,
      totalParts,
      reinforcementDetails,
      totalReinforcement,
      totalReinforcementParts,
      totalFinancing,
      constructionInterestDetails,
      installmentPlanDetails,
      totalInstallmentPlan,
      totalInstallmentPlanParts,
      reinforcementDischarges,
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

  const moveCard = (dragIndex, hoverIndex) => {
    const updatedOrder = [...config.order];
    const [movedItem] = updatedOrder.splice(dragIndex, 1);
    updatedOrder.splice(hoverIndex, 0, movedItem);
    if (handlePaymentConditionsConfig) {
      handlePaymentConditionsConfig({
        ...config,
        order: updatedOrder,
      });
    }
  };

  const handleHeight = (id: keyof typeof config, value: number) => {
    if (handlePaymentConditionsConfig) {
      handlePaymentConditionsConfig({
        ...config,
        [id]: value,
      });
    }
  };

  const cardComponents = {
    downPayment: (
      <DownPaymentCard
        color={color}
        secondary={secondary}
        entryDetails={entryDetails}
        propertyData={propertyData}
        separateDocumentation={separateDocumentation}
        id={"downPayment"}
        index={config.order.findIndex((c) => c === "downPayment")}
        moveCard={moveCard}
        initialHeight={config.downPaymentHeight}
        handleHeight={handleHeight}
      />
    ),
    financingFees: (
      <FinancingFeesCard
        color={color}
        secondary={secondary}
        financingFees={financingFees}
        propertyData={propertyData}
        separateDocumentation={separateDocumentation}
        id={"financingFees"}
        index={config.order.findIndex((c) => c === "financingFees")}
        moveCard={moveCard}
      />
    ),
    financing: (
      <FinancingCard
        color={color}
        secondary={secondary}
        totalFinancing={totalFinancing}
        propertyData={propertyData}
        id={"financing"}
        index={config.order.findIndex((c) => c === "financing")}
        moveCard={moveCard}
      />
    ),
    installments: (
      <InstallmentPlanCard
        color={color}
        secondary={secondary}
        groupMonthlyInstallments={groupMonthlyInstallments}
        installmentPlanDetails={installmentPlanDetails}
        totalInstallmentPlan={totalInstallmentPlan}
        totalInstallmentPlanParts={totalInstallmentPlanParts}
        id={"installments"}
        index={config.order.findIndex((c) => c === "installments")}
        moveCard={moveCard}
      />
    ),
    keyHandover: (
      <KeyHandoverCard
        color={color}
        secondary={secondary}
        discharges={discharges}
        initialDate={initialDate}
        computeDischargeDate={computeDischargeDate}
        id={"keyHandover"}
        index={config.order.findIndex((c) => c === "keyHandover")}
        moveCard={moveCard}
      />
    ),
    constructionInterest: (
      <ConstructionInterestCard
        color={color}
        secondary={secondary}
        highlightSumPaymentsValues={highlightSumPaymentsValues}
        discharges={discharges}
        constructionInterestDetails={constructionInterestDetails}
        id={"constructionInterest"}
        index={config.order.findIndex((c) => c === "constructionInterest")}
        moveCard={moveCard}
        initialHeight={config.contructionInterestHeight}
        handleHeight={handleHeight}
      />
    ),
    reinforcements: (
      <ReinforcementsCard
        id={"reinforcements"}
        index={config.order.findIndex((c) => c === "reinforcements")}
        moveCard={moveCard}
        color={color}
        secondary={secondary}
        totalReinforcementParts={totalReinforcementParts}
        highlightSumPaymentsValues={highlightSumPaymentsValues}
        totalReinforcement={totalReinforcement}
        reinforcementDetails={reinforcementDetails}
        groupMonthlyInstallments={groupMonthlyInstallments}
        discharges={reinforcementDischarges}
        initialHeight={config.reinforcementsHeight}
        handleHeight={handleHeight}
      />
    ),
  };

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
            {propertyValue !== undefined &&
            propertyValue !== null &&
            propertyValue !== propertyData.propertyValue &&
            propertyValue !== 0 ? (
              <>
                <s className="me-1">{toBRL(propertyValue)}</s>{" "}
                {toBRL(propertyData.propertyValue)}
              </>
            ) : (
              toBRL(propertyData.propertyValue)
            )}
          </b>
        </span>
      </div>
      <div
        style={{
          WebkitColumnCount: 2,
        }}
        className={`columns-2 ${columnsClass} space-y-5 gap-4`}
      >
        {config.order.map((cardId) => cardComponents[cardId])}
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
