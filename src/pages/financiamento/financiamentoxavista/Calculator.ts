import { PropertyData } from "@/PropertyDataContext";
import { calcOutstandingBalance, calcPropertyValuation } from "@/lib/calcs";
import { FinancingOrCashDetailedTable } from "./Context";


export function calcCaseData(context: 'inCash' | 'financing', propertyData: PropertyData) {
    const totalProfit = calcTotalProfit(context, propertyData, propertyData.finalYear * 12)

    return {
        investedEquity: calcInvestedEquity(context, propertyData),
        totalProfit: totalProfit.value,
        totalProfitPercent: totalProfit.percent,
        totalFinalEquity: totalProfit.finalEquity,
        investedEquityFinal: calcInvestedEquityFinal(context, propertyData),
        breakEven: calcBreakEvenPoint(context, propertyData),
        detailedTable: calcDetailedTable(context, propertyData)
    };
}


export function calcInvestedEquity(context: 'inCash' | 'financing', propertyData: PropertyData) {
    if (context === "financing")
        return propertyData.personalBalance - (propertyData.downPayment + propertyData.financingFees);
    else return propertyData.personalBalance - propertyData.propertyValue;
}

export function calcTotalProfit(context: 'inCash' | 'financing', propertyData: PropertyData, month: number) {
    let purchaseAmount;
    if (context === "financing") {
        purchaseAmount = propertyData.downPayment + propertyData.financingFees;
    } else {
        purchaseAmount = propertyData.propertyValue;
    }

    const totalInvested = propertyData.personalBalance - purchaseAmount;

    const outstandingBalance = context === "financing" ? propertyData.outstandingBalance : 0;

    let totalEquity;
    if (context === "financing") {
        totalEquity = propertyData.appreciatedPropertyValue + calcInvestedEquityFinal(context, propertyData, month) - outstandingBalance;
    } else {
        totalEquity = propertyData.appreciatedPropertyValue + calcInvestedEquityFinal(context, propertyData, month);
    }

    const operationProfitPercent = ((totalEquity / (purchaseAmount + totalInvested)) * 100) - 100;
    const operationProfitAmount = totalEquity - (purchaseAmount + totalInvested);

    return {
        value: operationProfitAmount,
        percent: operationProfitPercent,
        finalEquity: totalEquity
    }
}

export function calcInvestedEquityFinal(context: 'inCash' | 'financing', propertyData: PropertyData, month = propertyData.finalYear * 12) {
    let accumulatedCapital =
        context === "financing"
            ? propertyData.personalBalance - propertyData.financingFees - propertyData.downPayment
            : propertyData.personalBalance - propertyData.propertyValue;

    let finalEquity = 0;
    let rentValue = propertyData.initialRentValue;

    for (let currentMonth = 1; currentMonth <= month; currentMonth++) {
        const yearIndex = Math.floor((currentMonth - 1) / 12);

        // Adjust rent value at the beginning of each year or if it's the first month
        if (currentMonth % 12 === 1 || currentMonth === 1) {
            rentValue = propertyData.rentValue![yearIndex];
        }

        const rentAmount =
            context === "financing"
                ? Number(rentValue - propertyData.installmentValue)
                : Number(rentValue);

        let monthlyProfit = 0;
        if (accumulatedCapital >= 0 || context === "financing") {
            monthlyProfit = Number(
                (accumulatedCapital * propertyData.monthlyYieldRate) / 100
            );
        }

        const finalValue = Number(
            accumulatedCapital + monthlyProfit + rentAmount
        );

        if (currentMonth === month) finalEquity = finalValue;

        accumulatedCapital = finalValue;
    }

    return finalEquity;
}

export function calcBreakEvenPoint(context: 'inCash' | 'financing', propertyData: PropertyData) {
    const capitalInicial = context === "financing"
        ? propertyData.personalBalance -
        propertyData.financingFees -
        propertyData.downPayment
        : propertyData.personalBalance - propertyData.propertyValue;

    let capitalAcumulado = capitalInicial

    let rentValue = propertyData.initialRentValue;

    for (let mes = 1; mes <= propertyData.finalYear * 12; mes++) {
        const indiceAno = Math.floor((mes - 1) / 12);

        if (mes % 12 === 1 || mes === 1) {
            rentValue = propertyData.rentValue![indiceAno];
        }

        const montanteAluguel =
            context === "financing"
                ? Number((rentValue - propertyData.installmentValue))
                : Number(rentValue);

        let lucroMensal = 0;
        if (capitalAcumulado >= 0 || context === "financing") {
            lucroMensal = Number(
                ((capitalAcumulado * propertyData.monthlyYieldRate) / 100)
            );
        }

        const valorFinal = Number(
            (capitalAcumulado + lucroMensal + montanteAluguel)
        );

        const saldoDevedor = calcOutstandingBalance(
            propertyData.propertyValue - propertyData.downPayment, // valor financiado
            propertyData.interestRate,
            propertyData.financingYears,
            mes - 1
        );

        if ((valorFinal - capitalInicial) > saldoDevedor) {
            return mes
        }


        capitalAcumulado = valorFinal;
    }


}

export function calcDetailedTable(context: 'inCash' | 'financing', propertyData: PropertyData) {
    const rows: FinancingOrCashDetailedTable[] = [];


    let initialCapital =
        context === 'financing'
            ? propertyData.personalBalance - propertyData.financingFees - propertyData.downPayment
            : propertyData.personalBalance - propertyData.propertyValue;

    let rentalIncomeCapital = 0;
    let rentValue = propertyData.initialRentValue;

    for (let month = 1; month <= propertyData.finalYear * 12; month++) {
        const yearIndex = Math.floor((month - 1) / 12);

        if (month % 12 === 1 || month === 1) {
            rentValue = propertyData.rentValue![yearIndex];
        }

        const rentalAmount =
            context === 'financing'
                ? Number((rentValue - propertyData.installmentValue).toFixed(2))
                : Number(rentValue.toFixed(2));

        let capitalYield = 0;
        if (initialCapital >= 0 || context === 'financing') {
            capitalYield = Number(((initialCapital * propertyData.monthlyYieldRate) / 100).toFixed(2));
        }

        const rentalIncomeYield = rentalIncomeCapital >= 0
            ? Number(((rentalIncomeCapital * propertyData.rentMonthlyYieldRate) / 100).toFixed(2))
            : 0;

        const propertyValue = calcPropertyValuation(propertyData.propertyValue, propertyData.propertyAppreciationRate, Math.ceil((month / 12) - 1))

        let outstandingBalance = 0;
        if (context === 'financing') {
            outstandingBalance = calcOutstandingBalance(
                propertyData.propertyValue - propertyData.downPayment,
                propertyData.interestRate,
                propertyData.financingYears,
                month
            );
        }

        // Calcula o valor final e o lucro mensal aqui
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
            monthlyProfit: monthlyProfit // Este é o lucro mensal
        });

        // Atualizando os capitais para a próxima iteração
        initialCapital += capitalYield;
        rentalIncomeCapital += rentalIncomeYield + rentalAmount;
    }

    return rows;
}


