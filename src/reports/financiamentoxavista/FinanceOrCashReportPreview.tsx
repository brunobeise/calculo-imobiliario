import { forwardRef } from "react";
import UserSignature2 from "@/components/user/UserSignature2";
import { FinaceOrCashReportData } from "./FinaceOrCashReportConfig";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { FinanceOrCashData } from "@/pages/financiamento/financiamentoxavista/Context";
import lucroAnualFinal from "./assets/lucro-anual-total.svg";
import entendaOFinancimento from "./assets/entenda-o-financimento.svg";
import { numeroParaReal } from "@/lib/formatter";
import InitialEquityDivisionChart from "@/components/charts/InitialEquityDivisionChart";
import { MonthlyInvestmentGrowthChart } from "@/components/charts/MonthlyInvestmentGrowthChart";
import CompleteAnalysisChart from "@/components/charts/CompleteAnalysisChart";
import { ComparativeMonthlyInvestmentGrowthChart } from "@/components/charts/ComparativeMontlyInvestmentGrowthChart";
import ComparativeTotalEquityGrowth from "@/components/charts/ComparativeTotalEquityGrowth";

interface FinanceOrCashReportPreviewProps {
  configData: FinaceOrCashReportData;
}

const FinanceOrCashReportPreview = forwardRef<
  HTMLDivElement,
  FinanceOrCashReportPreviewProps
