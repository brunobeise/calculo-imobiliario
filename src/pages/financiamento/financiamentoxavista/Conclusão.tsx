import { Sheet } from "@mui/joy";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import { numeroParaReal } from "@/lib/formatter";

import { useContext } from "react";
import { FinanceOrCashData } from "./Context";

interface ConclusãoProps {
  context: "financing" | "inCash";
  caseData: FinanceOrCashData;
}

export default function Conclusão({ caseData, context }: ConclusãoProps) {
  const { propertyData } = useContext(propertyDataContext);

  if (caseData[context].detailedTable.length > 0)
    return (
      <Sheet
        variant="outlined"
        className="col-span-12 md:col-span-6 lg:col-span-4 order-last lg:order-none text-center p-5"
      >
        <h2 className="text-xl text-center my-2 font-bold">Conclusão</h2>
        <p className="text-md mb-7 text-center">
          Resultado após {propertyData.finalYear} anos
        </p>

        <div className="text-xl col-span-4 px-8">
          <div className="flex justify-between items-center">
            <span>- Valor do imóvel</span>
            <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
            <span className="text-green">
              {numeroParaReal(caseData[context].finalRow.propertyValue)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>- Aplicado</span>
            <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
            <span className="text-green">
              {numeroParaReal(
                caseData[context].finalRow.initialCapital +
                  caseData[context].finalRow.rentalIncomeCapital
              )}
            </span>
          </div>

          <div className="flex justify-between items-center items-center">
            <span>- Dívida</span>
            <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
            <span className="text-red">
              {numeroParaReal(caseData[context].finalRow.outstandingBalance)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>- Valor Investido</span>
            <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
            <span className="text-red">
              {numeroParaReal(
                propertyData.financingFees +
                  propertyData.downPayment +
                  (propertyData.personalBalance -
                    (propertyData.financingFees + propertyData.downPayment))
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span> - Corretagem</span>
            <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
            <span className="text-red">
              {numeroParaReal(caseData[context].finalRow.propertyValue * 0.06)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span> - Imposto Ganho de Capital</span>
            <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
            <span className="text-red">
              {numeroParaReal(caseData[context].capitalGainsTax)}
            </span>
          </div>

          <div className="flex justify-between items-center font-bold">
            <span>Lucro Líquido</span>
            <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
            <span className="text-green">
              {numeroParaReal(caseData[context].totalProfit)}
            </span>
          </div>
        </div>

        {caseData[context].breakEven !== 0 && (
          <p className="text-xs mt-5">
            *Break-even no mes <strong> {caseData[context].breakEven} </strong>
          </p>
        )}
      </Sheet>
    );
}
