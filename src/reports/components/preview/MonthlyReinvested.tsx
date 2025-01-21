import { toBRL } from "@/lib/formatter";
import { FinancingPlanningData } from "@/pages/planejamentofinanciamento/@id/CaseData";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import dayjs from "dayjs";
import InfoItem from "./InfoItem";
import { InvestmentAccumulationChart } from "@/components/charts/InvestmentAccumulationChart";
import SectionTitle from "./SectionTitle";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { DirectFinancingData } from "@/pages/parcelamentodireto/@id/CaseData";

interface MonthlyReinvestedProps {
  caseData: FinancingPlanningData | DirectFinancingData;
  propertyData: PropertyData;
  color: string;
  secondary: string;
}

export default function MonthlyReinvested(props: MonthlyReinvestedProps) {
  const { caseData, propertyData, color, secondary } = props;

  return (
    <div style={{ color }} className="w-full px-12 mt-10">
      <SectionTitle
        title="Reinvestimento do Lucro Mensal em Renda Fixa"
        color={color}
        secondary={secondary}
        icon={<FaMoneyBillTransfer />}
      />
      <div className="col-span-2 mb-10">
        <p style={{ color: secondary }}>
          No cálculo mensal do investimento imobiliário, é comum que a diferença
          entre o valor do aluguel recebido e a parcela do financiamento resulte
          em um valor positivo. Essa diferença representa o lucro mensal gerado
          pelo imóvel. Quando este lucro é reinvestido em renda fixa, ele não
          apenas proporciona uma rentabilidade adicional, mas também contribui
          para o aumento do patrimônio ao longo do tempo. Esse estratégia de
          reinvestimento potencializa o retorno total do investimento,
          tornando-o mais sólido e sustentável
        </p>
      </div>

      <div style={{ borderColor: secondary }} className="rounded-2xl border">
        <table className="min-w-full ">
          <thead>
            <tr>
              <th
                style={{ color, borderColor: secondary }}
                className="px-4 py-2 border-r border-b text-left"
              ></th>
              <th
                style={{ color, borderColor: secondary }}
                className="px-4 py-2 border-r border-b text-left"
              >
                <div className="flex flex-col">
                  <strong>Valor do reinvestimento</strong>
                </div>
              </th>
              <th
                style={{ color, borderColor: secondary }}
                className="px-4 py-2 border-b text-left"
              >
                <div className="flex flex-col">
                  <strong>Total aplicado até o momento</strong>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {caseData.detailedTable.find((item) => item.rentalAmount > 0) && (
              <>
                {(() => {
                  const firstPositiveRentalIndex =
                    caseData.detailedTable.findIndex(
                      (item) => item.rentalAmount > 0
                    );

                  const twelveMonthsLaterIndex = firstPositiveRentalIndex + 24;
                  const twentyFourMonthsLaterIndex =
                    firstPositiveRentalIndex + 48;

                  return (
                    <>
                      <tr>
                        <td
                          style={{ color, borderColor: secondary }}
                          className="px-4 py-2 border-r border-t w-[100px]"
                        >
                          {dayjs(propertyData.initialDate, "MM/YYYY")
                            .add(firstPositiveRentalIndex + 1, "month")
                            .format("MM/YYYY")}
                        </td>
                        <td
                          style={{ color, borderColor: secondary }}
                          className="px-4 py-2 border-r border-t"
                        >
                          {toBRL(
                            caseData.detailedTable[firstPositiveRentalIndex]
                              ?.rentalAmount
                          )}
                        </td>
                        <td
                          style={{ color, borderColor: secondary }}
                          className="px-4 py-2 border-t"
                        >
                          {toBRL(
                            caseData.detailedTable[firstPositiveRentalIndex]
                              ?.totalCapital
                          )}
                        </td>
                      </tr>

                      {caseData.detailedTable[twelveMonthsLaterIndex]
                        ?.rentalAmount && (
                        <tr>
                          <td
                            style={{ color, borderColor: secondary }}
                            className="px-4 py-2 border-r border-t w-[100px]"
                          >
                            {dayjs(propertyData.initialDate, "MM/YYYY")
                              .add(twelveMonthsLaterIndex + 1, "month")
                              .format("MM/YYYY")}
                          </td>
                          <td
                            style={{ color, borderColor: secondary }}
                            className="px-4 py-2 border-r border-t"
                          >
                            {toBRL(
                              caseData.detailedTable[twelveMonthsLaterIndex]
                                ?.rentalAmount
                            )}
                          </td>
                          <td
                            style={{ color, borderColor: secondary }}
                            className="px-4 py-2 border-t"
                          >
                            {toBRL(
                              caseData.detailedTable[twelveMonthsLaterIndex]
                                ?.totalCapital
                            )}
                          </td>
                        </tr>
                      )}

                      {caseData.detailedTable[twentyFourMonthsLaterIndex]
                        ?.rentalAmount && (
                        <tr>
                          <td
                            style={{ color, borderColor: secondary }}
                            className="px-4 py-2 border-r border-t w-[100px]"
                          >
                            {dayjs(propertyData.initialDate, "MM/YYYY")
                              .add(twentyFourMonthsLaterIndex + 1, "month")
                              .format("MM/YYYY")}
                          </td>
                          <td
                            style={{ color, borderColor: secondary }}
                            className="px-4 py-2 border-r border-t"
                          >
                            {toBRL(
                              caseData.detailedTable[twentyFourMonthsLaterIndex]
                                ?.rentalAmount
                            )}
                          </td>
                          <td
                            style={{ color, borderColor: secondary }}
                            className="px-4 py-2 border-r border-t"
                          >
                            {toBRL(
                              caseData.detailedTable[twentyFourMonthsLaterIndex]
                                ?.totalCapital
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 mb-20 mt-10">
        <InfoItem
          color={color}
          secondary={secondary}
          type="reais"
          text="Valor Total Aplicado:"
          value={(caseData as FinancingPlanningData).detailedTable.reduce(
            (acc, val) => (val.rentalAmount > 0 ? acc + val.rentalAmount : acc),
            0
          )}
        />
        <InfoItem
          color={color}
          secondary={secondary}
          type="reais"
          text="Total Acumulado:"
          value={caseData.finalRow.totalCapital}
        />
        <InfoItem
          color={color}
          secondary={secondary}
          type="reais"
          text="Total de Ganho em Juros:"
          value={
            caseData.finalRow.totalCapital -
            (caseData as FinancingPlanningData).detailedTable.reduce(
              (acc, val) =>
                val.rentalAmount > 0 ? acc + val.rentalAmount : acc,
              0
            )
          }
        />

        <p style={{ color: secondary }}>
          Juros Considerados:{" "}
          <span style={{ color }} className="font-bold">
            {propertyData.monthlyYieldRate + "%/mês"}
          </span>
        </p>
      </div>

      <InvestmentAccumulationChart
        accumulatedValues={caseData.detailedTable.map((i) => i.totalCapital)}
      />
    </div>
  );
}
