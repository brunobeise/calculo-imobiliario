import { PropertyData } from "@/propertyData/PropertyDataContext";
import { calcOutstandingBalance, calcPropertyValuation, calcRentValue, calcTotalInterestPaid } from "@/lib/calcs";
import { IsolatedFinancingOrCashDetailedTable } from "./Context";


export function calcCaseData(context: 'inCash' | 'financing', propertyData: PropertyData) {
    const detailedTable = calcDetailedTable(context, propertyData)
    const initialInvestment = context === 'financing' ?
        propertyData.downPayment + propertyData.financingFees
        : propertyData.inCashFees + propertyData.propertyValue
    const totalProfit = calcTotalProfit(detailedTable, initialInvestment)

    return {
        investedEquity: 0,
        totalProfit: totalProfit.value,
        totalProfitPercent: totalProfit.percent,
        totalFinalEquity: totalProfit.finalEquity,
        investedEquityFinal: calcInvestedEquityFinal(detailedTable, propertyData),
        breakEven: calcBreakEvenPoint(detailedTable),
        totalRentalShortfall: detailedTable[detailedTable.length - 1].rentalShortfall,
        totalInterestPaid: detailedTable.reduce((acc, val) => acc + val.interestPaid, 0),
        detailedTable
       
    };

   
    
}


export function calcTotalProfit(detailedTable: IsolatedFinancingOrCashDetailedTable[], personalBalance: number, row?: number) {

    const finalRow = row ? detailedTable[row] : detailedTable[detailedTable.length - 1];
    const totalEquity = finalRow.finalValue
    const operationProfitAmount = finalRow.monthlyProfit
    const operationProfitPercent = ((finalRow.monthlyProfit / personalBalance) * 100);

    return {
        value: operationProfitAmount,
        percent: operationProfitPercent,
        finalEquity: totalEquity
    };
}

export function calcInvestedEquityFinal(detailedTable: IsolatedFinancingOrCashDetailedTable[], propertyData: PropertyData, month = propertyData.finalYear * 12) {

    if (month > 0 && month <= detailedTable.length) {

        const rowForMonth = detailedTable[month - 1];

        return rowForMonth.finalValue - rowForMonth.propertyValue + rowForMonth.outstandingBalance;
    } else {

        console.error("Month specified is out of range.");
        return 0;
    }
}

export function calcBreakEvenPoint(detailedTable: IsolatedFinancingOrCashDetailedTable[]) {

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
    const rows: IsolatedFinancingOrCashDetailedTable[] = [];
    
    let initialCapital = 0
    let initialInvestment = context === 'financing' ? 
    propertyData.downPayment + propertyData.financingFees
    : propertyData.inCashFees + propertyData.propertyValue

    let rentValue = propertyData.initialRentValue;

    let totalRentalShortfall = 0

    for (let month = 1; month <= propertyData.finalYear * 12; month++) {
        const yearIndex = Math.floor((month ) / 12);

     

        if (month % 12 === 1 || month === 1) {
            rentValue = calcRentValue(propertyData.initialRentValue, yearIndex)
        }

        const rentalAmount =
            context === 'financing'
                ? ((rentValue - propertyData.installmentValue))
                : (rentValue);

    
                

        if (rentalAmount < 0) {
            totalRentalShortfall += rentalAmount *  -1
            initialInvestment += rentalAmount * -1
        }
       
        const capitalYield = initialCapital >= 0
            ? (((initialCapital * propertyData.monthlyYieldRate) / 100))
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

        const interestPaid = calcTotalInterestPaid(
            propertyData.propertyValue - propertyData.downPayment,
            propertyData.interestRate,
            propertyData.financingYears,
            propertyData.installmentValue,
            month,
        )   

        const finalValue = initialCapital + capitalYield + rentalAmount + propertyValue - outstandingBalance;

        const monthlyProfit = finalValue - initialInvestment

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
            monthlyProfit: monthlyProfit
          
        });

        if (rentalAmount > 0) initialCapital += rentalAmount
        initialCapital += capitalYield;

        

    }

    return rows;
}


