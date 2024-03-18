import IsolatedFinancingOrInCashReport from "@/pages/financiamento/financiamentoisoladoxavista/report";
import RelatorioFinanciamentoXAvista from "@/pages/financiamento/financiamentoxavista/report";

export const relatorioRoutes = [
  {
    title: "Relatório - Financiamento X A Vista",
    href: "/financiamentoxavista/relatorio",
    description:
      "Compara as duas hipóteses quando o cliente tem o saldo para comprar a vista.",
    element: <RelatorioFinanciamentoXAvista />,
  },
  {
    title: "Relatório - Financiamento Isolado X A Vista",
    href: "/financiamentoisoladoxavista/relatorio",
    description:
      "Compara as duas hipóteses com diferentes valores de investimento inicial",
    element: <IsolatedFinancingOrInCashReport />,
  },
];
