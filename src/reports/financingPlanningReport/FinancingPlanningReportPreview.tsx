import { forwardRef } from "react";
import UserSignature2 from "@/components/user/UserSignature2";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import lucroAnualFinal from "./assets/lucro-anual-total.svg";
import entendaOFinancimento from "./assets/entenda-o-financimento.svg";
import { toBRL } from "@/lib/formatter";
import InitialEquityDivisionChart from "@/components/charts/InitialEquityDivisionChart";
import { MonthlyInvestmentGrowthChart } from "@/components/charts/MonthlyInvestmentGrowthChart";
import CompleteAnalysisChart from "@/components/charts/CompleteAnalysisChart";
import { FinancingPlanningReportData } from "./FinancingPlanningReportConfig";
import { FinancingPlanningData } from "@/pages/financiamento/financingPlanning/CaseData";
import InfoRow from "../components/preview/InfoRow";
import CalculationTable from "../components/preview/CalculationTable";
import dayjs from "dayjs";
import { InvestmentAccumulationChart } from "@/components/charts/InvestmentAccumulationChart";
import { CDIComparation } from "@/components/charts/CDIComparation";
import { User } from "@/types/userTypes";

interface FinancingPlanningReportPreviewProps {
  configData: FinancingPlanningReportData;
  propertyData?: PropertyData;
  caseData?: FinancingPlanningData;
  user?: User;
}

const FinancingPlanningReportPreview = forwardRef<
  HTMLDivElement,
  FinancingPlanningReportPreviewProps
