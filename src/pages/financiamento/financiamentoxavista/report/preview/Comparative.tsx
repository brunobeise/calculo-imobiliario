import { propertyDataContext } from "@/propertyData/PropertyDataContext";
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
      <h3 className="text-2xl font-bold text-center leading-7 my-5">
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
              finalYear={propertyData.finalYear}
              financingValues={caseData.financing.detailedTable.map(
                (r) =>
                  r.rentValue +
                  r.initialCapitalYield +
                  r.rentalIncomeYield -
                  propertyData.installmentValue
              )}
              inCashValues={caseData.inCash.detailedTable.map(
                (r) =>
                  r.rentValue +
                  r.initialCapitalYield +
                  r.rentalIncomeYield -
                  propertyData.installmentValue
              )}
            />
          </div>
          <div className="mt-10">
            <p className="mb-5">
              Neste cenário, o gráfico ilustra a evolução do patrimônio nos dois
              contextos - financiamento e pagamento à vista - destacando o
              crescimento progressivo do valor líquido do investimento
              imobiliário ao longo do tempo.
            </p>

            <ComparativeTotalEquityGrowth
              finalYear={propertyData.finalYear}
              financingValues={caseData.financing.detailedTable.map(
                (r) => r.finalValue
              )}
              inCashValues={caseData.inCash.detailedTable.map(
                (r) => r.finalValue
              )}
            />
          </div>
        </div>
        <div className="min-h-[280mm]">
          <div>
            <h3 className="text-2xl font-bold text-center leading-7 my-5">
              Ponto de equilíbrio:
            </h3>
            <p className="text-justify">
              O ponto de equilíbrio é alcançado quando seus ganhos, seja do
              aluguel ou de investimentos, cobrem totalmente o montante
              investido ou devido no financiamento do imóvel. Este marco indica
              que você não tem mais prejuízo; qualquer rendimento adicional é
              considerado lucro. Na prática, no financiamento, isso acontece
              quando o lucro do aluguel mais os rendimentos acumulados são
              suficientes para liquidar as parcelas pendentes do empréstimo,
              fazendo com que todo ganho subsequente contribua diretamente para
              o aumento do seu patrimônio.
            </p>
          </div>
          <div className="relative my-10">
            <BreakEvenChart
              profitValues={caseData.financing.detailedTable.map(
                (i, _i, arr) => i.initialCapital - arr[0].initialCapital
              )}
              outstandingBalanceValues={caseData.financing.detailedTable.map(
                (i) => i.outstandingBalance
              )}
            />
            <p className="absolute bottom-[12%] right-[5%] font-bold text-xl">
              {caseData.financing.breakEven && (
                <> Ponto de equilíbrio no mês {caseData.financing.breakEven}</>
              )}
            </p>
          </div>
          <p className="text-justify">
            Ao chegar no mês {caseData.financing.breakEven}, os rendimentos
            obtidos a partir do seu investimento inicial, juntamente com os
            lucros acumulados do aluguel, atingiram um ponto crucial: eles são
            agora suficientes para quitar completamente o saldo devedor do seu
            financiamento.
          </p>
        </div>
      </div>
    </div>
  );
}
