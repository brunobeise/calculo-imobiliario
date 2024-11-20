import { toBRL } from "@/lib/formatter";
import ScenarioCard from "./ScenarioCard";
import { FinancingPlanningData } from "@/pages/planejamentofinanciamento/@id/CaseData";
import { PropertyData } from "@/propertyData/PropertyDataContext";

interface ScenariosBuyAndSellProps {
  color: string;
  secondary: string;
  caseData: FinancingPlanningData;
  propertyData: PropertyData;
}

const ScenariosBuyAndSell: React.FC<ScenariosBuyAndSellProps> = ({
  color,
  secondary,
  propertyData,
  caseData,
}) => {
  const purchaseLines = [
    { label: "Entrada no ato", value: propertyData.downPayment },
    { label: "Documentação", value: propertyData.financingFees },
    { label: "Parcela (finan.)", value: propertyData.installmentValue },
  ];

  const saleLines = [
    { label: "Venda", value: caseData.finalRow.propertyValue, green: true },
    {
      label: "Retorno Aplic.",
      value: caseData.finalRow.totalCapital,
      green: true,
    },
    { label: "Saldo devedor", value: caseData.finalRow.outstandingBalance },
    { label: "Corretagem", value: caseData.brokerageFee },
    { label: "Impostos", value: caseData.capitalGainsTax },
    { label: "Inv. Excendente", value: caseData.totalRentalShortfall },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 gap-y-2 px-10">
      <ScenarioCard
        title="Cenário de Compra"
        subtitle="Valor do imóvel R$ 300.000"
        lines={purchaseLines}
        color={color}
        secondary={secondary}
      />
      <ScenarioCard
        title="Cenário de Venda"
        subtitle={`Após ${propertyData.finalYear} anos`}
        lines={saleLines}
        color={color}
        secondary={secondary}
      />

      <div style={{ color }} className="text-left">
        <div id="investiemnto-inicial" className="pe-2">
          <div className="flex text-md lg:text-lg">
            <span style={{ color: secondary }}>Investimento inicial</span>
            <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
            <strong className="text-red">
              {toBRL(propertyData.downPayment + propertyData.financingFees)}
            </strong>
          </div>
        </div>
        <div className="flex text-md lg:text-lg">
          <span style={{ color: secondary }}>Investimento Total</span>
          <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
          <strong className="text-red">
            {toBRL(caseData.totalInvestment)}
          </strong>
        </div>
        <div className="flex text-[0.9rem] text-nowrap lg:text-lg">
          <span style={{ color: secondary }}> Inv. total valor presente</span>
          <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
          <strong className="text-red">
            {toBRL(caseData.investedEquityPresentValue)}
          </strong>
        </div>
      </div>
      <div style={{ color }} className="text-right flex flex-col items-end">
        <p className=" text-md lg:text-xl">
          <strong>
            Lucro Bruto....{" "}
            <span className="text-green">
              {toBRL(
                caseData.totalProfit +
                  propertyData.downPayment +
                  propertyData.financingFees
              )}
              *
            </span>
          </strong>
        </p>
        <div id="investimento-inicial2" className="ps-2">
          <p className=" text-md lg:text-xl">
            <strong>
              <span className="text-red">
                {toBRL(propertyData.downPayment + propertyData.financingFees)}*
              </span>
            </strong>
            <div
              style={{ backgroundColor: secondary }}
              className="h-[2px] w-full my-2"
            />
          </p>
        </div>
        <p className=" text-md lg:text-xl">
          <strong>
            Lucro Líquido....{" "}
            <span className="text-green">{toBRL(caseData.totalProfit)}*</span>
          </strong>
        </p>
        <p className=" text-md lg:text-xl">
          <span>
            <strong> {caseData.totalProfitPercent.toFixed(2)}% </strong>{" "}
            <span style={{ color: secondary }}>(total)</span>,{" "}
            <strong>
              {" "}
              {(caseData.totalProfitPercent / propertyData.finalYear).toFixed(
                2
              )}
              %{" "}
            </strong>
            <span style={{ color: secondary }}>(ano) </span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default ScenariosBuyAndSell;
