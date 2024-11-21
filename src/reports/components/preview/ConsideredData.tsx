import { toBRL } from "@/lib/formatter";
import { FinancingPlanningData } from "@/pages/planejamentofinanciamento/@id/CaseData";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import dayjs from "dayjs";

interface ConsideredDataProps {
  color: string;
  secondary: string;
  propertyData: PropertyData;
  caseData: FinancingPlanningData;
}

export default function ConsideredData(props: ConsideredDataProps) {
  const { color, propertyData, caseData } = props;

  return (
    <>
      <div style={{ color }} className="grid grid-cols-2 gap-10 text-sm mb-4 px-12 mt-10">
        <div className="flex flex-col gap-1">
          <p>Valor do imóvel: {toBRL(propertyData.propertyValue)}</p>
          <p>Valor do Subsídio: {toBRL(propertyData.subsidy)}</p>
          <p>
            Valor inicial do Aluguel: {toBRL(propertyData.initialRentValue)}
          </p>
          <p>
            Valorização anual do imóvel:{" "}
            {propertyData.propertyAppreciationRate.toFixed(2)}%
          </p>
          <p>
            Valorização anual do aluguel:{" "}
            {propertyData.rentAppreciationRate.toFixed(2)}%
          </p>
          <p>
            Início do estudo:{" "}
            {dayjs(propertyData.initialDate, "MM/YYYY").format("MMM/YYYY")}
          </p>
          <p>
            Aluguel começa a contar em:{" "}
            {dayjs(propertyData.initialRentMonth, "MM/YYYY").format("MMM/YYYY")}
          </p>
          <p>
            Taxa de desconto (VP): {propertyData.PVDiscountRate.toFixed(2)}%
          </p>
        </div>

        {/* Segunda Coluna */}
        <div className="flex flex-col gap-1">
          <p>Valor da entrada: {toBRL(propertyData.downPayment)}</p>
          <p>Taxas do financiamento: {toBRL(propertyData.financingFees)}</p>
          <p>Juros do financiamento: {propertyData.interestRate.toFixed(2)}%</p>
          <p>Tempo do financiamento: {propertyData.financingYears} anos</p>
          <p>Valor da Parcela: {toBRL(propertyData.installmentValue)}</p>
          <p>
            Saldo devedor em {propertyData.finalYear} anos:{" "}
            {toBRL(caseData.finalRow.outstandingBalance)}
          </p>
          <p>
            Início das parcelas:{" "}
            {dayjs(propertyData.initialFinancingMonth, "MM/YYYY").format(
              "MMM/YYYY"
            )}
          </p>
          <p>Taxa de corretagem: {propertyData.brokerageFee.toFixed(2)}%</p>
          <p>Cálculo feito em: {propertyData.finalYear} anos</p>
          {caseData.finalRow.totalCapital > 0 && (
            <p>
              Rendimento mercado financeiro:{" "}
              {propertyData.monthlyYieldRate.toFixed(2)}%
            </p>
          )}
        </div>
      </div>
    </>
  );
}
