import IsolatedFinancingOrCash from "@/pages/financiamento/financiamentoisoladoxavista";
import { IsolatedFinanceOrInCashCaseDataProvider } from "@/pages/financiamento/financiamentoisoladoxavista/CaseData";
import FinancingOrCash from "@/pages/financiamento/financiamentoxavista";
import { FinanceOrInCashCaseDataProvider } from "@/pages/financiamento/financiamentoxavista/Context";

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
    title: "Financiamento Isolado X A Vista",
    href: "/financiamentoisoladoxavista",
    description:
      "Compara as duas hipóteses quando o cliente tem o saldo para comprar a vista.",
    element: (
      <IsolatedFinanceOrInCashCaseDataProvider>
        <IsolatedFinancingOrCash />
      </IsolatedFinanceOrInCashCaseDataProvider>
    ),
  },
];
