import { numeroParaReal } from "@/lib/formatter";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import { useContext } from "react";
import { FinanceOrCashReportContext } from "../Context";
import TablePropertyAppreciation from "@/components/tables/TablePropertyAppreciation";
import TableRentAppreciation from "@/components/tables/TableRentAppreciation";
import { FinanceOrCashData } from "../../Context";

export default function PropertyDetails() {
  const { propertyData } = useContext(propertyDataContext);
  const { financeOrCashReportState } = useContext(FinanceOrCashReportContext);

   const caseData: FinanceOrCashData = JSON.parse(
     localStorage.getItem("financingOrInCashCaseData") || ""
   );

  const {
    finalYear,
    monthlyYieldRate,
    outstandingBalance,
    personalBalance,
    interestRate,
    financingFees,
    downPayment,
    propertyValue,
    initialRentValue,
    installmentValue,
    propertyAppreciationRate,
    financingYears,
  } = propertyData;

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

  const preconditionsItems =
    financeOrCashReportState.preconditionsScenarios.content
      .split("\n")
      .filter((item) => item);

  return (
    <div className="px-12 pageBreakAfter">
      {financeOrCashReportState.propertyDetails.active && (
        <>
          <h3 className="text-xl font-bold text-center leading-7 mb-2 mt-5">
            Dados considerados para o comparativo:
          </h3>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <InfoItemReais text="Saldo inicial:" value={personalBalance} />
              <InfoItemReais text="Valor do imóvel:" value={propertyValue} />

              <InfoItemReais
                text="Valor inicial do Aluguel:"
                value={initialRentValue}
              />

              <InfoItemPercent
                text="Valorização anual do imóvel:"
                value={propertyAppreciationRate}
              />

              <InfoItemPercent
                text="Rendimento médio mensal:"
                value={monthlyYieldRate}
              />

              <InfoItemYears text="Cálculo feito em:" value={finalYear} />
            </div>
            <div>
              <InfoItemReais text="Valor da entrada:" value={downPayment} />
              <InfoItemReais
                text="Taxas do financiamento:"
                value={financingFees}
              />
              <InfoItemPercent
                text="CET do financiamento:"
                value={interestRate}
              />
              <InfoItemYears
                text="Tempo do financiamento:"
                value={financingYears}
              />

              <InfoItemReais
                text="Valor da Parcela:"
                value={installmentValue}
              />

              <InfoItemReais
                text={`Saldo devedor em ${finalYear} Anos:`}
                value={outstandingBalance}
              />
            </div>
          </div>
        </>
      )}

      {financeOrCashReportState.preconditionsScenarios.active && (
        <>
          <h3 className="text-xl font-bold text-center leading-7 mt-5 mb-2">
            Precondições para comparação dos cenários:
          </h3>

          <ul className="list-decimal text-justify">
            {preconditionsItems.map((item, index) => {
              const splitIndex = item.indexOf(":");
              const title = item.substring(0, splitIndex);
              const content = item.substring(splitIndex + 1);

              return (
                <li key={index}>
                  <strong>{title}:</strong>
                  {content}
                </li>
              );
            })}
          </ul>
        </>
      )}
      {financeOrCashReportState.appreciationOfRent.active && (
        <>
          <h3 className="text-xl font-bold text-center leading-7 mt-5 mb-2">
            Valorização do aluguel e do imóvel:
          </h3>
          <p className="text-justify">
            À medida que o tempo passa, o valor do aluguel aumenta devido às
            tendências econômicas, e o valor de mercado do imóvel também
            valoriza no mesmo percentual do aluguel. Essa evolução é crucial
            para os cálculos em tabelas futuras, permitindo uma avaliação
            precisa do impacto financeiro ao longo do tempo.
          </p>
          {financeOrCashReportState.appreciationOfRent.activeSecondary && (
            <div className="grid grid-cols-2 gap-2 mt-5 ">
              <TablePropertyAppreciation
                data={caseData["financing"].detailedTable.map(
                  (i) => i.propertyValue
                )}
                text="left"
              />
              <TableRentAppreciation
                text="left"
                data={caseData["financing"].detailedTable.map(
                  (i) => i.rentValue
                )}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
