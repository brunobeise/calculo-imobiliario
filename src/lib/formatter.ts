export const formatterReal = (valor: string | number) => {
  const valorNumerico = Number(valor.toString().replace(/\D/g, ""));
  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorNumerico / 100);

  return valorFormatado;
};

export const realParaNumero = (valor: string) => {
  const valorSemSimbolo = valor.replace(/\s?R\$\s?/, "");
  const valorLimpo = valorSemSimbolo.replace(/\./g, "").replace(",", ".");
  const valorNumerico = parseFloat(valorLimpo);
  return valorNumerico;
};

export const toBRL = (value: number = 0) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export function formatTime(seconds: number | null) {
  if (!seconds) return "0s";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hourStr = hours > 0 ? `${hours}h` : "";
  const minuteStr = minutes > 0 ? `${minutes}m` : "";
  const secondStr = remainingSeconds > 0 ? `${remainingSeconds}s` : "";

  return `${hourStr}${minuteStr}${secondStr}` || "0s";
}
