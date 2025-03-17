import { toBRL } from "@/lib/formatter";
import { DirectFinancingData } from "@/pages/parcelamentodireto/@id/CaseData";
import { FinancingPlanningData } from "@/pages/planejamentofinanciamento/@id/CaseData";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import dayjs from "dayjs";

interface ConsideredDataProps {
  color: string;
  secondary: string;
  propertyData: PropertyData;
  caseData: FinancingPlanningData | DirectFinancingData;
}

export default function ConsideredData(props: ConsideredDataProps) {
  const { color, propertyData, caseData } = props;

  return (
    <>
      <div
        style={{ color }}
        className="grid grid-cols-2 gap-10 text-sm mb-4 px-12 mt-10"
      >
        <div className="flex flex-col gap-1">
          {propertyData.propertyValue > 0 && (
            <p>Valor do imóvel: {toBRL(propertyData.propertyValue)}</p>
          )}
          {propertyData.subsidy > 0 && (
            <p>Valor do Subsídio: {toBRL(propertyData.subsidy)}</p>
          )}
          {propertyData.initialRentValue > 0 && (
            <p>
              Valor inicial do Aluguel: {toBRL(propertyData.initialRentValue)}
            </p>
          )}
          {propertyData.propertyAppreciationRate > 0 && (
            <p>
              Valorização anual do imóvel:{" "}
              {propertyData.propertyAppreciationRate.toFixed(2)}%
            </p>
          )}
          {propertyData.rentAppreciationRate > 0 && (
            <p>
              Valorização anual do aluguel:{" "}
              {propertyData.rentAppreciationRate.toFixed(2)}%
            </p>
          )}
          {propertyData.initialDate && (
            <p>
              Início do estudo:{" "}
              {dayjs(propertyData.initialDate, "MM/YYYY").format("MMM/YYYY")}
            </p>
          )}
          {propertyData.initialRentMonth && (
            <p>
              Aluguel começa a contar em:{" "}
              {dayjs(propertyData.initialRentMonth, "MM/YYYY").format(
                "MMM/YYYY"
              )}
            </p>
          )}
        
        </div>

        <div className="flex flex-col gap-1">
          {propertyData.downPayment > 0 && (
            <p>Valor da entrada: {toBRL(propertyData.downPayment)}</p>
          )}
          {propertyData.financingFees > 0 && (
            <p>Taxas do financiamento: {toBRL(propertyData.financingFees)}</p>
          )}
          {propertyData.interestRate > 0 && (
            <p>
              Juros do financiamento: {propertyData.interestRate?.toFixed(2)}%
            </p>
          )}
          {propertyData.financingMonths > 0 && (
            <p>Tempo do financiamento: {propertyData.financingMonths} meses</p>
          )}
          {propertyData.installmentValue > 0 && (
            <p>Valor da Parcela: {toBRL(propertyData.installmentValue)}</p>
          )}
          {caseData.finalRow?.outstandingBalance > 0 && (
            <p>
              Saldo devedor em {propertyData.finalYear} anos:{" "}
              {toBRL(caseData.finalRow.outstandingBalance)}
            </p>
          )}
          {propertyData.initialFinancingMonth && (
            <p>
              Início das parcelas:{" "}
              {dayjs(propertyData.initialFinancingMonth, "MM/YYYY").format(
                "MMM/YYYY"
              )}
            </p>
          )}
          {propertyData.brokerageFee > 0 && (
            <p>Taxa de corretagem: {propertyData.brokerageFee.toFixed(2)}%</p>
          )}
          {propertyData.finalYear > 0 && (
            <p>Cálculo feito em: {propertyData.finalYear} anos</p>
          )}
          {caseData.finalRow?.totalCapital > 0 &&
            propertyData.annualYieldRate > 0 && (
              <p>
                Rendimento mercado financeiro:{" "}
                {propertyData.annualYieldRate.toFixed(2)}%
              </p>
            )}
        </div>
      </div>
    </>
  );
}
