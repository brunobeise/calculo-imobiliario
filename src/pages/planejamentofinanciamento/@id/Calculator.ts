import { PropertyData } from "@/propertyData/PropertyDataContext";
import {
  calcOutstandingBalance,
  calcPropertyValuation,
  calcRentValue,
  calcTotalInterestPaid,
} from "@/lib/calcs";
import { FinancingPlanningDetailedTable } from "./CaseData";
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
  if (!propertyData.considerCapitalGainsTax) return 0;

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
  let initialInvestment = propertyData.downPayment - propertyData.subsidy;

  const isFinancingFeesInitial = dayjs(
    propertyData.financingFeesDate,
    "MM/YYYY"
  ).isSame(dayjs(propertyData.initialDate, "MM/YYYY"));

  if (isFinancingFeesInitial) {
    initialInvestment += propertyData.financingFees;
  }

  let rentValue = propertyData.initialRentValue;
  let totalRentalShortfall = 0;

  const dischargesByMonth: Record<number, number> = {};

  propertyData.discharges.forEach((discharge) => {
    if (!dischargesByMonth[discharge.month]) {
      dischargesByMonth[discharge.month] = 0;
    }
    dischargesByMonth[discharge.month] += discharge.value;
  });

  const totalInvestmentDischarges = propertyData.discharges
    .filter((d) => !d.isConstructionInterest)
    .reduce((acc, val) => val.originalValue + acc, 0);

  const totalMonths = propertyData.financingMonths;
  const amortizationFixed =
    propertyData.amortizationType === "SAC"
      ? (propertyData.propertyValue -
          propertyData.downPayment -
          totalInvestmentDischarges -
          propertyData.subsidy) /
        totalMonths
      : 0;

  let outstandingBalance = calcOutstandingBalance(
    propertyData.propertyValue -
      propertyData.downPayment -
      totalInvestmentDischarges -
      propertyData.subsidy,
    propertyData.interestRate,
    propertyData.financingMonths,
    0
  );

  const financingFeesMonthDiff = dayjs(
    propertyData.financingFeesDate,
    "MM/YYYY"
  ).diff(dayjs(propertyData.initialDate, "MM/YYYY"), "month");

  for (let month = 1; month <= propertyData.finalYear * 12; month++) {
    const yearIndex = Math.floor(month / 12);

    const currentMonthDate = dayjs(propertyData.initialDate, "MM/YYYY").add(
      month,
      "month"
    );
    const rentIsActive = !currentMonthDate.isBefore(
      dayjs(propertyData.initialRentMonth, "MM/YYYY")
    );
    const installmentIsActive = !currentMonthDate.isBefore(
      dayjs(propertyData.initialFinancingMonth, "MM/YYYY")
    );

    if (month % 12 === 1 || month === 1) {
      rentValue = propertyData.isHousing
        ? 0
        : calcRentValue(
            propertyData.initialRentValue,
            yearIndex,
            propertyData.rentAppreciationRate
          );
    }

    let installmentValue = 0;

    if (installmentIsActive) {
      if (propertyData.amortizationType === "PRICE") {
        installmentValue = propertyData.installmentValue;
        outstandingBalance = calcOutstandingBalance(
          propertyData.propertyValue -
            propertyData.downPayment -
            totalInvestmentDischarges -
            propertyData.subsidy,
          propertyData.interestRate,
          propertyData.financingMonths,
          month
        );
      } else if (propertyData.amortizationType === "SAC") {
        const interest =
          outstandingBalance * (propertyData.interestRate / 100 / 12);
        installmentValue = amortizationFixed + interest;
        outstandingBalance -= amortizationFixed;
      }
    }

    const installmentTax =
      propertyData.installmentValue > installmentValue
        ? propertyData.installmentValue - installmentValue
        : 0;

    const rentalAmount = (rentIsActive ? rentValue : 0) - installmentValue;

    let investmentExcess = 0;
    if (rentalAmount < 0) {
      investmentExcess = rentalAmount * -1;
      totalRentalShortfall += investmentExcess;
      initialInvestment += investmentExcess;
    }

    if (dischargesByMonth[month]) {
      investmentExcess += dischargesByMonth[month];
      totalRentalShortfall += dischargesByMonth[month];
      initialInvestment += dischargesByMonth[month];
    }

    if (propertyData.amortizationType === "SAC")
      investmentExcess += installmentTax;

    if (!isFinancingFeesInitial && month === financingFeesMonthDiff + 1) {
      investmentExcess += propertyData.financingFees;
      totalRentalShortfall += propertyData.financingFees;
      initialInvestment += propertyData.financingFees;
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

    const interestPaid =
      outstandingBalance > 0
        ? calcTotalInterestPaid(
            propertyData.propertyValue - propertyData.downPayment,
            propertyData.interestRate,
            propertyData.financingMonths,
            propertyData.installmentValue,
            month
          )
        : 0;

    const finalValue = initialCapital + propertyValue - outstandingBalance;

    const monthlyDiscountRate =
      Math.pow(1 + propertyData.PVDiscountRate / 100, 1 / 12) - 1;

    const investmentExcessPresentValue =
      investmentExcess / Math.pow(1 + monthlyDiscountRate, month);

    const monthlyProfit =
      finalValue -
      initialInvestment -
      propertyValue * (propertyData.brokerageFee / 100);

    rows.push({
      totalCapital: initialCapital,
      initialCapital: initialCapital,
      initialCapitalYield: capitalYield,
      propertyValue: propertyValue,
      installmentValue: installmentValue,
      rentValue: rentIsActive ? rentValue : 0,
      rentalShortfall: totalRentalShortfall,
      rentalAmount: rentalAmount,
      outstandingBalance: Math.max(outstandingBalance, 0),
      interestPaid: interestPaid,
      finalValue: finalValue,
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
