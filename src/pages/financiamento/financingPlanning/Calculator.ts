import { PropertyData } from "@/propertyData/PropertyDataContext";
import {
  calcOutstandingBalance,
  calcPropertyValuation,
  calcRentValue,
  calcTotalInterestPaid,
} from "@/lib/calcs";
import { FinancingPlanningDetailedTable } from "./CaseData";

export function calcCaseData(propertyData: PropertyData) {
  const detailedTable = calcDetailedTable(propertyData);
  const totalInvestment =
    propertyData.downPayment +
    propertyData.financingFees +
    detailedTable.reduce(
      (acc, val) => acc + val.investmentExcessPresentValue,
      0
    );
  const totalInterestPaid = detailedTable.reduce(
    (acc, val) => acc + val.interestPaid,
    0
  );
  const capitalGainsTax = calcCapitalGainsTax(totalInterestPaid, propertyData);
  const totalProfit = calcTotalProfit(
    detailedTable,
    totalInvestment,
    capitalGainsTax
  );

  return {
    investedEquity: 0,
    totalProfit: totalProfit.value,
    totalProfitPercent: totalProfit.percent,
    totalFinalEquity: totalProfit.finalEquity,
    investedEquityFinal: calcInvestedEquityFinal(detailedTable, propertyData),
    breakEven: calcBreakEvenPoint(detailedTable),
    totalRentalShortfall:
      detailedTable[detailedTable.length - 1].rentalShortfall,
    totalInterestPaid,
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
  detailedTable: FinancingPlanningDetailedTable[],
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
  detailedTable: FinancingPlanningDetailedTable[]
) {
  const investmentExcessVpSum = detailedTable.reduce(
    (acc, val) => acc + val.investmentExcessPresentValue,
    0
  );

  return (
    propertyData.downPayment +
    propertyData.financingFees +
    investmentExcessVpSum
  );
}

export function calcInvestedEquityFinal(
  detailedTable: FinancingPlanningDetailedTable[],
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

export function calcBreakEvenPoint(
  detailedTable: FinancingPlanningDetailedTable[]
) {
  let breakEvenPoint = 0;
  const initialCapital = detailedTable[0].initialCapital;

  for (const [index, row] of detailedTable.entries()) {
    if (row.initialCapital - initialCapital > row.outstandingBalance) {
      breakEvenPoint = index + 1;
      break;
    }
  }

  return breakEvenPoint;
}

export function calcCapitalGainsTax(
  totalInterestPaid: number,
  propertyData: PropertyData
) {
  const appreciatedPropertyValue = calcPropertyValuation(
    propertyData.propertyValue,
    propertyData.interestRate,
    propertyData.finalYear
  );

  return (
    (appreciatedPropertyValue -
      (propertyData.propertyValue + totalInterestPaid)) *
    0.15
  );
}

export function calcDetailedTable(propertyData: PropertyData) {
  const rows: FinancingPlanningDetailedTable[] = [];
  let initialCapital = 0;
  let initialInvestment = propertyData.downPayment + propertyData.financingFees;
  let rentValue = propertyData.initialRentValue;
  let totalRentalShortfall = 0;

  for (let month = 1; month <= propertyData.finalYear * 12; month++) {
    const yearIndex = Math.floor(month / 12);

    if (month % 12 === 1 || month === 1) {
      rentValue = propertyData.isHousing
        ? 0
        : calcRentValue(
            propertyData.initialRentValue,
            yearIndex,
            propertyData.rentAppreciationRate
          );
    }

    const rentalAmount = rentValue - propertyData.installmentValue;

    let investmentExcess = 0;
    if (rentalAmount < 0) {
      investmentExcess = rentalAmount * -1;
      totalRentalShortfall += investmentExcess;
      initialInvestment += investmentExcess;
    }

    const capitalYield =
      initialCapital >= 0
        ? (initialCapital * propertyData.monthlyYieldRate) / 100
        : 0;

    const propertyValue = calcPropertyValuation(
      propertyData.propertyValue,
      propertyData.propertyAppreciationRate,
      Math.floor(month / 12)
    );

    const outstandingBalance = calcOutstandingBalance(
      propertyData.propertyValue - propertyData.downPayment,
      propertyData.interestRate,
      propertyData.financingYears,
      month
    );

    const interestPaid = calcTotalInterestPaid(
      propertyData.propertyValue - propertyData.downPayment,
      propertyData.interestRate,
      propertyData.financingYears,
      propertyData.installmentValue,
      month
    );

    const finalValue = initialCapital + propertyValue - outstandingBalance;

    const monthlyProfit =
      finalValue -
      initialInvestment -
      propertyValue * (propertyData.brokerageFee / 100);

    const monthlyDiscountRate =
      Math.pow(1 + propertyData.PVDiscountRate / 100, 1 / 12) - 1;

    const investmentExcessPresentValue =
      investmentExcess / Math.pow(1 + monthlyDiscountRate, month);

    rows.push({
      totalCapital: initialCapital,
      initialCapital: initialCapital,
      initialCapitalYield: capitalYield,
      propertyValue: propertyValue,
      rentValue: rentValue,
      rentalShortfall: totalRentalShortfall,
      rentalAmount: rentalAmount,
      outstandingBalance: outstandingBalance,
      interestPaid: interestPaid,
      finalValue: finalValue,
      monthlyProfit: monthlyProfit,
      investmentExcessPresentValue: investmentExcessPresentValue,
    });

    if (rentalAmount > 0 && propertyData.investTheRest) {
      initialCapital += rentalAmount;
    }
    initialCapital += capitalYield;
  }

  return rows;
}
