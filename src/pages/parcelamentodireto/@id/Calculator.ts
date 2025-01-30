import { PropertyData } from "@/propertyData/PropertyDataContext";
import { calcPropertyValuation, calcRentValue } from "@/lib/calcs";
import { DirectFinancingDetailedTable } from "./CaseData";
import dayjs from "dayjs";

export function calcCaseData(propertyData: PropertyData) {
  const detailedTable = calcDetailedTable(propertyData);

  const isFinancingFeesInitial =
    propertyData.financingFeesDate === propertyData.initialDate;

  const totalInvestment =
    propertyData.downPayment +
    (isFinancingFeesInitial ? propertyData.financingFees : 0) +
    detailedTable.reduce(
      (acc, val) => acc + val.investmentExcessPresentValue,
      0
    ) -
    propertyData.subsidy;

  const capitalGainsTax = calcCapitalGainsTax(
    detailedTable.reduce((acc, val) => acc + val.investmentExcess, 0) -
      propertyData.subsidy,
    propertyData
  );
  const totalProfit = calcTotalProfit(
    detailedTable,
    totalInvestment,
    capitalGainsTax
  );

  console.log(detailedTable[detailedTable.length - 1]);

  return {
    totalInvestment:
      propertyData.downPayment +
      (isFinancingFeesInitial ? propertyData.financingFees : 0) +
      detailedTable[detailedTable.length - 1].rentalShortfall -
      propertyData.subsidy,
    investedEquity: 0,
    totalProfit: totalProfit.value,
    totalProfitPercent: totalProfit.percent,
    totalFinalEquity: totalProfit.finalEquity,
    investedEquityFinal: calcInvestedEquityFinal(detailedTable, propertyData),
    totalRentalShortfall:
      detailedTable[detailedTable.length - 1].rentalShortfall,
    capitalGainsTax,
    detailedTable,
    finalRow: detailedTable[detailedTable.length - 1],
    investedEquityPresentValue: calcInvestedEquityPresentValue(
      propertyData,
      detailedTable
    ),
    brokerageFee:
      (detailedTable[detailedTable.length - 1].propertyValue *
        propertyData.brokerageFee) /
      100,
  };
}

export function calcTotalProfit(
  detailedTable: DirectFinancingDetailedTable[],
  investedEquityPresentValue: number,
  capitalGainsTax: number,
  row?: number
) {
  const finalRow = row
    ? detailedTable[row]
    : detailedTable[detailedTable.length - 1];
  const totalEquity = finalRow.finalValue;
  const operationProfitAmount = finalRow.monthlyProfit - capitalGainsTax;

  const operationProfitPercent =
    (operationProfitAmount / investedEquityPresentValue) * 100;

  return {
    value: operationProfitAmount,
    percent: operationProfitPercent,
    finalEquity: totalEquity,
  };
}

export function calcInvestedEquityPresentValue(
  propertyData: PropertyData,
  detailedTable: DirectFinancingDetailedTable[]
) {
  const isFinancingFeesInitial = dayjs(
    propertyData.financingFeesDate,
    "MM/YYYY"
  ).isSame(dayjs(propertyData.initialDate, "MM/YYYY"));

  const investmentExcessVpSum = detailedTable.reduce(
    (acc, val) => acc + val.investmentExcessPresentValue,
    0
  );

  return (
    propertyData.downPayment +
    (isFinancingFeesInitial ? propertyData.financingFees : 0) +
    investmentExcessVpSum
  );
}

export function calcInvestedEquityFinal(
  detailedTable: DirectFinancingDetailedTable[],
  propertyData: PropertyData,
  month = propertyData.finalYear * 12
) {
  if (month > 0 && month <= detailedTable.length) {
    const rowForMonth = detailedTable[month - 1];

    return (
      rowForMonth.finalValue -
      rowForMonth.propertyValue +
      rowForMonth.outstandingBalance
    );
  } else {
    console.error("Month specified is out of range.");
    return 0;
  }
}

// export function calcBreakEvenPoint(
//   detailedTable: DirectFinancingDetailedTable[]
// ) {
//   let breakEvenPoint = 0;
//   const initialCapital = detailedTable[0].initialCapital;

//   for (const [index, row] of detailedTable.entries()) {
//     if (row.initialCapital - initialCapital > row.outstandingBalance) {
//       breakEvenPoint = index + 1;
//       break;
//     }
//   }

//   return breakEvenPoint;
// }

export function calcCapitalGainsTax(
  totalInvestment: number, // Total investido ao longo do período
  propertyData: PropertyData
) {
  if (!propertyData.considerCapitalGainsTax) return 0;

  // Valor final do imóvel após valorização
  const appreciatedPropertyValue = calcPropertyValuation(
    propertyData.propertyValue,
    propertyData.propertyAppreciationRate,
    propertyData.finalYear
  );

  // Cálculo do lucro bruto (ganho de capital)
  const capitalGain =
    appreciatedPropertyValue - (propertyData.propertyValue + totalInvestment);

  // Imposto de ganho de capital (15% do lucro bruto)
  return Math.max(capitalGain * 0.15, 0);
}

