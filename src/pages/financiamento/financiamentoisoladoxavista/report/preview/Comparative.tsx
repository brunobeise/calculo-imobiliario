import { PropertyData } from "@/propertyData/PropertyDataContext";
import { ComparativeMonthlyInvestmentGrowthChart } from "@/components/charts/ComparativeMontlyInvestmentGrowthChart";
import ComparativeTotalEquityGrowth from "@/components/charts/ComparativeTotalEquityGrowth";
import { IsolatedFinanceOrCashData } from "../../Context";
import ComparativePercentageGrowthChart from "@/components/charts/ComparativePercentageGrowthChart";

export default function Comparative() {
  const propertyData: PropertyData = JSON.parse(
    localStorage.getItem("isolatedFinancingOrInCashPropertyData") || ""
  );

  const caseData: IsolatedFinanceOrCashData = JSON.parse(
    localStorage.getItem("isolatedFinancingOrInCashCaseData") || ""
  );

  return (
    <div className="px-12 text-center">
      <h3 className="text-2xl font-bold text-center leading-7 mt-5">
        Comparativo:
      </h3>

      <div className="min-h-[280mm]">
        <div className="mt-2 mb-5">
          <p className="mb-5 text-justify">
            O gráfico destaca uma jornada financeira onde, inicialmente, o
            financiamento apresenta valores negativos devido às parcelas, mas
            com o tempo, esses valores se tornam positivos e começam a crescer.
            Em contraste, o método de compra à vista mostra ganhos consistentes
            desde o início, já que um montante significativo é investido direto
            no imóvel, evitando dívidas. Contudo, o financiamento deve ser visto
            não apenas como um custo, mas como uma alavanca estratégica que
            permite a retenção de capital para outros investimentos, podendo, a
            longo prazo, resultar em uma vantagem financeira devido ao potencial
            de investimento do dinheiro que não foi usado na compra imediata do
            imóvel.
          </p>
        
            <ComparativeMonthlyInvestmentGrowthChart
              finalYear={propertyData.finalYear}
              financingValues={caseData.financing.detailedTable.map(
                (r) =>
                  r.rentValue +
                  r.initialCapitalYield -
                  propertyData.installmentValue
              )}
              inCashValues={caseData.inCash.detailedTable.map(
                (r) => r.rentValue + r.initialCapitalYield
              )}
            />
    
        </div>
        <div className="mt-2">
          <p className="mb-5 text-justify">
            Neste cenário, o gráfico ilustra a evolução do patrimônio nos dois
            contextos - financiamento e pagamento à vista - destacando o
            crescimento progressivo do valor líquido do investimento imobiliário
            ao longo do tempo. A diferença ocorre porque nao há saldo devedor no
            cenário à vista.
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
            Lucro Relativo:
          </h3>
          <p className="text-justify">
            O financiamento emerge como a estratégia superior quando
            consideramos o desempenho relativo do investimento. Ao exigir um
            investimento inicial significativamente menor, o financiamento
            alavanca o capital disponível de maneira eficiente, produzindo
            melhores resultados percentuais. Isso demonstra que o dinheiro
            poupado pela opção de financiar pode ser empregado em outras
            oportunidades de investimento, aumentando o potencial geral de
            crescimento do patrimônio.
          </p>
        </div>
        <div className="relative my-10">
          <ComparativePercentageGrowthChart
            finalYear={propertyData.finalYear}
            financingValues={caseData.financing.detailedTable.map(
              (r) =>
                (r.monthlyProfit /
                  (propertyData.downPayment + propertyData.financingFees)) *
                100
            )}
            inCashValues={caseData.inCash.detailedTable.map(
              (r) =>
                (r.monthlyProfit /
                  (propertyData.propertyValue + propertyData.inCashFees)) *
                100
            )}
          />
        </div>
        <p className="text-justify">
          O gráfico destaca que o financiamento não só otimiza o uso do capital
          inicial, mas também, ao longo do tempo, ultrapassa a compra à vista em
          termos de lucratividade relativa, reforçando o financiamento como a
          escolha astuta para quem busca maximizar o retorno sobre o
          investimento.
        </p>
      </div>
    </div>
  );
}
