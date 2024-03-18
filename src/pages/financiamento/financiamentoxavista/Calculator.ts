import { PropertyData } from "@/propertyData/PropertyDataContext";
import { calcOutstandingBalance, calcPropertyValuation, calcRentValue } from "@/lib/calcs";
import { FinancingOrCashDetailedTable } from "./Context";


export function calcCaseData(context: 'inCash' | 'financing', propertyData: PropertyData) {
    const detailedTable = calcDetailedTable(context, propertyData)
    const totalProfit = calcTotalProfit(detailedTable, propertyData.personalBalance)

    return {
        investedEquity: calcInvestedEquity(context, propertyData),
        totalProfit: totalProfit.value,
        totalProfitPercent: totalProfit.percent,
        totalFinalEquity: totalProfit.finalEquity,
        investedEquityFinal: calcInvestedEquityFinal(detailedTable, propertyData),
        breakEven: calcBreakEvenPoint(detailedTable),
        detailedTable

    };
}


export function calcInvestedEquity(context: 'inCash' | 'financing', propertyData: PropertyData) {
    if (context === "financing")
        return propertyData.personalBalance - (propertyData.downPayment + propertyData.financingFees);
    else return propertyData.personalBalance - propertyData.propertyValue;
}

export function calcTotalProfit(detailedTable: FinancingOrCashDetailedTable[], personalBalance: number) {

    const finalRow = detailedTable[detailedTable.length - 1];
    const totalEquity = finalRow.finalValue
    const operationProfitAmount = finalRow.monthlyProfit
    const operationProfitPercent = ((finalRow.monthlyProfit / personalBalance) * 100);

    return {
        value: operationProfitAmount,
        percent: operationProfitPercent,
        finalEquity: totalEquity
    };
}

export function calcInvestedEquityFinal(detailedTable: FinancingOrCashDetailedTable[], propertyData: PropertyData, month = propertyData.finalYear * 12) {

    if (month > 0 && month <= detailedTable.length) {

        const rowForMonth = detailedTable[month - 1];

        return rowForMonth.finalValue - rowForMonth.propertyValue + rowForMonth.outstandingBalance;
    } else {

        console.error("Month specified is out of range.");
        return 0;
    }
}

export function calcBreakEvenPoint(detailedTable: FinancingOrCashDetailedTable[]) {

    let breakEvenPoint = 0;
    const initialCapital = detailedTable[0].initialCapital

    for (const [index, row] of detailedTable.entries()) {
        if ((row.initialCapital - initialCapital) > row.outstandingBalance) {

            breakEvenPoint = index + 1;
            break;
        }
    }

    return breakEvenPoint;

}

export function calcDetailedTable(context: 'inCash' | 'financing', propertyData: PropertyData) {
    const rows: FinancingOrCashDetailedTable[] = [];
    


    let initialCapital =
        context === 'financing'
            ? propertyData.personalBalance - propertyData.financingFees - propertyData.downPayment
            : propertyData.personalBalance - propertyData.inCashFees - propertyData.propertyValue;

    let rentalIncomeCapital = 0;
    let rentValue = propertyData.initialRentValue;

    for (let month = 1; month <= propertyData.finalYear * 12; month++) {
        const yearIndex = Math.floor((month - 1) / 12);

        if (month % 12 === 1 || month === 1) {
            rentValue = calcRentValue(propertyData.initialRentValue, yearIndex)
        }

        const rentalAmount =
            context === 'financing'
                ? ((rentValue - propertyData.installmentValue))
                : (rentValue);

        let capitalYield = 0;
        if (initialCapital >= 0 || context === 'financing') {
            capitalYield = (((initialCapital * propertyData.monthlyYieldRate) / 100));
        }

        const rentalIncomeYield = rentalIncomeCapital >= 0
            ? (((rentalIncomeCapital * propertyData.rentMonthlyYieldRate) / 100))
            : 0;

        const propertyValue = calcPropertyValuation(propertyData.propertyValue, propertyData.propertyAppreciationRate, Math.floor(month / 12))

        let outstandingBalance = 0;
        if (context === 'financing') {
            outstandingBalance = calcOutstandingBalance(
                propertyData.propertyValue - propertyData.downPayment,
                propertyData.interestRate,
                propertyData.financingYears,
                month
            );
        }

        const finalValue = initialCapital + capitalYield + rentalIncomeCapital + rentalIncomeYield + rentalAmount + propertyValue - outstandingBalance;

        const monthlyProfit = finalValue - propertyData.personalBalance

        rows.push({
            totalCapital: initialCapital + rentalIncomeCapital,
            initialCapital: initialCapital,
            initialCapitalYield: capitalYield,
            propertyValue: propertyValue,
            rentValue: rentValue,
            rentalAmount: rentalAmount,
            outstandingBalance: outstandingBalance,
            finalValue: finalValue,
            rentalIncomeCapital: rentalIncomeCapital,
            rentalIncomeYield: rentalIncomeYield,
            monthlyProfit: monthlyProfit
        });


        initialCapital += capitalYield;
        rentalIncomeCapital += rentalIncomeYield + rentalAmount;
    }

    return rows;
}


