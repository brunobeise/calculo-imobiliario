export function calcRentValue(valorInicial: number, ano: number): number {
    return Number((valorInicial * Math.pow(1 + 0.08, ano)).toFixed(2));
}


export function calcPropertyValuation(propertyValue: number, interestRate: number, finalYear: number): number {
    return propertyValue * Math.pow(1 + interestRate / 100, finalYear)
}

export function calcInstallmentValue(valorFinanciado: number, interestRate: number, financingYears: number) {
    const taxaMensal = interestRate / 100 / 12;
    // const taxaMensal = Math.pow(1 + interestRate / 100, 1 / 12) - 1;


    return valorFinanciado *
        (taxaMensal * Math.pow((1 + taxaMensal), financingYears * 12)) /
        (Math.pow((1 + taxaMensal), financingYears * 12) - 1);
}

export function calcOutstandingBalance(valorFinanciado: number, interestRate: number, totalAnosFinanciamento: number, pagamentosRealizados: number): number {
    const taxaMensal = interestRate / 100 / 12;
    const totalParcelas = totalAnosFinanciamento * 12;

    const outstandingBalance = valorFinanciado *
        ((Math.pow(1 + taxaMensal, totalParcelas) - Math.pow(1 + taxaMensal, pagamentosRealizados)) /
            (Math.pow(1 + taxaMensal, totalParcelas) - 1));

    return outstandingBalance
}

export function calcTotalInterestPaid(loanAmount: number, interestRate: number, totalYearsOfLoan: number, installmentValue: number, paymentsMade : number,) {
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = totalYearsOfLoan * 12;

    // Calcula o saldo devedor antes do pagamento atual
    const balanceBeforePayment = loanAmount *
        ((Math.pow(1 + monthlyInterestRate, totalPayments) - Math.pow(1 + monthlyInterestRate, paymentsMade - 1)) /
            (Math.pow(1 + monthlyInterestRate, totalPayments) - 1));

    // Calcula o saldo devedor após o pagamento atual
    const balanceAfterPayment = loanAmount *
        ((Math.pow(1 + monthlyInterestRate, totalPayments) - Math.pow(1 + monthlyInterestRate, paymentsMade)) /
            (Math.pow(1 + monthlyInterestRate, totalPayments) - 1));


   
    

    // A diferença entre os saldos antes e depois do pagamento é o valor principal pago
    const principalPaid = installmentValue - (balanceBeforePayment - balanceAfterPayment);

    console.log(principalPaid);

    return principalPaid;
}




