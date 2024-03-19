import { numeroParaReal } from "@/lib/formatter";
import { IsolatedFinanceOrCashData } from "../../Context";
import UserSignature from "@/components/UserSignature";
import { PropertyData } from "@/propertyData/PropertyDataContext";

export default function Conclusion() {
 const propertyData: PropertyData = JSON.parse(
   localStorage.getItem("isolatedFinancingOrInCashPropertyData") || ""
 );

  const caseData: IsolatedFinanceOrCashData = JSON.parse(
    localStorage.getItem("isolatedFinancingOrInCashCaseData") || ""
  );

  return (
    <div className="px-12 pageBreakAfter">
      <h3 className="text-2xl font-bold text-center leading-7 my-5">
        Conclusão
      </h3>
      <div className="text-justify">
        <p className="mb-5">
          No cenário de financiamento, observamos um aproveitamento eficiente do
          capital disponível inicialmente. A entrada e as taxas, consideradas
          como o único investimento inicial, permitem um foco maior na
          potencialização dos retornos. Essa estratégia resulta em um lucro
          operacional maior sobre o investimento inicial. A abordagem focada no
          financiamento evidencia como a gestão eficaz do capital inicial pode
          gerar crescimento exponencial do investimento, especialmente quando
          beneficiado pelos juros compostos.
        </p>
        <p className="mb-5">
          Em contrapartida, a compra à vista apresenta um retorno absoluto
          maior. Embora este cenário ofereça um valor
          de retorno total superior, o financiamento se destaca por sua
          capacidade de maximizar os retornos percentuais sobre um investimento
          inicial mais concentrado.
        </p>
        <div className="grid grid-cols-2 mt-10 text-center gap-10">
          <div>
            <ul className="text-left">
              <li className="font-bold mb-2">Financiamento: </li>

              <li>
                Compra do imóvel:{" "}
                <span>
                  {numeroParaReal(
                    propertyData.downPayment + propertyData.financingFees
                  )}
                </span>
              </li>
              <li>
                Saldo devedor:{" "}
                <span>{numeroParaReal(propertyData.outstandingBalance)}</span>
              </li>
              <li>
                Valor do imóvel:{" "}
                <span>
                  {numeroParaReal(propertyData.appreciatedPropertyValue)}
                </span>
              </li>
              <li>
                Total aplicado final:{" "}
                <span>
                  {numeroParaReal(caseData.financing.investedEquityFinal)}
                </span>
              </li>
              <li>
                Patrimônio final:{" "}
                <span>
                  {numeroParaReal(caseData.financing.totalFinalEquity)}
                </span>
              </li>
              <li>
                Lucro total:{" "}
                <span className="font-bold">
                  {numeroParaReal(caseData.financing.totalProfit)}
                </span>
                {" (" + caseData.financing.totalProfitPercent.toFixed(2) + "%)"}{" "}
              </li>
            </ul>
          </div>
          <div>
            <ul className="text-left">
              <li className="font-bold mb-2">À Vista:</li>

              <li>
                Compra do imóvel:{" "}
                <span>{numeroParaReal(propertyData.propertyValue)}</span>
              </li>

              <li>
                Valor do imóvel:{" "}
                <span>
                  {numeroParaReal(propertyData.appreciatedPropertyValue)}
                </span>
              </li>
              <li>
                Total aplicado final:{" "}
                <span>
                  {numeroParaReal(caseData.inCash.investedEquityFinal)}
                </span>
              </li>
              <li>
                Patrimônio final:{" "}
                <span>{numeroParaReal(caseData.inCash.totalFinalEquity)}</span>
              </li>
              <li>
                Lucro total:{" "}
                <span className="font-bold">
                  {numeroParaReal(caseData.inCash.totalProfit)}
                </span>
                {" (" + caseData.inCash.totalProfitPercent.toFixed(2) + "%)"}{" "}
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-5 text-center text-xl">
          Diferença de lucro:{" "}
          <span className="font-bold">
            {Math.abs(
              caseData.financing.totalProfitPercent -
                caseData.inCash.totalProfitPercent
            ).toFixed(2) + "%"}
          </span>
        </p>
        <p className="mb-10 text-sm text-center text-[#7b7b7b]">
          {caseData.financing.totalProfitPercent -
            caseData.inCash.totalProfitPercent >
          0 ? (
            <>utilizando financiamento</>
          ) : (
            <>comprando à vista</>
          )}
        </p>
        <p className="mb-5">
          Optar pelo financiamento imobiliário é escolher a inteligência
          financeira a seu favor. Com um investimento inicial menor, libera-se
          capital para diversificar investimentos e aproveitar outras
          oportunidades de mercado. Ao longo do tempo, o crescimento percentual
          obtido pelo financiamento supera o da compra à vista, demonstrando não
          apenas a viabilidade, mas a superioridade dessa estratégia em termos
          de alavancagem financeira e flexibilidade. Financiar é, portanto, mais
          do que adquirir um imóvel; é maximizar seu potencial econômico.
        </p>
        <div className="mt-32">
          <UserSignature />
        </div>
      </div>
    </div>
  );
}