>(
  (
    { configData, propertyData, caseData, user }: FinancingPlanningReportPreviewProps,
    ref
  ) => {
    if (!propertyData) return null;
    if (!caseData) return null;

    const InfoItemReais = ({
      text,
      value,
    }: {
      text: string;
      value: number;
    }) => (
      <p>
        {text}
        {"  "}
        <span className="font-bold">{toBRL(value)}</span>
      </p>
    );

    const InfoItemPercent = ({
      text,
      value,
    }: {
      text: string;
      value: number;
    }) => (
      <p>
        {text}
        {"  "}
        <span className="font-bold">{value.toFixed(2) + "%"}</span>
      </p>
    );

    const InfoItemYears = ({
      text,
      value,
    }: {
      text: string;
      value: number;
    }) => (
      <p>
        {text}
        {"  "}
        <span className="font-bold">{value + " Anos"}</span>
      </p>
    );

    const InfoItemDate = ({ text, value }: { text: string; value: string }) => (
      <p>
        {text}
        {"  "}
        <span className="font-bold">
          {" "}
          {dayjs(value, "MM/YYYY").format("MMM/YYYY")}
        </span>
      </p>
    );

    return (
      <div
        ref={ref}
        className="lg:col-span-7 uw:col-span-6 !w-[210mm] shadow light !bg-whitefull mb-[1000px]"
      >
        <div className="!bg-whitefull flex flex-col items-center w-full overflow-hidden !m-0">
          <div className="w-full h-[297mm]">
            <div className="bg-primary w-full flex items-center">
              <UserSignature2 getUser={!user} userData={user} desc={configData.propertyName} />
            </div>
            <div className="h-[460px] overflow-hidden flex justify-center items-center relative w-full">
              <img className="w-full h-full" src={configData.mainPhoto} />
              <div className="absolute bottom-0 h-[150px] w-full bg-gradient-to-t from-[#000000de] to-transparent flex items-center px-10 text-lg font-light">
                <p className="whitespace-pre text-whitefull text-xl">
                  {configData.description}{" "}
                </p>
              </div>
            </div>
            <div className="bg-primary mt-10 text-white flex justify-center p-1 mx-14 text-[1.4rem]">
              <strong>
                Melhor Cenário de Compra / Projeção em {propertyData.finalYear}{" "}
                anos{" "}
              </strong>
            </div>
            <div className="grid grid-cols-7 mt-10 w-full px-14 text-primary">
              <div className="col-span-3 relative mt-20 ms-5">
                <span className="absolute font-bold text-3xl top-[4.4rem] left-[6rem]">
                  {caseData.totalProfitPercent.toFixed(2) + "%"}
                </span>
                <span className="absolute font-bold text-3xl top-[4.4rem] left-[-1.5rem]">
                  {(
                    caseData.totalProfitPercent / propertyData.finalYear
                  ).toFixed(2) + "%"}
                </span>
                <img className="w-[250px] absolute" src={lucroAnualFinal} />
              </div>
              <div className="min-h-[345px] flex items-center col-span-4 ">
                <div className="text-xl w-full ">
                  <InfoRow
                    valueClass="text-green"
                    label="Valor do imóvel"
                    value={caseData.finalRow.propertyValue}
                  />

                  <InfoRow
                    valueClass="text-green"
                    label="Aplicado"
                    value={caseData.finalRow.totalCapital}
                  />

                  <InfoRow
                    valueClass="text-red"
                    label="Dívida"
                    value={caseData.finalRow.outstandingBalance}
                  />

                  <InfoRow
                    valueClass="text-red"
                    label="Corretagem"
                    value={caseData.brokerageFee}
                  />

                  <InfoRow
                    valueClass="text-red"
                    label="Impostos"
                    value={caseData.capitalGainsTax}
                  />

                  <InfoRow
                    label="Saldo Final"
                    value={
                      caseData.finalRow.propertyValue -
                      caseData.finalRow.outstandingBalance -
                      caseData.brokerageFee -
                      caseData.capitalGainsTax
                    }
                    isTitle
                  />

                  <InfoRow
                    valueClass="font-bold !text-green"
                    label="Lucro Líquido"
                    value={caseData.totalProfit}
                    isTitle={true}
                  />

                  <div className="h-[2px] bg-primary my-2" />

                  <InfoRow
                    valueClass="text-red"
                    label="Valor Investido"
                    value={
                      propertyData.financingFees +
                      propertyData.downPayment +
                      caseData.totalRentalShortfall
                    }
                    isTitle={true}
                  />

                  <InfoRow
                    valueClass="text-red"
                    label="Entrada"
                    value={propertyData.downPayment}
                  />

                  <InfoRow
                    valueClass="text-red"
                    label="Documentação"
                    value={propertyData.financingFees}
                  />

                  <InfoRow
                    valueClass="text-red"
                    label="Parcelas"
                    value={caseData.totalRentalShortfall}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-[297mm]">
            <div className="w-full px-12 mt-10">
              <h1 className="text-2xl font-bold mb-4 mt-4 underline">
                Entenda o Cálculo
              </h1>
              <CalculationTable
                propertyData={propertyData}
                caseData={caseData}
              />
            </div>
            <div className="w-full px-12 mt-5 grid grid-cols-2 gap-10 ">
              <div>
                <h6 className="font-bold text-2xl ">Cenário de Compra</h6>
                <div className="h-[0.5px] bg-primary mt-2" />
                <div className="flex  text-primary">
                  <span>Valor do Imóvel</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span>{toBRL(propertyData.propertyValue)}</span>
                </div>
                <div className="flex  text-primary">
                  <span>Entrada</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span>{toBRL(propertyData.downPayment)}</span>
                </div>

                <div className="flex  text-primary">
                  <span>Documentação</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span>{toBRL(propertyData.financingFees)}</span>
                </div>
                <div className="flex  text-primary">
                  <span>Parcela (finan.)</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span>{toBRL(propertyData.installmentValue)}</span>
                </div>

                <div className="h-[1px] bg-primary mt-2" />
                <div className="flex  text-primary">
                  <span className="font-bold text-xl">Total</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span className="font-bold text-xl">
                    {toBRL(
                      propertyData.financingFees + propertyData.downPayment
                    )}
                  </span>
                </div>
              </div>
              <div>
                <h6 className="text-2xl text-primary">
                  <strong>Cenário de Venda</strong>{" "}
                  <span className="text-xl">
                    em {propertyData.finalYear} anos{" "}
                  </span>
                </h6>
                <div className="h-[0.5px] bg-primary mt-2" />
                <div className="flex text-primary">
                  <span>Valor do Imóvel </span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span>{toBRL(caseData.finalRow.propertyValue)}</span>
                </div>

                <div className="flex text-primary">
                  <span>Saldo Devedor</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span>- {toBRL(caseData.finalRow.outstandingBalance)}</span>
                </div>
                <div className="flex text-primary">
                  <span>Corretagem</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span> - {toBRL(caseData.brokerageFee)}</span>
                </div>
                <div className="flex  text-primary">
                  <span>Exc. (aluguel - parcela)</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span>- {toBRL(caseData.totalRentalShortfall)}</span>
                </div>
                <div className="flex text-primary">
                  <span>Imposto Ganho de Capital</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span>- {toBRL(caseData.capitalGainsTax)}</span>
                </div>
                <div className="h-[1px] bg-primary mt-2" />
                <div className="flex text-primary">
                  <span className="font-bold text-xl">Lucro ($)</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span className="font-bold text-xl">
                    {toBRL(caseData.totalProfit)}
                  </span>
                </div>
                <div className="flex text-primary">
                  <span className="font-bold text-xl">Lucro (%)</span>
                  <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                  <span className="font-bold text-xl">
                    {caseData.totalProfitPercent.toFixed(2) + "%"} |
                    {" " +
                      Number(
                        caseData.totalProfitPercent / propertyData.finalYear
                      ).toFixed(2) +
                      "% (ano)"}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full px-12 mt-10 mb-10">
              <div className=" w-full mt-5 relative">
                <div className="text-primary absolute top-[4.8rem] left-[1rem] flex flex-col items-center gap-1">
                  <span className="text-xl font-bold">
                    {toBRL(propertyData.propertyValue)}
                  </span>
                  <span className="mt-[-10px]">valor do imóvel</span>
                </div>
                <div className="text-primary absolute top-[4.8rem] left-[11.5rem] flex flex-col items-center gap-1">
                  <span className="text-xl font-bold">
                    {toBRL(
                      propertyData.propertyValue - propertyData.downPayment
                    )}
                  </span>
                  <span className="mt-[-10px]">valor financiado</span>
                </div>
                <div className="text-primary absolute top-[4.8rem] left-[23.7rem] flex flex-col items-center gap-1">
                  <span className="text-xl font-bold">
                    {propertyData.financingYears + " anos"}
                  </span>
                  <span className="mt-[-10px]">financiamento</span>
                </div>
                <div className="text-primary absolute top-[4.5rem] left-[35.5rem] flex flex-col items-center gap-1">
                  <span>parcelas de </span>
                  <span className="text-xl font-bold mt-[-5px]">
                    {toBRL(propertyData.installmentValue)}
                  </span>
                </div>
                <div className="text-primary absolute top-[15.8rem] left-[1rem] flex flex-col items-center gap-1">
                  <span className="text-xl font-bold">
                    {toBRL(propertyData.downPayment)}
                  </span>
                  <span className="mt-[-10px]">entrada</span>
                </div>
                <p className="absolute text-primary w-[500px] right-0 bottom-[-30px]">
                  O valor da parcela é estipulado pela{" "}
                  <strong> tabela PRICE </strong>. Como as primeiras parcelas da
                  tabela SAC são mais altas, optar pela tabela PRICE acaba sendo
                  mais vantajoso, pois a diferença entre os valores pode ser
                  usada para quitar o saldo devedor ou ser investida no mercado
                  financeiro. Esse método permite que o cliente liquide a dívida
                  antes do prazo previsto
                </p>
                <img src={entendaOFinancimento} className="mx-auto" />
              </div>
            </div>
          </div>

          <div className="h-[297mm]">
            <div className="w-full mt-10 px-12">
              <h5 className="underline text-primary text-xl mt-5">
                <strong>Análise Detalhada </strong> Financiamento imobiliário
              </h5>
              <p className="text-primary mt-5 text-lg">
                A análise demonstra que, ao focar no lucro final,
                <strong>
                  {" "}
                  o financiamento imobiliário apresenta-se como uma opção
                  vantajosa.
                </strong>
                Observa-se um retorno significativo, tornando-se uma alternativa
                eficaz para maximizar os ganhos financeiros em investimentos no
                setor imobiliário.
              </p>
            </div>
            <div className="flex flex-col items-center mt-5 relative w-full">
              <div className="bg-primary p-2 px-10 text-whitefull text-center">
                <strong> DIVISÃO INICIAL DO CAPITAL </strong>
              </div>
              <div className="bg-primary w-[2px] h-[360px]"></div>
              <div className="bg-primary p-2 px-10 text-whitefull text-center">
                <strong> DIVISÃO FINAL DO CAPITAL </strong>
              </div>
              <div className="bg-primary w-[2px]  h-[360px]"></div>
              <div className="absolute left-[50%] translate-x-[-50%] top-[4rem] w-[260px]">
                <InitialEquityDivisionChart
                  labels={["Entrada", "Taxas"]}
                  values={[
                    propertyData.downPayment,
                    propertyData.financingFees,
                  ]}
                />
              </div>

              <div className="absolute left-[50%] translate-x-[-50%] bottom-[0.6rem] w-[260px]">
                <InitialEquityDivisionChart
                  labels={["Valor Imóvel", "Saldo Devedor", "Valor Aplicado"]}
                  values={[
                    caseData.finalRow.propertyValue,
                    caseData.finalRow.outstandingBalance,
                    caseData.finalRow.totalCapital,
                  ]}
                />
              </div>
            </div>
          </div>

          {caseData.detailedTable[0].rentalAmount < 0 && (
            <div className="w-full px-12 h-[297mm]">
              <h5 className="underline text-primary text-xl mt-10">
                <strong>Análise Detalhada </strong> Financiamento imobiliário
              </h5>

              <p className="text-primary mt-2 mb-5">
                Conversão do investimento excedente para valor presente
              </p>

              <div className="text-primary col-span-2 mb-10">
                <p>
                  O valor presente (VP) de um pagamento mensal mostra quanto um
                  pagamento futuro vale hoje. Isso acontece porque o dinheiro
                  perde valor com o tempo. Em outras palavras, o valor presente
                  representa quanto seria necessário investir hoje para alcançar
                  um valor que será pago no futuro. Embora o pagamento ou
                  investimento mensal possa permanecer o mesmo, o valor presente
                  desse pagamento diminui quanto mais distante ele estiver no
                  tempo. Isso ajuda a entender o impacto financeiro de
                  compromissos ou investimentos futuros no momento atual.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="min-h-[170px]">
                  <table className="min-w-full">
                    <thead className="text-primary">
                      <tr>
                        <th className="px-4 py-2 border-r border-b border-primary text-left"></th>
                        <th className="px-4 py-2 border-r border-b border-primary text-left">
                          <div className="flex flex-col">
                            <strong>
                              Investimento excedente em valor real
                            </strong>
                          </div>
                        </th>
                        <th className="px-4 py-2 border-r border-b border-primary text-left">
                          <div className="flex flex-col">
                            <strong>
                              Investimento excedente convertido em valor
                              presente
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
                          <tr className="text-primary">
                            <td className="px-4 py-2 border-r border-b border-primary w-[100px]">
                              Mês 1
                            </td>
                            <td className="px-4 py-2 border-r border-b border-primary">
                              {toBRL(
                                caseData.detailedTable[0].rentalAmount * -1
                              )}
                            </td>
                            <td className="px-4 py-2 border-r border-b border-primary">
                              {toBRL(
                                caseData.detailedTable[0]
                                  .investmentExcessPresentValue
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
                          <tr className="text-primary">
                            <td className="px-4 py-2 border-r border-b border-primary w-[100px]">
                              Mês{" "}
                              {Math.floor(caseData.detailedTable.length / 2)}
                            </td>
                            <td className="px-4 py-2 border-r border-b border-primary">
                              {toBRL(
                                caseData.detailedTable[
                                  Math.floor(caseData.detailedTable.length / 2)
                                ].rentalAmount * -1
                              )}
                            </td>
                            <td className="px-4 py-2 border-r border-b border-primary">
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
                        <tr className="text-primary">
                          <td className="px-4 py-2 border-r border-b border-primary w-[100px]">
                            Mês{" "}
                            {caseData.detailedTable.findIndex(
                              (item) => item.investmentExcessPresentValue === 0
                            )}
                          </td>
                          <td className="px-4 py-2 border-r border-b border-primary">
                            {toBRL(
                              (caseData.detailedTable
                                .slice()
                                .reverse()
                                .find(
                                  (item) =>
                                    item.investmentExcessPresentValue !== 0
                                )!.rentValue -
                                propertyData.installmentValue) *
                                -1
                            )}
                          </td>
                          <td className="px-4 py-2 border-r border-b border-primary">
                            {toBRL(
                              caseData.detailedTable
                                .slice()
                                .reverse()
                                .find(
                                  (item) =>
                                    item.investmentExcessPresentValue !== 0
                                )!.investmentExcessPresentValue
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 text-primary mb-10">
                  <InfoItemReais
                    text="Total Investido em valor:"
                    value={caseData.finalRow.rentalShortfall}
                  />
                  <InfoItemReais
                    text="Total Investido em VP:"
                    value={caseData.detailedTable.reduce(
                      (acc, val) => acc + val.investmentExcessPresentValue,
                      0
                    )}
                  />
                  <InfoItemPercent
                    text="Lucro Percentual em valor:"
                    value={
                      (caseData.totalProfit /
                        (propertyData.financingFees +
                          propertyData.downPayment +
                          caseData.totalRentalShortfall)) *
                      100
                    }
                  />

                  <InfoItemPercent
                    text="Lucro Percentual em VP:"
                    value={caseData.totalProfitPercent}
                  />
                </div>

                <MonthlyInvestmentGrowthChart
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
          )}
          {caseData.finalRow.totalCapital > 0 && (
            <div className="w-full px-12 h-[297mm]">
              <h5 className="underline text-primary text-xl mt-5">
                <strong>Análise Detalhada </strong> Financiamento imobiliário
              </h5>
              <p className="text-primary mt-2 mb-5">
                Reinvestimento do Lucro Mensal: Aluguel - Parcela em Renda Fixa
              </p>
              <div className="text-primary col-span-2 mb-10">
                <p>
                  No cálculo mensal do investimento imobiliário, é comum que a
                  diferença entre o valor do aluguel recebido e a parcela do
                  financiamento resulte em um valor positivo. Essa diferença
                  representa o lucro mensal gerado pelo imóvel. Quando este
                  lucro é reinvestido em renda fixa, ele não apenas proporciona
                  uma rentabilidade adicional, mas também contribui para o
                  aumento do patrimônio ao longo do tempo. Esse estratégia de
                  reinvestimento potencializa o retorno total do investimento,
                  tornando-o mais sólido e sustentável
                </p>
              </div>

              <div className="min-h-[170px]">
                <table className="min-w-full">
                  <thead className="text-primary">
                    <tr>
                      <th className="px-4 py-2 border-r border-b border-primary text-left"></th>
                      <th className="px-4 py-2 border-r border-b border-primary text-left">
                        <div className="flex flex-col">
                          <strong>Valor do reinvestimento</strong>
                        </div>
                      </th>
                      <th className="px-4 py-2 border-r border-b border-primary text-left">
                        <div className="flex flex-col">
                          <strong>Total aplicado até o momento</strong>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseData.detailedTable.find(
                      (item) => item.rentalAmount > 0
                    ) && (
                      <>
                        {(() => {
                          const firstPositiveRentalIndex =
                            caseData.detailedTable.findIndex(
                              (item) => item.rentalAmount > 0
                            );

                          const twelveMonthsLaterIndex =
                            firstPositiveRentalIndex + 24;
                          const twentyFourMonthsLaterIndex =
                            firstPositiveRentalIndex + 48;

                          return (
                            <>
                              <tr className="text-primary">
                                <td className="px-4 py-2 border-r border-b border-primary w-[100px]">
                                  {dayjs(propertyData.initialDate, "MM/YYYY")
                                    .add(firstPositiveRentalIndex + 1, "month")
                                    .format("MM/YYYY")}
                                </td>
                                <td className="px-4 py-2 border-r border-b border-primary">
                                  {toBRL(
                                    caseData.detailedTable[
                                      firstPositiveRentalIndex
                                    ]?.rentalAmount
                                  )}
                                </td>
                                <td className="px-4 py-2 border-r border-b border-primary">
                                  {toBRL(
                                    caseData.detailedTable[
                                      firstPositiveRentalIndex
                                    ]?.totalCapital
                                  )}
                                </td>
                              </tr>

                              {caseData.detailedTable[twelveMonthsLaterIndex]
                                ?.rentalAmount && (
                                <tr className="text-primary">
                                  <td className="px-4 py-2 border-r border-b border-primary w-[100px]">
                                    {dayjs(propertyData.initialDate, "MM/YYYY")
                                      .add(twelveMonthsLaterIndex + 1, "month")
                                      .format("MM/YYYY")}
                                  </td>
                                  <td className="px-4 py-2 border-r border-b border-primary">
                                    {toBRL(
                                      caseData.detailedTable[
                                        twelveMonthsLaterIndex
                                      ]?.rentalAmount
                                    )}
                                  </td>
                                  <td className="px-4 py-2 border-r border-b border-primary">
                                    {toBRL(
                                      caseData.detailedTable[
                                        twelveMonthsLaterIndex
                                      ]?.totalCapital
                                    )}
                                  </td>
                                </tr>
                              )}

                              {caseData.detailedTable[
                                twentyFourMonthsLaterIndex
                              ]?.rentalAmount && (
                                <tr className="text-primary">
                                  <td className="px-4 py-2 border-r border-b border-primary w-[100px]">
                                    {dayjs(propertyData.initialDate, "MM/YYYY")
                                      .add(
                                        twentyFourMonthsLaterIndex + 1,
                                        "month"
                                      )
                                      .format("MM/YYYY")}
                                  </td>
                                  <td className="px-4 py-2 border-r border-b border-primary">
                                    {toBRL(
                                      caseData.detailedTable[
                                        twentyFourMonthsLaterIndex
                                      ]?.rentalAmount
                                    )}
                                  </td>
                                  <td className="px-4 py-2 border-r border-b border-primary">
                                    {toBRL(
                                      caseData.detailedTable[
                                        twentyFourMonthsLaterIndex
                                      ]?.totalCapital
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

              <div className="grid grid-cols-2 text-primary mb-20 mt-10">
                <InfoItemReais
                  text="Valor Total Aplicado:"
                  value={caseData.detailedTable.reduce(
                    (acc, val) =>
                      val.rentalAmount > 0 ? acc + val.rentalAmount : acc,
                    0
                  )}
                />
                <InfoItemReais
                  text="Total Acumulado:"
                  value={caseData.finalRow.totalCapital}
                />
                <InfoItemReais
                  text="Total de Ganho em Juros:"
                  value={
                    caseData.finalRow.totalCapital -
                    caseData.detailedTable.reduce(
                      (acc, val) =>
                        val.rentalAmount > 0 ? acc + val.rentalAmount : acc,
                      0
                    )
                  }
                />

                <p>
                  Juros Considerados:{" "}
                  <span className="font-bold">
                    {propertyData.monthlyYieldRate + "%/mês"}
                  </span>
                </p>
              </div>

              <InvestmentAccumulationChart
                accumulatedValues={caseData.detailedTable.map(
                  (i) => i.totalCapital
                )}
              />
            </div>
          )}
          {!!propertyData.cdi && propertyData.cdi !== 0 && (
            <div className="w-full px-12 h-[297mm]">
              <h5 className="underline text-primary text-xl mt-5">
                <strong>Análise Detalhada </strong> Financiamento imobiliário
              </h5>
              <p className="text-primary mt-2 mb-5">
                Comparativo com CDI e Reinvestimento do Lucro Mensal
              </p>
              <div className="text-primary col-span-2 mb-10">
                <p>
                  No cálculo mensal do investimento imobiliário, a diferença
                  entre o aluguel recebido e a parcela do financiamento pode
                  resultar em um lucro positivo, que, quando reinvestido em
                  renda fixa, gera rentabilidade e aumenta o patrimônio ao longo
                  do tempo. Ao comparar com a taxa do CDI, o retorno do
                  reinvestimento pode ser inferior ou superior ao que seria
                  obtido aplicando o capital na taxa do CDI. Isso ressalta a
                  importância de avaliar diferentes opções de investimento, já
                  que o CDI oferece uma taxa média, enquanto o investimento
                  imobiliário pode trazer ganhos adicionais por valorização e
                  renda passiva, tornando a estratégia de reinvestimento mais
                  sólida e sustentável.
                </p>
              </div>

              <CDIComparation
                monthlyContributions={caseData.detailedTable.map(
                  (i) => i.rentalAmount
                )}
                cdiRate={propertyData.cdi}
                initialCapital={
                  propertyData.downPayment + propertyData.financingFees
                }
                profitValues={caseData.detailedTable.map(
                  (i) => i.finalValue - caseData.capitalGainsTax
                )}
              />

              <div className="grid grid-cols-2 text-primary  mt-10">
                <InfoItemReais
                  text="Valor inicial:"
                  value={propertyData.downPayment + propertyData.financingFees}
                />

                <InfoItemReais
                  text="Aportes adicionais:"
                  value={caseData.finalRow.rentalShortfall}
                />

                <InfoItemReais
                  text="Patrimônio final (CDI):"
                  value={(() => {
                    const cdiRate = propertyData.cdi;
                    const initialCapital =
                      propertyData.downPayment + propertyData.financingFees;
                    const monthlyContributions = caseData.detailedTable.map(
                      (i) => i.rentalAmount
                    );

                    let accumulatedValue = initialCapital;

                    for (let i = 0; i < monthlyContributions.length - 1; i++) {
                      const monthlyCdiRate =
                        Math.pow(1 + cdiRate / 100, 1 / 12) - 1;
                      const interest = accumulatedValue * monthlyCdiRate;
                      const discharge =
                        monthlyContributions[i] < 0
                          ? monthlyContributions[i] * -1
                          : 0;
                      accumulatedValue += discharge + interest;
                    }

                    return accumulatedValue;
                  })()}
                />

                <p>
                  Juros considerados:{" "}
                  <span className="font-bold">
                    {propertyData.cdi + "%/ano"}
                  </span>
                </p>
              </div>

              <div className="text-primary mt-10">
                <p className="font-bold text-center mb-2">Lucro Percentual</p>

                <div className="flex justify-between px-10">
                  <p className="text-center">
                    investindo em CDI:{" "}
                    <span className="font-bold">
                      {(() => {
                        const initialCapital =
                          propertyData.downPayment + propertyData.financingFees;
                        const patrimonioFinal = (() => {
                          let accumulatedValue = initialCapital;
                          const monthlyContributions =
                            caseData.detailedTable.map((i) => i.rentalAmount);
                          for (
                            let i = 0;
                            i < monthlyContributions.length - 1;
                            i++
                          ) {
                            const monthlyCdiRate =
                              Math.pow(1 + propertyData.cdi / 100, 1 / 12) - 1;
                            const interest = accumulatedValue * monthlyCdiRate;
                            const discharge =
                              monthlyContributions[i] < 0
                                ? monthlyContributions[i] * -1
                                : 0;
                            accumulatedValue += discharge + interest;
                          }
                          return accumulatedValue;
                        })();

                        const totalAdditional = caseData.detailedTable.reduce(
                          (acc, val) => val.investmentExcessPresentValue + acc,
                          0
                        );

                        const lucroCdiPercent =
                          (((patrimonioFinal -
                            (initialCapital + totalAdditional)) /
                            initialCapital) *
                            100) /
                          propertyData.finalYear;

                        return (
                          lucroCdiPercent.toFixed(2) +
                          "%/ano" +
                          ` (${(
                            (lucroCdiPercent / propertyData.cdi) *
                            100
                          ).toFixed(2)}%CDI)`
                        );
                      })()}
                    </span>
                  </p>

                  <p className="text-center">
                    investindo no imóvel:{" "}
                    <span className="font-bold">
                      {(
                        caseData.totalProfitPercent / propertyData.finalYear
                      ).toFixed(2) +
                        "%/ano" +
                        ` (${(
                          (caseData.totalProfitPercent /
                            propertyData.finalYear /
                            propertyData.cdi) *
                          100
                        ).toFixed(2)}%CDI)`}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="w-full  h-[297mm]">
            <div className="px-12">
              <h5 className="underline text-primary text-xl mb-10 mt-10">
                <strong>Análise Detalhada </strong> Financiamento imobiliário
              </h5>
              <div className="flex flex-col gap-5">
                <CompleteAnalysisChart
                  investedEquityValues={caseData.detailedTable.map(
                    (i) => i.totalCapital
                  )}
                  outstandingBalanceValues={caseData.detailedTable.map(
                    (i) => i.outstandingBalance
                  )}
                  propertyValues={caseData.detailedTable.map(
                    (i) => i.propertyValue
                  )}
                />
                <CompleteAnalysisChart
                  profitValues={caseData.detailedTable.map(
                    (i) => i.monthlyProfit
                  )}
                />
              </div>
              <div className="w-full mt-4">
                <h3 className="text-xl font-bold  leading-7 mb-2 mt-5 underline">
                  Dados considerados para a análise:
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div>
                  <InfoItemReais
                    text="Valor do imóvel:"
                    value={propertyData.propertyValue}
                  />
                  <InfoItemReais
                    text="Valor do Subsídio:"
                    value={propertyData.subsidy}
                  />
                  <InfoItemReais
                    text="Valor inicial do Aluguel:"
                    value={propertyData.initialRentValue}
                  />
                  <InfoItemPercent
                    text="Valorização anual do imóvel:"
                    value={propertyData.propertyAppreciationRate}
                  />
                  <InfoItemPercent
                    text="Valorização anual do aluguel:"
                    value={propertyData.rentAppreciationRate}
                  />
                  <InfoItemDate
                    text="Início do estudo:"
                    value={propertyData.initialDate}
                  />
                  <InfoItemDate
                    text="Aluguel começa a contar em:"
                    value={propertyData.initialRentMonth}
                  />
                  <InfoItemPercent
                    text="Taxa de desconto (VP):"
                    value={propertyData.PVDiscountRate}
                  />
                </div>

                <div>
                  <InfoItemReais
                    text="Valor da entrada:"
                    value={propertyData.downPayment}
                  />
                  <InfoItemReais
                    text="Taxas do financiamento:"
                    value={propertyData.financingFees}
                  />
                  <InfoItemPercent
                    text="Juros do financiamento:"
                    value={propertyData.interestRate}
                  />
                  <InfoItemYears
                    text="Tempo do financiamento:"
                    value={propertyData.financingYears}
                  />
                  <InfoItemReais
                    text="Valor da Parcela:"
                    value={propertyData.installmentValue}
                  />
                  <InfoItemReais
                    text={`Saldo devedor em ${propertyData.finalYear} anos:`}
                    value={propertyData.outstandingBalance}
                  />
                  <InfoItemDate
                    text="Início das parcelas:"
                    value={propertyData.initialFinancingMonth}
                  />

                  <InfoItemPercent
                    text="Taxa de corretagem:"
                    value={propertyData.brokerageFee}
                  />

                  <InfoItemYears
                    text="Cálculo feito em:"
                    value={propertyData.finalYear}
                  />
                  {caseData.finalRow.totalCapital > 0 && (
                    <InfoItemPercent
                      text="Rendimento médio mensal:"
                      value={propertyData.monthlyYieldRate}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {(configData.additionalPhotos.length > 0 ||
            configData.features.length > 0) && (
            <div className="w-full mt-10 px-12">
              <h3 className="text-xl font-bold  leading-7 mb-2 mt-12 underline">
                Características do imóvel:
              </h3>
              {configData.features.map((f) => (
                <span className="mx-2 text-primary">• {f}</span>
              ))}
              <div className="columns-2 mt-5">
                {configData.additionalPhotos.map((p) => (
                  <div className="relative overflow-hidden rounded-lg border border-4 border-primary my-2">
                    <img src={p} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default FinancingPlanningReportPreview;
