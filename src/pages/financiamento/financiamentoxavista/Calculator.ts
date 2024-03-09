import { PropertyData } from "@/PropertyDataContext";
import { calcOutstandingBalance } from "@/lib/calcs";
import { FinancingOrCashDetailedTable } from "./Context";


export function calcCaseData(context: 'inCash' | 'financing', propertyData: PropertyData) {
    const totalProfit = calcTotalProfit(context, propertyData)

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

export function calcTotalProfit(context: 'inCash' | 'financing', propertyData: PropertyData) {
    const calcCompraDoImovel = () => {
        if (context === "financing") return propertyData.downPayment + propertyData.financingFees;
        else return propertyData.propertyValue;
    };

    const calcTotalInvestido = () => {

        return propertyData.personalBalance - calcCompraDoImovel()

    };

    const calcOutstandingBalance = () => {
        if (context === "financing") return propertyData.outstandingBalance;
        else return 0;
    };

    const calcPatrimônioTotal = () => {
        if (context === "financing")
            return propertyData.appreciatedPropertyValue + calcInvestedEquityFinal(context, propertyData) - calcOutstandingBalance();
        else return propertyData.appreciatedPropertyValue + calcInvestedEquityFinal(context, propertyData)
    };

    const lucroNaOperação = () => {
        return (
            (calcPatrimônioTotal() / (calcCompraDoImovel() + calcTotalInvestido())) *
            100 -
            100
        );
    };

    const lucroNaOperaçãoReais = () => {
        return (
            calcPatrimônioTotal() - (calcCompraDoImovel() + calcTotalInvestido())
        );
    };



    return {
        value: lucroNaOperaçãoReais(),
        percent: lucroNaOperação(),
        finalEquity: calcPatrimônioTotal()
    }
}

export function calcInvestedEquityFinal(context: 'inCash' | 'financing', propertyData: PropertyData) {

    let capitalAcumulado =
        context === "financing"
            ? propertyData.personalBalance -
            propertyData.financingFees -
            propertyData.downPayment
            : propertyData.personalBalance - propertyData.propertyValue;

    let patrimonioFinal = 0;
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

        if (mes === propertyData.finalYear * 12) patrimonioFinal = valorFinal;
        capitalAcumulado = valorFinal;
    }

    return patrimonioFinal

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

        // Adicionando condição para verificar se o capital do aluguel é negativo
        const rentalIncomeYield = rentalIncomeCapital >= 0
            ? Number(((rentalIncomeCapital * propertyData.rentMonthlyYieldRate) / 100).toFixed(2))
            : 0;

        const finalValue = Number((initialCapital + capitalYield + rentalIncomeCapital + rentalIncomeYield + rentalAmount).toFixed(2));

        const outstandingBalance = calcOutstandingBalance(
            propertyData.propertyValue - propertyData.downPayment, // valor financiado
            propertyData.interestRate,
            propertyData.financingYears,
            month - 1
        );

        const monthlyProfit = finalValue - outstandingBalance;


        rows.push({
            totalCapital: initialCapital + rentalIncomeCapital,
            initialCapital: initialCapital,
            initialCapitalYield: capitalYield,
            rentValue: rentValue,
            rentalAmount: rentalAmount,
            outstandingBalance: outstandingBalance,
            finalValue: finalValue,
            rentalIncomeCapital: rentalIncomeCapital,
            rentalIncomeYield: rentalIncomeYield,
            monthlyProfit: monthlyProfit
        });

        // Atualizando os capitais para a próxima iteração
        initialCapital += capitalYield; // Apenas o rendimento do capital é adicionado de volta ao capital inicial
        rentalIncomeCapital += rentalIncomeYield + rentalAmount; // Adiciona tanto o rendimento do aluguel quanto o montante do aluguel ao capital do aluguel
    }
    return rows;
}

