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
          Quando pensamos em adquirir um imóvel, surgem duas opções: pagar tudo
          de uma vez ou financiar. Este relatório compara essas alternativas e
          conclue que o financiamento não é apenas uma questão de possibilidade,
          mas também de inteligência financeira.
        </p>
        <p className="mb-5">
          Com o financiamento, você começa com menos dinheiro do bolso, e esse
          "extra" que você teria gasto pode crescer se investido com sabedoria.
          Além disso, o imóvel que você está pagando aos poucos e o aluguel que
          ele pode gerar estão propensos a valorizar com o tempo, aumentando seu
          retorno.
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
            {numeroParaReal(
              Math.abs(
                caseData.financing.totalProfit - caseData.inCash.totalProfit
              )
            )}
          </span>
        </p>
        <p className="mb-10 text-sm text-center text-[#7b7b7b]">
          {caseData.financing.totalProfit - caseData.inCash.totalProfit > 0 ? (
            <>utilizando financiamento</>
          ) : (
            <>comprando à vista</>
          )}
        </p>
        <p className="mb-5">
          Os números falam por si: após 6 anos, o valor acumulado pelo
          financiamento supera o da compra à vista. Isso significa que seu
          dinheiro trabalhou para você, e o imóvel financiado se tornou o
          caminho para um patrimônio maior.
        </p>
        <div className="mt-72">
          <UserSignature />
        </div>
      </div>
    </div>
  );
}
