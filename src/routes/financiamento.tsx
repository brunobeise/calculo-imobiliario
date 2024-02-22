import FinanciamentoXAvista from "@/pages/financiamento/financiamentoxavista";
import { FinanceOrInCashCaseDataProvider } from "@/pages/financiamento/financiamentoxavista/Context";

export const financiamentoRoutes = [
  {
    title: "Financiamento X A Vista",
    href: "/financiamentoxavista",
    description:
      "Compara as duas hipóteses quando o cliente tem o saldo para comprar a vista.",
    element: (
      <FinanceOrInCashCaseDataProvider>
        <FinanciamentoXAvista />
      </FinanceOrInCashCaseDataProvider>
    ),
  },
];
