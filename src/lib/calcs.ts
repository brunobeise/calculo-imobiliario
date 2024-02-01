export function calcValorizaçãoAluguel(valorInicial: number, anoFinal: number): number[] {
    return Array.from({ length: anoFinal }, (_, index) => {
        const ano = index + 1;
        return Number((valorInicial * Math.pow(1 + 0.08, ano - 1)).toFixed(2));
    });
}

export function calcValorizaçãoImóvel(valorImovel: number, taxaDeJuros: number, anoFinal: number): number {
    return Number(
        (
            valorImovel * Math.pow(1 + taxaDeJuros / 100, anoFinal)
        ).toFixed(0)
    );
}

export function calcValorParcela(valorFinanciado: number, taxaDeJuros: number, anosFinanciamento: number) {
    const taxaMensal = taxaDeJuros / 100 / 12;


    return valorFinanciado *
        (taxaMensal * Math.pow((1 + taxaMensal), anosFinanciamento * 12)) /
        (Math.pow((1 + taxaMensal), anosFinanciamento * 12) - 1);

}

export function calcSaldoDevedor(valorFinanciado: number, taxaDeJuros: number, totalAnosFinanciamento: number, pagamentosRealizados: number): number {
    const taxaMensal = taxaDeJuros / 100 / 12;
    const totalParcelas = totalAnosFinanciamento * 12;

    const saldoDevedor = valorFinanciado *
        ((Math.pow(1 + taxaMensal, totalParcelas) - Math.pow(1 + taxaMensal, pagamentosRealizados)) /
            (Math.pow(1 + taxaMensal, totalParcelas) - 1));

    return Number(saldoDevedor.toFixed(2));
}
