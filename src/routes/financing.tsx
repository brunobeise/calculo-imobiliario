import FinancingPlanning from "@/pages/financiamento/financingPlanning";
import { FinancingPlanningCaseDataProvider } from "@/pages/financiamento/financingPlanning/CaseData";
import FinanceOrCash from "@/pages/financiamento/financeOrCash";
import { FinanceOrInCashCaseDataProvider } from "@/pages/financiamento/financeOrCash/CaseData";
import FinancingPlanningImage from "@/assets/financingPlanning.png";
import FinancingOrCashImage from "@/assets/financiamentoxavista.png";

export const financingRoutes = [
  {
    title: "Financiamento vs. Compra à Vista",
    href: "/financiamentoxavista",
    description:
      "Compara as duas hipóteses quando o cliente tem o saldo para comprar a vista.",
    element: (
      <FinanceOrInCashCaseDataProvider>
        <FinanceOrCash />
      </FinanceOrInCashCaseDataProvider>
    ),

    image: FinancingOrCashImage,
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
    image: FinancingPlanningImage,
  },
];