export function calcDetailedTable(propertyData: PropertyData) {
  const rows: DirectFinancingDetailedTable[] = [];
  let initialCapital = 0;
  let initialInvestment = propertyData.downPayment - propertyData.subsidy;

  // Valor total da dívida inicial
  const totalDebt =
    propertyData.propertyValue -
    propertyData.downPayment -
    propertyData.subsidy;

  // Mapeamento dos valores de discharges por mês
  const dischargesByMonth: Record<number, number> = {};
  propertyData.discharges.forEach((discharge) => {
    if (!dischargesByMonth[discharge.month]) {
      dischargesByMonth[discharge.month] = 0;
    }
    dischargesByMonth[discharge.month] += discharge.value;
  });

  let rentValue = propertyData.initialRentValue; // Inicialização do valor do aluguel
  let totalRentalShortfall = 0; // Acumulação de déficits de aluguel
  const totalMonths = propertyData.finalYear * 12;

  // Inicializar saldo devedor
  let outstandingBalance = totalDebt;

  // Verificar se as taxas de documentação foram pagas no início
  const isFinancingFeesInitial = dayjs(
    propertyData.financingFeesDate,
    "MM/YYYY"
  ).isSame(dayjs(propertyData.initialDate, "MM/YYYY"));

  if (isFinancingFeesInitial) {
    initialInvestment += propertyData.financingFees;
  }

  // Calcular o mês de pagamento da documentação
  const financingFeesMonthDiff = dayjs(
    propertyData.financingFeesDate,
    "MM/YYYY"
  ).diff(dayjs(propertyData.initialDate, "MM/YYYY"), "month");

  for (let month = 1; month <= totalMonths; month++) {
    const yearIndex = Math.floor(month / 12);

    const currentMonthDate = dayjs(propertyData.initialDate, "MM/YYYY").add(
      month,
      "month"
    );
    const rentIsActive = !currentMonthDate.isBefore(
      dayjs(propertyData.initialRentMonth, "MM/YYYY")
    );

    // Atualizar valor do aluguel no início do ano ou no primeiro mês
    if (month % 12 === 1 || month === 1) {
      rentValue = propertyData.isHousing
        ? 0
        : calcRentValue(
            propertyData.initialRentValue,
            yearIndex,
            propertyData.rentAppreciationRate
          );
    }

    // Obter a parcela cadastrada para o mês atual
    const monthlyDischarge = dischargesByMonth[month] || 0;

    // Calcular o balanço do mês (aluguel menos gasto)
    const rentalAmount = rentIsActive
      ? rentValue - monthlyDischarge
      : -monthlyDischarge;

    // Calcular o excesso de investimento como parcela menos aluguel, se ativo
    let investmentExcess = Math.max(
      monthlyDischarge - (rentIsActive ? rentValue : 0),
      0
    );

    // Adicionar custos de documentação no mês correspondente
    if (!isFinancingFeesInitial && month === financingFeesMonthDiff + 1) {
      investmentExcess += propertyData.financingFees;
      totalRentalShortfall += propertyData.financingFees;
      initialInvestment += propertyData.financingFees;
    }

    // Atualizar saldo devedor
    outstandingBalance = Math.max(outstandingBalance - monthlyDischarge, 0);

    // Atualizar acumuladores
    totalRentalShortfall += investmentExcess;
    initialInvestment += investmentExcess;

    const capitalYield =
      initialCapital >= 0
        ? (initialCapital * propertyData.monthlyYieldRate) / 100
        : 0;

    const propertyValue = calcPropertyValuation(
      propertyData.propertyValue,
      propertyData.propertyAppreciationRate,
      Math.floor(month / 12)
    );

    const monthlyDiscountRate =
      Math.pow(1 + propertyData.PVDiscountRate / 100, 1 / 12) - 1;

    const investmentExcessPresentValue =
      investmentExcess / Math.pow(1 + monthlyDiscountRate, month);

    const monthlyProfit =
      initialCapital +
      propertyValue -
      initialInvestment -
      propertyValue * (propertyData.brokerageFee / 100);

    rows.push({
      totalCapital: initialCapital,
      initialCapital: initialCapital,
      initialCapitalYield: capitalYield,
      propertyValue: propertyValue,
      rentValue: rentIsActive ? rentValue : 0,
      rentalShortfall: totalRentalShortfall,
      rentalAmount: rentalAmount,
      outstandingBalance: Math.max(outstandingBalance, 0),
      finalValue: initialCapital + propertyValue,
      monthlyProfit: monthlyProfit,
      investmentExcess: investmentExcess,
      investmentExcessPresentValue: investmentExcessPresentValue,
    });

    if (rentalAmount > 0 && propertyData.investTheRest) {
      initialCapital += rentalAmount;
    }
    initialCapital += capitalYield;
  }

  return rows;
}
