import FinanceOrCashReport from "@/reports/financeOrCashReport/FinanceOrCashReport";
import FinancingPlanningReport from "@/reports/financingPlanningReport/FinancingPlanningReport";

export const relatorioRoutes = [
  {
    title: "Relatório - Financiamento X A Vista",
    href: "/financiamentoxavista/relatorio",
    description:
      "Compara as duas hipóteses quando o cliente tem o saldo para comprar a vista.",
    element: <FinanceOrCashReport />,
  },
  {
    title: "Relatório - Planejamento de Financiamento",
    href: "/planejamentofinanciamento/relatorio",
    description:
      "Compara as duas hipóteses com diferentes valores de investimento inicial",
    element: <FinancingPlanningReport />,
  },
];