import { Sheet } from "@mui/joy";
import { FinanceOrCashReportContext } from "../Context";
import { useContext } from "react";
import TextReportInput from "@/components/report/TextReportInput";

export default function InCashAnalysis() {
  const { financeOrCashReportState, setFinanceOrCashReportState } = useContext(
    FinanceOrCashReportContext
  );

  return (
    <Sheet variant="outlined" className="grid grid-rows gap-5 p-5">
      <TextReportInput
        label="Título"
        value={financeOrCashReportState.inCashTitle}
        onChange={(v) => setFinanceOrCashReportState("inCashTitle", v)}
      />
      <TextReportInput
        label="Gráfico de divião inicial e final"
        value={financeOrCashReportState.inCashDivisionCharts}
        onChange={(v) => setFinanceOrCashReportState("inCashDivisionCharts", v)}
        showInput={false}
      />
      <TextReportInput
        label="Gráfico de rendimento + aluguel + parcela"
        value={financeOrCashReportState.inCashMonthlyInvestmentGrowthChart}
        onChange={(v) =>
          setFinanceOrCashReportState("inCashMonthlyInvestmentGrowthChart", v)
        }
        type="textarea"
      />
      <TextReportInput
        label="Gráfico análise completa"
        value={financeOrCashReportState.inCashCompleteAnalysis}
        onChange={(v) =>
          setFinanceOrCashReportState("inCashCompleteAnalysis", v)
        }
        showInput={false}
      />
    </Sheet>
  );
}
