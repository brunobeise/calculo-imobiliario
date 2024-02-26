import RelatorioFinanciamentoXAvista from "@/pages/financiamento/financiamentoxavista/report";

export const relatorioRoutes = [
  {
    title: "Relatório - Financiamento X A Vista",
    href: "/financiamentoxavista/relatorio",
    description:
      "Compara as duas hipóteses quando o cliente tem o saldo para comprar a vista.",
    element: <RelatorioFinanciamentoXAvista />,
  },
];
