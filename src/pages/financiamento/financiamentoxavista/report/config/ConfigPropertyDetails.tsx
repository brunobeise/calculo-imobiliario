import TextReportInput from "@/components/report/TextReportInput";
import { FinanceOrCashReportContext } from "../Context";
import { useContext } from "react";
import { Sheet } from "@mui/joy";

export default function ConfigPropertyDetails() {
  const { financeOrCashReportState, setFinanceOrCashReportState } = useContext(
    FinanceOrCashReportContext
  );

  return (
    <Sheet variant="outlined" className="grid grid-rows gap-5 p-5">
      <TextReportInput
        showInput={false}
        label="Detalhes do imóvel e financiamento"
        value={financeOrCashReportState.propertyDetails}
        onChange={(v) => setFinanceOrCashReportState("propertyDetails", v)}
      />
      <TextReportInput
        label="Precondições:"
        value={financeOrCashReportState.preconditionsScenarios}
        onChange={(v) =>
          setFinanceOrCashReportState("preconditionsScenarios", v)
        }
        type="textarea"
      />
      <TextReportInput
        label="Valorização do aluguel e do imóvel:"
        value={financeOrCashReportState.appreciationOfRent}
        onChange={(v) => setFinanceOrCashReportState("appreciationOfRent", v)}
        type="textarea"
      />
      <TextReportInput
        showInput={false}
        label="Tabelas de valorização"
        value={financeOrCashReportState.appreciationOfRent}
        onChange={(v) => setFinanceOrCashReportState("appreciationOfRent", v)}
        activeSecondary
      />
    </Sheet>
  );
}
