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

interface FinancingPlanningReportPreviewProps {
  configData: FinancingPlanningReportData;
}

const FinancingPlanningReportPreview = forwardRef<
  HTMLDivElement,
  FinancingPlanningReportPreviewProps
>(({ configData }: FinancingPlanningReportPreviewProps, ref) => {
  const propertyData: PropertyData = JSON.parse(
    localStorage.getItem("financingPlanningPropertyData") || ""
  );

  const caseData: FinancingPlanningData = JSON.parse(
    localStorage.getItem("financingPlanningCaseData") || ""
  );

  const InfoItemReais = ({ text, value }: { text: string; value: number }) => (
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
      <span className="font-bold">{value + "%"}</span>
    </p>
  );

  const InfoItemYears = ({ text, value }: { text: string; value: number }) => (
    <p>
      {text}
      {"  "}
      <span className="font-bold">{value + " Anos"}</span>
    </p>
  );

  return (
    <div
      ref={ref}
      className="lg:col-span-7 uw:col-span-6 !w-[210mm] shadow light !bg-whitefull mb-[1000px]"
    >
      <div className="!bg-whitefull flex flex-col items-center w-full overflow-hidden !m-0">
        <div className="bg-primary w-full flex items-center">
          <UserSignature2 getUser desc={configData.title} />
        </div>

        <div className="h-[460px] overflow-hidden flex justify-center items-center relative w-full">
          <img className="w-full" src={configData.principalPhoto} />
          <div className="absolute bottom-0 h-[150px] w-full bg-gradient-to-t from-[#000000de] to-transparent flex items-center px-10 text-lg font-light">
            <p className="whitespace-pre text-whitefull text-xl">
              {configData.description}{" "}
            </p>
          </div>
        </div>

        <div className="bg-primary mt-10 text-white flex justify-center p-1 px-4 text-[1.4rem]">
          <strong>
            Melhor Cenário de Compra / Projeção em {propertyData.finalYear} anos{" "}
          </strong>
        </div>

        <div className="grid grid-cols-7 mt-10 w-full px-14 text-primary">
          <div className="col-span-3 relative mt-20 ms-5">
            <span className="absolute font-bold text-3xl top-[4.4rem] left-[6rem]">
              {caseData.totalProfitPercent.toFixed(2) + "%"}
            </span>
            <span className="absolute font-bold text-3xl top-[4.4rem] left-[-1.5rem]">
              {(caseData.totalProfitPercent / propertyData.finalYear).toFixed(
                2
              ) + "%"}
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

        <div className="w-full px-12 mt-16">
          <h1 className="text-2xl font-bold mb-4 mt-4 underline">
            Entenda o Cálculo
          </h1>
          <CalculationTable propertyData={propertyData} caseData={caseData} />
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
                {toBRL(propertyData.financingFees + propertyData.downPayment)}
              </span>
            </div>
          </div>
          <div>
            <h6 className="text-2xl text-primary">
              <strong>Cenário de Venda</strong>{" "}
              <span className="text-xl">em {propertyData.finalYear} anos </span>
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

        <div className="w-full px-12 mt-10">
          <div className=" w-full mt-5 relative">
            <div className="text-primary absolute top-[4.8rem] left-[1rem] flex flex-col items-center gap-1">
              <span className="text-xl font-bold">
                {toBRL(propertyData.propertyValue)}
              </span>
              <span className="mt-[-10px]">valor do imóvel</span>
            </div>
            <div className="text-primary absolute top-[4.8rem] left-[11.5rem] flex flex-col items-center gap-1">
              <span className="text-xl font-bold">
                {toBRL(propertyData.propertyValue - propertyData.downPayment)}
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
              mais vantajoso, pois a diferença entre os valores pode ser usada
              para quitar o saldo devedor ou ser investida no mercado
              financeiro. Esse método permite que o cliente liquide a dívida
              antes do prazo previsto
            </p>
            <img src={entendaOFinancimento} className="mx-auto" />
          </div>
        </div>

        <div className="w-full mt-32 px-12">
          <h5 className="underline text-primary text-xl mt-5">
            <strong>Análise Detalhada </strong> Financiamento imobiliário
          </h5>
          <p className="text-primary mt-5 text-lg">
            A análise demonstra que, ao focar no lucro final,
            <strong>
              {" "}
              o financiamento imobiliário apresenta-se como uma opção vantajosa.
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
              values={[propertyData.downPayment, propertyData.financingFees]}
            />
          </div>

          <div className="absolute left-[50%] translate-x-[-50%] bottom-[0.6rem] w-[260px]">
            <InitialEquityDivisionChart
              labels={["Valor Imóvel", "Saldo Devedor"]}
              values={[
                caseData.finalRow.propertyValue,
                caseData.finalRow.outstandingBalance,
              ]}
            />
          </div>
        </div>

        <div className="w-full mt-32 px-12">
          <h5 className="underline text-primary text-xl mb-5 mt-5">
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
          </div>
        </div>

        <div className="w-full mt-20 px-12">
          <h3 className="text-xl font-bold  leading-7 mb-2 mt-5 underline">
            Dados considerados para a análise:
          </h3>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <InfoItemReais
                text="Valor do imóvel:"
                value={propertyData.propertyValue}
              />

              <InfoItemReais
                text="Valor inicial do Aluguel:"
                value={propertyData.initialRentValue}
              />

              <InfoItemPercent
                text="Valorização anual do imóvel:"
                value={propertyData.propertyAppreciationRate}
              />

              {caseData.finalRow.totalCapital > 0 && (
                <InfoItemPercent
                  text="Rendimento médio mensal:"
                  value={propertyData.monthlyYieldRate}
                />
              )}

              <InfoItemYears
                text="Cálculo feito em:"
                value={propertyData.finalYear}
              />

              <InfoItemPercent
                text="Valorização do aluguel anual:"
                value={propertyData.rentAppreciationRate}
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
                text="CET do financiamento:"
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

              <InfoItemPercent
                text="Taxa de corretagem:"
                value={propertyData.brokerageFee}
              />
            </div>
          </div>

          {(configData.additionalPhotos.length > 0 ||
            configData.features.length > 0) && (
            <>
              <h3 className="text-xl font-bold  leading-7 mb-2 mt-5 underline">
                Características do imóvel:
              </h3>
              {configData.features.map((f) => (
                <span className="mx-2 text-primary">• {f}</span>
              ))}
              <div className="grid grid-cols-2 gap-5 mt-3">
                {configData.additionalPhotos.map((p) => (
                  <img src={p} className="w-full" />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default FinancingPlanningReportPreview;
