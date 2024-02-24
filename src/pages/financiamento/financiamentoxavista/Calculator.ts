import { PropertyData } from "@/PropertyDataContext";

export function calcCaseData(context: 'inCash' | 'financing', propertyData: PropertyData) {
    const totalProfit = calcTotalProfit(context, propertyData)

    return {
        investedEquity: calcInvestedEquity(context, propertyData),
        totalProfit: totalProfit.value,
        totalProfitPercent: totalProfit.percent,
        totalFinalEquity: totalProfit.finalEquity,
        investedEquityFinal: calcInvestedEquityFinal(context, propertyData),
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

    if (context === 'inCash') {
        console.log('total investido: ' + calcTotalInvestido());
        console.log('compra do imovel: ' + calcCompraDoImovel());
        console.log((calcCompraDoImovel() + calcTotalInvestido()));

    }

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
                ((capitalAcumulado * propertyData.monthlyIncome) / 100)
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

