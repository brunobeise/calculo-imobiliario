export function calcValorizaçãoAluguel(valorInicial: number, finalYear: number): number[] {
    return Array.from({ length: finalYear }, (_, index) => {
        const ano = index + 1;
        return Number((valorInicial * Math.pow(1 + 0.08, ano - 1)).toFixed(2));
    });
}

export function calcPropertyValuation(propertyValue: number, interestRate: number, finalYear: number): number {
    return Number(
        (
            propertyValue * Math.pow(1 + interestRate / 100, finalYear)
        ).toFixed(0)
    );
}

export function calcinstallmentValue(valorFinanciado: number, interestRate: number, financingYears: number) {
    const taxaMensal = interestRate / 100 / 12;


    return valorFinanciado *
        (taxaMensal * Math.pow((1 + taxaMensal), financingYears * 12)) /
        (Math.pow((1 + taxaMensal), financingYears * 12) - 1);

}

export function calcOutsadingBalance(valorFinanciado: number, interestRate: number, totalAnosFinanciamento: number, pagamentosRealizados: number): number {
    const taxaMensal = interestRate / 100 / 12;
    const totalParcelas = totalAnosFinanciamento * 12;

    const outstandingBalance = valorFinanciado *
        ((Math.pow(1 + taxaMensal, totalParcelas) - Math.pow(1 + taxaMensal, pagamentosRealizados)) /
            (Math.pow(1 + taxaMensal, totalParcelas) - 1));

    return Number(outstandingBalance.toFixed(2));
}



