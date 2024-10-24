export function calcRentValue(
    valorInicial: number,
    ano: number,
    rentAppreciationRate: number
): number {
    return Number(
        (valorInicial * Math.pow(1 + rentAppreciationRate / 100, ano)).toFixed(2)
    );
}

export function calcPropertyValuation(
    propertyValue: number,
    interestRate: number,
    finalYear: number
): number {
    return propertyValue * Math.pow(1 + interestRate / 100, finalYear);
}

export function calcInstallmentValue(
    valorFinanciado: number,
    interestRate: number,
    financingYears: number
) {
    const taxaMensal = interestRate / 100 / 12;
    // const taxaMensal = Math.pow(1 + interestRate / 100, 1 / 12) - 1;

    return (
        (valorFinanciado *
            (taxaMensal * Math.pow(1 + taxaMensal, financingYears * 12))) /
        (Math.pow(1 + taxaMensal, financingYears * 12) - 1) +
        150
    );
}

export function calcOutstandingBalance(
    valorFinanciado: number,
    interestRate: number,
    totalAnosFinanciamento: number,
    pagamentosRealizados: number
): number {
    const taxaMensal = interestRate / 100 / 12;
    const totalParcelas = totalAnosFinanciamento * 12;

    let outstandingBalance =
        valorFinanciado *
        ((Math.pow(1 + taxaMensal, totalParcelas) -
            Math.pow(1 + taxaMensal, pagamentosRealizados)) /
            (Math.pow(1 + taxaMensal, totalParcelas) - 1));

    if (outstandingBalance < 0) {
      outstandingBalance = 0;
    }        

    return outstandingBalance;
}

export function calcTotalInterestPaid(
    loanAmount: number,
    interestRate: number,
    totalYearsOfLoan: number,
    installmentValue: number,
    paymentsMade: number
) {
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = totalYearsOfLoan * 12;

    const balanceBeforePayment =
        loanAmount *
        ((Math.pow(1 + monthlyInterestRate, totalPayments) -
            Math.pow(1 + monthlyInterestRate, paymentsMade - 1)) /
            (Math.pow(1 + monthlyInterestRate, totalPayments) - 1));

    const balanceAfterPayment =
        loanAmount *
        ((Math.pow(1 + monthlyInterestRate, totalPayments) -
            Math.pow(1 + monthlyInterestRate, paymentsMade)) /
            (Math.pow(1 + monthlyInterestRate, totalPayments) - 1));

    const principalPaid =
        installmentValue - (balanceBeforePayment - balanceAfterPayment);

    return principalPaid;
}

export function calculatePresentValue(
    futureCashFlows: number[],
    discountRate: number,
    periods: number[]
): number {
    const monthlyDiscountRate = Math.pow(1 + discountRate / 100, 1 / 12) - 1;
    let presentValue = 0;

    for (let i = 0; i < futureCashFlows.length; i++) {
        presentValue +=
            futureCashFlows[i] / Math.pow(1 + monthlyDiscountRate, periods[i]);
    }

    return Number(presentValue.toFixed(2));
}
