

import FinancingPlanning from "@/pages/financiamento/financiamentoisoladoxavista";
import { FinancingPlanningCaseDataProvider } from "@/pages/financiamento/financiamentoisoladoxavista/CaseData";
import FinancingOrCash from "@/pages/financiamento/financiamentoxavista";
import { FinanceOrInCashCaseDataProvider } from "@/pages/financiamento/financiamentoxavista/CaseData";

export const financingRoutes = [
  {
    title: "Financiamento X A Vista",
    href: "/financiamentoxavista",
    description:
      "Compara as duas hipóteses quando o cliente tem o saldo para comprar a vista.",
    element: (
      <FinanceOrInCashCaseDataProvider>
        <FinancingOrCash />
      </FinanceOrInCashCaseDataProvider>
    ),
  },
  {
    title: "Planejamento de Financiamento",
    href: "/planejamentofinanciamento",
    description:
      "Faz um plano de aquisição com a estratégia de financiamento imobiliário.",
    element: (
      <FinancingPlanningCaseDataProvider>
        <FinancingPlanning />
      </FinancingPlanningCaseDataProvider>
    ),
  },
];