>(({ configData }: FinanceOrCashReportPreviewProps, ref) => {
  const propertyData: PropertyData = JSON.parse(
    localStorage.getItem("financeOrCashPropertyData") || ""
  );

  const caseData: FinanceOrCashData = JSON.parse(
    localStorage.getItem("financeOrCashCaseData") || ""
  );

  const InfoItemReais = ({ text, value }: { text: string; value: number }) => (
    <p>
      {text}
      {"  "}
      <span className="font-bold">{numeroParaReal(value)}</span>
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
        <div className="bg-primary w-full flex items-center ps-10">
          <UserSignature2 desc={configData.title} />
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
              {caseData.financing.totalProfitPercent.toFixed(2) + "%"}
            </span>
            <span className="absolute font-bold text-3xl top-[4.4rem] left-[-1.5rem]">
              {(
                caseData.financing.totalProfitPercent / propertyData.finalYear
              ).toFixed(2) + "%"}
            </span>
            <img className="w-[250px] absolute" src={lucroAnualFinal} />
          </div>
          <div className="text-xl col-span-4">
            <div className="flex justify-between items-center">
              <span>- Valor do imóvel</span>
              <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
              <span className="text-green">
                {numeroParaReal(
                  caseData.financing.detailedTable[
                    caseData.financing.detailedTable.length - 1
                  ].propertyValue
                )}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>- Aplicado</span>
              <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
              <span className="text-green">
                {numeroParaReal(caseData.financing.finalRow.totalCapital)}
              </span>
            </div>

            <div className="flex justify-between items-center items-center">
              <span>- Dívida</span>
              <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
              <span className="text-red">
                {numeroParaReal(
                  caseData.financing.detailedTable[
                    caseData.financing.detailedTable.length - 1
                  ].outstandingBalance
                )}
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
                {numeroParaReal(
                  caseData.financing.detailedTable[
                    caseData.financing.detailedTable.length - 1
                  ].propertyValue * 0.06
                )}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span> - Imposto Ganho de Capital</span>
              <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
              <span className="text-red">
                {numeroParaReal(caseData.financing.capitalGainsTax)}
              </span>
            </div>

            <div className="flex justify-between items-center font-bold">
              <span>Lucro Líquido</span>
              <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
              <span className="text-green">
                {numeroParaReal(caseData.financing.totalProfit)}
              </span>
            </div>

            <div className="h-[2px] bg-primary my-2" />

            <div className="flex justify-between items-center font-bold text-blue-800 mt-2">
              <span>Investimento</span>
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

            <div className="flex justify-between items-center ml-4">
              <span>- Aplicação</span>
              <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
              <span className="text-red">
                {numeroParaReal(
                  propertyData.personalBalance -
                    (propertyData.financingFees + propertyData.downPayment)
                )}
              </span>
            </div>

            <div className="flex justify-between items-center ml-4">
              <span>- Entrada</span>
              <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
              <span className="text-red">
                {numeroParaReal(propertyData.downPayment)}
              </span>
            </div>

            <div className="flex justify-between items-center ml-4">
              <span>- Documentação</span>
              <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
              <span className="text-red">
                {numeroParaReal(propertyData.financingFees)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full px-12 mt-16">
          <h1 className="text-2xl font-bold mb-4 mt-4 underline">
            Entenda o Cálculo
          </h1>
          <table className="min-w-full">
            <thead className="text-primary">
              <tr>
                <th className="px-4 py-2 border-r border-b border-r border-primary text-left"></th>
                <th className="px-4 py-2 border-r border-b border-primary text-left">
                  <div className="flex flex-col">
                    <strong>Valorização Imóvel</strong>
                    <span className="text-sm font-normal">
                      conservador {propertyData.propertyAppreciationRate}%
                    </span>
                  </div>
                </th>
                <th className="px-4 py-2 border-r border-b border-primary text-left">
                  <div className="flex flex-col">
                    <strong>Projeção Aluguel</strong>
                    <span className="text-sm font-normal">
                      regular {propertyData.rentMonthlyYieldRate}%
                    </span>
                  </div>
                </th>
                <th className="px-4 py-2 border-b border-primary text-left">
                  <div className="flex flex-col">
                    <strong>Diferença</strong>
                    <span className="text-sm font-normal">
                      aluguel - parcela
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {caseData.financing.detailedTable.map((item, i) => {
                if ((i - 1) % 12 === 0)
                  return (
                    <tr className="text-primary">
                      <td className="px-4 py-2 border-r border-primary">
                        Ano {(i - 1) / 12}
                      </td>
                      <td className="px-4 py-2 border-r border-primary">
                        {numeroParaReal(item.propertyValue)}
                      </td>
                      <td className="px-4 py-2 border-r border-primary">
                        {numeroParaReal(item.rentValue)}
                      </td>
                      <td className="px-4 py-2 border-primary">
                        {numeroParaReal(item.rentalAmount)}
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>

        <div className="w-full px-12 mt-5 grid grid-cols-2 gap-10 ">
          <div>
            <h6 className="font-bold text-2xl ">Cenário de Compra</h6>
            <div className="h-[0.5px] bg-primary mt-2" />
            <div className="flex  text-primary">
              <span>Valor do Imóvel</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span>{numeroParaReal(propertyData.propertyValue)}</span>
            </div>
            <div className="flex  text-primary">
              <span>Entrada</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span>{numeroParaReal(propertyData.downPayment)}</span>
            </div>
            <div className="flex  text-primary">
              <span>Aplicação</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span>
                {numeroParaReal(
                  propertyData.personalBalance -
                    (propertyData.downPayment + propertyData.financingFees)
                )}
              </span>
            </div>
            <div className="flex  text-primary">
              <span>Documentação</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span>{numeroParaReal(propertyData.financingFees)}</span>
            </div>
            <div className="flex  text-primary">
              <span>Parcela (finan.)</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span>{numeroParaReal(propertyData.installmentValue)}</span>
            </div>
            <div className="h-[1px] bg-primary mt-2" />
            <div className="flex  text-primary">
              <span className="font-bold text-xl">Total</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span className="font-bold text-xl">
                {numeroParaReal(propertyData.personalBalance)}
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
              <span>
                {numeroParaReal(
                  caseData.financing.detailedTable[
                    caseData.financing.detailedTable.length - 1
                  ].propertyValue
                )}
              </span>
            </div>

            <div className="flex text-primary">
              <span>Valor Aplicado</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span>
                {numeroParaReal(
                  caseData.financing.detailedTable[
                    caseData.financing.detailedTable.length - 1
                  ].initialCapital
                )}
              </span>
            </div>
            <div className="flex text-primary">
              <span>Capital do Aluguel </span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span>
                {numeroParaReal(
                  caseData.financing.detailedTable[
                    caseData.financing.detailedTable.length - 1
                  ].rentalIncomeCapital
                )}
              </span>
            </div>
            <div className="flex text-primary">
              <span>Saldo Devedor</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span>
                -{" "}
                {numeroParaReal(
                  caseData.financing.detailedTable[
                    caseData.financing.detailedTable.length - 1
                  ].outstandingBalance
                )}
              </span>
            </div>
            <div className="flex text-primary">
              <span>Corretagem</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span> - {numeroParaReal(caseData.financing.brokerageFee)}</span>
            </div>
            <div className="flex text-primary">
              <span>Imposto Ganho de Capital</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span>
                - {numeroParaReal(caseData.financing.capitalGainsTax)}
              </span>
            </div>
            <div className="h-[1px] bg-primary mt-2" />
            <div className="flex text-primary">
              <span className="font-bold text-xl">Lucro ($)</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span className="font-bold text-xl">
                {numeroParaReal(caseData.financing.totalProfit)}
              </span>
            </div>
            <div className="flex text-primary">
              <span className="font-bold text-xl">Lucro (%)</span>
              <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
              <span className="font-bold text-xl">
                {caseData.financing.totalProfitPercent.toFixed(2) + "%"} |
                {" " +
                  Number(caseData.financing.totalProfitPercent / 12).toFixed(
                    2
                  ) +
                  "% (ano)"}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full px-12 mt-2">
          <div className=" w-full mt-5 relative">
            <div className="text-primary absolute top-[4.8rem] left-[1rem] flex flex-col items-center gap-1">
              <span className="text-xl font-bold">
                {numeroParaReal(propertyData.propertyValue)}
              </span>
              <span className="mt-[-10px]">valor do imóvel</span>
            </div>
            <div className="text-primary absolute top-[4.8rem] left-[11.5rem] flex flex-col items-center gap-1">
              <span className="text-xl font-bold">
                {numeroParaReal(
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
                {numeroParaReal(propertyData.installmentValue)}
              </span>
            </div>
            <div className="text-primary absolute top-[15.8rem] left-[1rem] flex flex-col items-center gap-1">
              <span className="text-xl font-bold">
                {numeroParaReal(propertyData.downPayment)}
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
          <h5 className="underline text-primary text-xl">
            <strong>Análise Comparativa </strong> Financiamento x Compra à vista
          </h5>
          <p className="text-primary mt-5 text-lg">
            A análise revela que, com foco no lucro final,
            <strong>
              o financiamento do imóvel se mostra a opção mais vantajosa
            </strong>
            em comparação com a compra à vista. Observa-se um retorno
            siginificativamente maior como uma alternativa eficaz para maximizar
            os retornos financeiros em investimentos imobiliários
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
          <div className="absolute left-[5rem] top-[0.6rem] w-[260px]">
            <p className="italic text-xl text-primary mb-5 italic">
              Financiamento
            </p>
            <InitialEquityDivisionChart
              labels={["Renda Fixa", "Entrada", "Taxas"]}
              values={[
                propertyData.personalBalance -
                  propertyData.financingFees -
                  propertyData.downPayment,
                propertyData.downPayment,
                propertyData.financingFees,
              ]}
            />
          </div>
          <div className="absolute right-[5rem] top-[0.6rem] w-[260px]">
            <p className="italic text-xl text-primary mb-5 text-right">
              Compra à vista
            </p>
            <InitialEquityDivisionChart
              labels={["Compra do Imóvel"]}
              values={[propertyData.propertyValue]}
            />
          </div>
          <div className="absolute right-[5rem] bottom-[0.6rem] w-[260px]">
            <InitialEquityDivisionChart
              labels={["Valor Imóvel", "Renda Fixa"]}
              values={[
                caseData.inCash.detailedTable[
                  caseData.inCash.detailedTable.length - 1
                ].propertyValue,
                caseData.inCash.detailedTable[
                  caseData.inCash.detailedTable.length - 1
                ].totalCapital,
              ]}
            />
          </div>
          <div className="absolute left-[5rem] bottom-[0.6rem] w-[260px]">
            <InitialEquityDivisionChart
              labels={["Valor Imóvel", "Renda Fixa", "Saldo Devedor"]}
              values={[
                caseData.financing.detailedTable[
                  caseData.financing.detailedTable.length - 1
                ].propertyValue,
                caseData.financing.detailedTable[
                  caseData.financing.detailedTable.length - 1
                ].totalCapital,
                caseData.financing.detailedTable[
                  caseData.financing.detailedTable.length - 1
                ].outstandingBalance,
              ]}
            />
          </div>
        </div>

        <div className="w-full mt-32 px-12">
          <h5 className="underline text-primary text-xl">
            <strong>Análise Comparativa </strong> Financiamento x Compra à vista
          </h5>
          <div className="grid grid-cols-7 gap-5">
            <div className="col-span-5">
              <p className="italic my-2 text-primary">Financiamento</p>
              <CompleteAnalysisChart
                investedEquityValues={caseData.financing.detailedTable.map(
                  (i) => i.totalCapital
                )}
                outstandingBalanceValues={caseData.financing.detailedTable.map(
                  (i) => i.outstandingBalance
                )}
                propertyValues={caseData.financing.detailedTable.map(
                  (i) => i.propertyValue
                )}
              />
              <MonthlyInvestmentGrowthChart
                data={caseData.financing.detailedTable.map(
                  (i) =>
                    i.rentValue +
                    i.initialCapitalYield -
                    propertyData.installmentValue
                )}
              />
            </div>
            <div className="text-primary col-span-2 mt-10">
              <p>
                Todo mês, somamos o aluguel e os rendimentos da renda fixa para
                pagar as parcelas. O que sobra é reinvestido.
              </p>
              <p className="mt-32">
                Com o aumento periódico do aluguel e parcelas fixas, o montante
                na renda fixa tende a crescer ao longo do tempo
              </p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-5">
            <div className="col-span-5">
              <p className="italic text-primary">Compra à vista</p>
              <CompleteAnalysisChart
                investedEquityValues={caseData.inCash.detailedTable.map(
                  (i) => i.totalCapital
                )}
                outstandingBalanceValues={caseData.inCash.detailedTable.map(
                  () => 0
                )}
                propertyValues={caseData.inCash.detailedTable.map(
                  (i) => i.propertyValue
                )}
              />
              <MonthlyInvestmentGrowthChart
                data={caseData.inCash.detailedTable.map(
                  (i) => i.rentValue + i.rentalIncomeYield
                )}
              />
            </div>
            <div className="text-primary col-span-2 mt-10">
              <p>
                Todo mês, somamos o aluguel e os rendimentos da renda fixa, o
                que sobra é reinvestido.
              </p>
              <p className="mt-24">
                O capital começa zerado, mas não tem desconto de parcelas. Com o
                aumento periódico do aluguel e parcelas fixas, o montante na
                renda fixa tende a crescer ao longo do tempo.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full mt-16 px-12">
          <h5 className="underline text-primary text-xl">
            <strong>Análise Comparativa </strong> Financiamento x Compra à vista
          </h5>
          <p className="mt-5 text-primary mb-5">
            No cenário de financiamento, o montante inicial disponível para
            investimento em renda fixa é substancialmente maior, o que resulta
            em rendimentos mais significativos desde o início. Esta vantagem
            inicial impulsiona um crescimento mais acelerado e exponencial ao
            longo do tempo, amplificando o feito dos início. Esta vantagem
            inicial impulsiona um crescimento mais acelerado e exponencial ao
            longo do tempo, amplificando o efeito dos juros compostos sobre o
            capital investido.
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
          <p className="mt-5 text-primary mb-5">
            Neste cenário, o gráfico ilustra a evolução do patrimônio nos dois
            contextos - financiamento e pagamento à vista - destacando o
            crescimento progressivo do valor líquido do investimento imobiliário
            ao longo do tempo
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

        <div className="w-full mt-20 px-12">
          <h3 className="text-xl font-bold  leading-7 mb-2 mt-5 underline">
            Dados considerados para a análise:
          </h3>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <InfoItemReais
                text="Saldo inicial:"
                value={propertyData.personalBalance}
              />

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

              <InfoItemPercent
                text="Rendimento médio mensal:"
                value={propertyData.monthlyYieldRate}
              />

              <InfoItemYears
                text="Cálculo feito em:"
                value={propertyData.finalYear}
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
                text={`Saldo devedor em ${propertyData.finalYear} Anos:`}
                value={propertyData.outstandingBalance}
              />
            </div>
          </div>

          <h3 className="text-xl font-bold  leading-7 mb-2 mt-5 underline">
            Precondições para comparação dos cenários:
          </h3>

          <p className="text-primary">
            <strong>
              Reinvestimento Integral dos Rendimentos e Dedicação Exclusiva do
              Saldo para Investimento:
            </strong>
            Todos os rendimentos do aluguel e os retornos gerados
            serãocompletamente reinvestidos em produtos de renda fi xa, sem
            exceções para despesas ounovos investimentos. Adicionalmente,
            qualquer saldo remanescente seráexclusivamente dedicado ao
            investimento em renda fixa, mantendo os valorescomparáveis e focados
            na análise
          </p>

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

export default FinanceOrCashReportPreview;
