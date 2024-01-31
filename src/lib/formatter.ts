export const formatterReal = (valor: string | number) => {
    const valorNumerico = Number(valor.toString().replace(/\D/g, ''));
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valorNumerico / 100);

    return valorFormatado;
};

export const realParaNumero = (valor: string) => {
    const valorSemSimbolo = valor.replace(/\s?R\$\s?/, '');
    const valorLimpo = valorSemSimbolo.replace(/\./g, '').replace(',', '.');
    const valorNumerico = parseFloat(valorLimpo);
    return valorNumerico;
};

export const numeroParaReal = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}