import { propertyDataContext } from "@/PropertyDataContext";
import { BreakEvenChart } from "@/components/charts/BreakEvenChart";
import { ComparativeMonthlyInvestmentGrowthChart } from "@/components/charts/ComparativeMontlyInvestmentGrowthChart";
import ComparativeTotalEquityGrowth from "@/components/charts/ComparativeTotalEquityGrowth";
import { useContext } from "react";
import { FinanceOrCashData } from "../../Context";

export default function Comparative() {
  const { propertyData } = useContext(propertyDataContext);

  const caseData: FinanceOrCashData = JSON.parse(
    localStorage.getItem("financingOrInCashCaseData") || ""
  );

  return (
    <div className="px-12 text-center">
      <h3 className="text-2xl font-bold text-center leading-7 mb-5">
        Comparativo:
      </h3>
      <div className="">
        <div className="min-h-[280mm]">
          <div className="mt-10 mb-5">
            <p className="mb-5">
              No cenário de financiamento, o montante inicial disponível para
              investimento em renda fixa é substancialmente maior, o que resulta
              em rendimentos mais significativos desde o início. Esta vantagem
              inicial impulsiona um crescimento mais acelerado e exponencial ao
              longo do tempo, amplificando o efeito dos juros compostos sobre o
              capital investido.
            </p>

            <ComparativeMonthlyInvestmentGrowthChart
              propertyData={propertyData}
            />
          </div>
          <div className="mt-10">
            <p className="mb-5">
              Neste cenário, o gráfico ilustra a evolução do patrimônio nos dois
              contextos - financiamento e pagamento à vista - destacando o
              crescimento progressivo do valor líquido do investimento
              imobiliário ao longo do tempo.
            </p>

            <ComparativeTotalEquityGrowth propertyData={propertyData} />
          </div>
        </div>
        <div className="min-h-[280mm]">
          <div>
            <h3 className="text-xl font-bold text-center leading-7 mb-5">
              Ponto de equilíbrio:
            </h3>
            <p>
              O ponto de equilíbrio é como um marco financeiro onde você não
              está mais perdendo nem ganhando dinheiro - está no zero a zero. No
              caso de um imóvel, é quando o lucro obtido, seja por aluguel ou
              por investimento do dinheiro que poderia ter ido para uma compra à
              vista, iguala exatamente o valor que foi gasto ou ainda se deve
              pelo imóvel. A partir desse ponto, você começa a ganhar dinheiro.
            </p>
          </div>
          <div className="relative my-10">
            <h3 className="text-2xl font-bold text-center leading-7 mt-3 mb-1">
              Ponto de equilíbrio do financiamento:
            </h3>
            <BreakEvenChart context="financing" propertyData={propertyData} />
            <p className="absolute bottom-[10%] right-[5%] font-bold text-xl">
              {caseData.financing.breakEven && (
                <> Ponto de equilíbrio no mês {caseData.financing.breakEven}</>
              )}
            </p>
          </div>
          <p>
            No financiamento, esse ponto chega quando o dinheiro que você recebe
            de aluguel do imóvel que você comprou com financiamento é suficiente
            para pagar todas as parcelas restantes. Você alcança um equilíbrio
            entre o custo do empréstimo e o retorno, e cada centavo a partir daí
            é lucro.
          </p>
        </div>
      </div>
    </div>
  );
}
