import { propertyDataContext } from "@/PropertyDataContext";
import { ComparativeMonthlyInvestmentGrowthChart } from "@/components/charts/ComparativeMontlyInvestmentGrowthChart";
import ComparativeTotalEquityGrowth from "@/components/charts/ComparativeTotalEquityGrowth";
import { useContext } from "react";

export default function Comparative() {
  const { propertyData } = useContext(propertyDataContext);

  return (
    <div className="px-12 text-center">
      <h3 className="text-2xl font-bold text-center leading-7 mb-5">
        Comparativo:
      </h3>
      <p className="mb-5">
        No cenário de financiamento, o montante inicial disponível para
        investimento em renda fixa é substancialmente maior, o que resulta em
        rendimentos mais significativos desde o início. Esta vantagem inicial
        impulsiona um crescimento mais acelerado e exponencial ao longo do
        tempo, amplificando o efeito dos juros compostos sobre o capital
        investido.
      </p>
      <ComparativeMonthlyInvestmentGrowthChart propertyData={propertyData} />
      <p className="my-5">
        Neste cenário, o gráfico ilustra a evolução do patrimônio nos dois
        contextos - financiamento e pagamento à vista - destacando o crescimento
        progressivo do valor líquido do investimento imobiliário ao longo do
        tempo.
      </p>
      <ComparativeTotalEquityGrowth propertyData={propertyData} />
    </div>
  );
}
