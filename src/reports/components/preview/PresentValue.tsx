import { FinancingPlanningData } from "@/pages/planejamentofinanciamento/@id/CaseData";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import SectionTitle from "./SectionTitle";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { toBRL } from "@/lib/formatter";
import InfoItem from "./InfoItem";
import { MonthlyInvestmentGrowthChart } from "@/components/charts/MonthlyInvestmentGrowthChart";
import dayjs from "dayjs";

interface PresentValueProps {
  color: string;
  secondary: string;
  caseData: FinancingPlanningData;
  propertyData: PropertyData;
}

export default function PresentValue(props: PresentValueProps) {
  const { caseData, color, secondary, propertyData } = props;
  return (
    <>
      <div className="w-full px-12 mt-10">
        <SectionTitle
          color={color}
          secondary={secondary}
          icon={<FaMoneyBillTransfer />}
          title="Conversão do investimento para valor presente"
        />
        <div className=" col-span-2 mb-10">
          <p style={{ color: secondary }} className="text-lg">
            O valor presente (VP) de um pagamento mensal mostra quanto um
            pagamento futuro vale hoje. Isso acontece porque o dinheiro perde
            valor com o tempo. Em outras palavras, o valor presente representa
            quanto seria necessário investir hoje para alcançar um valor que
            será pago no futuro. Embora o pagamento ou investimento mensal possa
            permanecer o mesmo, o valor presente desse pagamento diminui quanto
            mais distante ele estiver no tempo. Isso ajuda a entender o impacto
            financeiro de compromissos ou investimentos futuros no momento
            atual.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div style={{ color, borderColor: secondary }} className="min-h-[170px] rounded-2xl border ">
            <table className="min-w-full ">
              <thead className="">
                <tr>
                  <th   style={{ color, borderColor: secondary }} className="px-4 py-2  border-r border-b  text-left"></th>
                  <th   style={{ color, borderColor: secondary }} className="px-4 py-2  border-r border-b  text-left">
                    <div className="flex flex-col">
                      <strong>Investimento excedente em valor real</strong>
                    </div>
                  </th>
                  <th   style={{ color, borderColor: secondary }} className="px-4 py-2  border-b text-left">
                    <div className="flex flex-col">
                      <strong>
                        Investimento excedente convertido em valor presente
                      </strong>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {caseData?.detailedTable?.[0] &&
                  (caseData.detailedTable[0].rentValue -
                    propertyData.installmentValue) *
                    -1 >
                    0 && (
                    <tr className="">
                      <td   style={{ color, borderColor: secondary }} className="px-4 py-2 border-r border-b w-[100px]">
                        <strong>
                          {" "}
                          {dayjs(propertyData.initialDate, "MM/YYYY")
                            .add(1, "month")
                            .format("MM/YYYY")}
                        </strong>
                      </td>
                      <td   style={{ color, borderColor: secondary }} className="px-4 py-2 border-r border-b">
                        {toBRL(caseData.detailedTable[0].investmentExcess)}
                      </td>
                      <td   style={{ color, borderColor: secondary }} className="px-4 py-2 border-b">
                        {toBRL(
                          caseData.detailedTable[0].investmentExcessPresentValue
                        )}
                      </td>
                    </tr>
                  )}
                {caseData?.detailedTable?.[
                  Math.floor(caseData.detailedTable.length / 2)
                ] &&
                  caseData.detailedTable[
                    Math.floor(caseData.detailedTable.length / 2)
                  ].rentalAmount *
                    -1 >
                    0 && (
                    <tr className="">
                      <td   style={{ color, borderColor: secondary }} className="px-4 py-2 border-r border-b w-[100px]">
                        <strong>
                          {dayjs(propertyData.initialDate, "MM/YYYY")
                            .add(
                              Math.floor(caseData.detailedTable.length / 2) + 1,
                              "month"
                            )
                            .format("MM/YYYY")}
                        </strong>
                      </td>
                      <td   style={{ color, borderColor: secondary }} className="px-4 py-2 border-r border-b ">
                        {toBRL(
                          caseData.detailedTable[
                            Math.floor(caseData.detailedTable.length / 2)
                          ].investmentExcess
                        )}
                      </td>
                      <td   style={{ color, borderColor: secondary }} className="px-4 py-2  border-b ">
                        {toBRL(
                          caseData.detailedTable[
                            Math.floor(caseData.detailedTable.length / 2)
                          ].investmentExcessPresentValue
                        )}
                      </td>
                    </tr>
                  )}
                {caseData?.detailedTable
                  ?.slice()
                  .reverse()
                  .find(
                    (item) =>
                      item.rentalShortfall !== 0 ||
                      item.investmentExcessPresentValue !== 0
                  ) && (
                  <tr className="">
                    <td   style={{ color, borderColor: secondary }} className="px-4 py-2 border-r w-[100px]">
                      <strong>
                        {dayjs(propertyData.initialDate, "MM/YYYY")
                          .add(
                            caseData.detailedTable.findIndex(
                              (item) => item.investmentExcessPresentValue === 0
                            ) + 1,
                            "month"
                          )
                          .format("MM/YYYY")}
                      </strong>
                    </td>
                    <td   style={{ color, borderColor: secondary }} className="px-4 py-2 border-r ">
                      {toBRL(
                        caseData.detailedTable
                          .slice()
                          .reverse()
                          .find(
                            (item) => item.investmentExcessPresentValue !== 0
                          )?.investmentExcess
                      )}
                    </td>
                    <td   style={{ color, borderColor: secondary }} className="px-4 py-2">
                      {toBRL(
                        caseData.detailedTable
                          .slice()
                          .reverse()
                          .find(
                            (item) => item.investmentExcessPresentValue !== 0
                          )!.investmentExcessPresentValue
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ color }} className="grid grid-cols-2  mb-4">
            <InfoItem
              color={color}
              secondary={secondary}
              text="Total Investido em valor:"
              value={caseData.finalRow.rentalShortfall}
              type="reais"
            />
            <InfoItem
              color={color}
              secondary={secondary}
              text="Total Investido em VP:"
              value={caseData.detailedTable.reduce(
                (acc, val) => acc + val.investmentExcessPresentValue,
                0
              )}
              type="reais"
            />
            <InfoItem
              color={color}
              secondary={secondary}
              text="Lucro Percentual em valor:"
              value={
                (caseData.totalProfit /
                  (propertyData.financingFees +
                    propertyData.downPayment +
                    caseData.totalRentalShortfall)) *
                100
              }
              type="percent"
            />

            <InfoItem
              color={color}
              secondary={secondary}
              text="Lucro Percentual em VP:"
              value={caseData.totalProfitPercent}
              type="percent"
            />
          </div>

          <MonthlyInvestmentGrowthChart
            color={color}
            rentValues={caseData.detailedTable.map((i) => i.rentValue)}
            initialCapitalYields={caseData.detailedTable.map(
              (i) => i.initialCapitalYield
            )}
            installmentValues={caseData.detailedTable.map(
              () => propertyData.installmentValue
            )}
            monthlyInvestmentValues={caseData.detailedTable.map(
              (i) => i.investmentExcessPresentValue
            )}
          />
        </div>
      </div>
    </>
  );
}
