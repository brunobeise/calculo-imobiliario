import { FinancingPlanningData } from "@/pages/planejamentofinanciamento/@id/CaseData";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { toBRL } from "@/lib/formatter";
import SectionTitle from "./SectionTitle";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

interface ProjectionReturnProps {
  propertyData: PropertyData;
  caseData: FinancingPlanningData;
  color: string;
  secondary: string;
}

export default function ProjectionReturn({
  propertyData,
  caseData,
  color,
  secondary,
}: ProjectionReturnProps) {
  const { totalProfit, totalProfitPercent } = caseData;

  const { downPayment, financingFees } = propertyData;

  return (
    <div className="p-4 px-4 lg:px-12 mx-auto">
      <div className="px-4 lg:px-0">
        <SectionTitle
          color={color}
          title={`Projeção de Retorno em ${propertyData.finalYear} anos`}
          secondary={secondary}
          icon={<FaMoneyBillTrendUp />}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          style={{ borderColor: color }}
          className="p-3 border rounded-2xl text-center shadow-sm"
        >
          <p style={{ color: secondary }} className="text-lg font-medium">
            Montante Final
          </p>
          <p style={{ color }} className="text-xl font-bold text-blue-600">
            {toBRL(
              caseData.finalRow.propertyValue -
                caseData.finalRow.outstandingBalance -
                caseData.brokerageFee -
                caseData.capitalGainsTax +
                caseData.finalRow.totalCapital
            )}
          </p>
        </div>
        <div
          style={{ borderColor: color }}
          className="p-3 border rounded-2xl text-center shadow-sm"
        >
          <p style={{ color: secondary }} className="text-lg font-medium">
            Lucro Total
          </p>
          <p style={{ color }} className="text-xl font-bold text-blue-600">
            {totalProfitPercent.toFixed(1)}%
          </p>
        </div>
        <div
          style={{ borderColor: color }}
          className="p-3 border rounded-2xl text-center shadow-sm"
        >
          <p style={{ color: secondary }} className="text-lg font-medium">
            Lucro Anual
          </p>
          <p style={{ color }} className="text-xl font-bold text-blue-600">
            {(totalProfitPercent / 7 || 0).toFixed(1)}%
          </p>
        </div>
      </div>

      <div style={{ color }} className="border rounded-md shadow-md">
        <div className="flex justify-center items-center border-b px-16 py-5">
          <p
            style={{ color }}
            className="text-lg text-nowrap lg:text-xl font-bold"
          >
            Lucro Líquido ={"  "}
            <span className="text-green">{toBRL(totalProfit)}</span>
          </p>
          <span className="text-xl lg:text-3xl mx-4">/</span>
          <p
            style={{ color }}
            className="text-lg text-nowrap lg:text-xl font-bold text-nowrap"
          >
            <span className="text-red ">
              {toBRL(
                propertyData.financingFees +
                  propertyData.downPayment +
                  caseData.totalRentalShortfall
              )}
            </span>{" "}
            = Investimento
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-[0.9rem] lg:text-md px-10 py-4">
          <div className="space-y-2 flex items-end flex-col pe-5">
            <div className="flex gap-1">
              <p className="font-medium">Valor do imóvel - </p>
              <strong className="text-green">
                {toBRL(caseData.finalRow.propertyValue)}
              </strong>
            </div>
            {caseData.finalRow.totalCapital > 0 && (
              <div className="flex gap-1">
                <p className="font-medium">Retorno Aplicação - </p>
                <strong className="text-green">
                  {toBRL(caseData.finalRow.totalCapital)}
                </strong>
              </div>
            )}

            <div className="flex gap-1">
              <p className="font-medium">Dívida Quitada - </p>
              <strong className="text-red">
                {toBRL(caseData.finalRow.outstandingBalance)}
              </strong>
            </div>
            {propertyData.considerCapitalGainsTax && (
              <div className="flex gap-1">
                <p className="font-medium">Impostos - </p>
                <strong className="text-red">
                  {toBRL(caseData.capitalGainsTax)}
                </strong>
              </div>
            )}
            <div className="flex gap-1">
              <p className="font-medium">Corretagem - </p>
              <strong className="text-red">
                {toBRL(caseData.brokerageFee)}
              </strong>
            </div>
          </div>

          <div className="space-y-2 flex items-start flex-col ps-5">
            <div className="flex gap-1">
              <strong className="text-red">{toBRL(downPayment)} - </strong>
              <p className="font-medium">Entrada </p>
            </div>
            {propertyData.discharges.reduce(
              (acc, val) => (val.isDownPayment ? acc + val.value : acc),
              0
            ) > 0 && (
              <div className="flex gap-1 text-nowrap">
                <strong className="text-red">
                  {toBRL(
                    propertyData.discharges.reduce(
                      (acc, val) => (val.isDownPayment ? acc + val.value : acc),
                      0
                    )
                  )}{" "}
                  -{" "}
                </strong>
                <p className="font-medium text-nowrap">
                  Parcelamento da entrada
                </p>
              </div>
            )}

            <div className="flex gap-1">
              <strong className="text-red">{toBRL(financingFees)} - </strong>
              <p className="font-medium">Documentação </p>
            </div>
            {propertyData.discharges.reduce(
              (acc, val) => (!val.isDownPayment ? acc + val.value : acc),
              0
            ) > 0 && (
              <div className="flex gap-1">
                <strong className="text-red">
                  {" "}
                  {toBRL(
                    propertyData.discharges.reduce(
                      (acc, val) =>
                        !val.isDownPayment ? acc + val.value : acc,
                      0
                    )
                  )}{" "}
                  -{" "}
                </strong>
                <p className="font-medium">Reforços </p>
              </div>
            )}

            <div className="flex gap-1">
              <strong className="text-red">
                {toBRL(
                  caseData.detailedTable.reduce(
                    (acc, val) =>
                      val.rentalAmount < 0 ? acc + val.rentalAmount * -1 : acc,
                    0
                  )
                )}{" "}
                -{" "}
              </strong>
              <p className="font-medium">Aluguel - Parcela </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
