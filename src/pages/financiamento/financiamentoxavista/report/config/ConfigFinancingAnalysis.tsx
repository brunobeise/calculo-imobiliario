import { Sheet } from "@mui/joy";
import { FinanceOrCashReportContext } from "../Context";
import { useContext } from "react";
import TextReportInput from "@/components/report/TextReportInput";

export default function ConfigFinancingAnalysis(){

    const { financeOrCashReportState, setFinanceOrCashReportState } =
      useContext(FinanceOrCashReportContext);


    return (
      <Sheet variant="outlined" className="grid grid-rows gap-5 p-5">
        <TextReportInput
          label="Título"
          value={financeOrCashReportState.financingTitle}
          onChange={(v) => setFinanceOrCashReportState("financingTitle", v)}
        />
        <TextReportInput
          label="Gráfico de divião inicial e final"
          value={financeOrCashReportState.financingDivisionCharts}
          onChange={(v) =>
            setFinanceOrCashReportState("financingDivisionCharts", v)
          }
          showInput={false}
        />
        <TextReportInput
          label="Gráfico de rendimento + aluguel + parcela"
          value={financeOrCashReportState.financingMonthlyInvestmentGrowthChart}
          onChange={(v) =>
            setFinanceOrCashReportState(
              "financingMonthlyInvestmentGrowthChart",
              v
            )
          }
          type="textarea"
        />
        <TextReportInput
          label="Gráfico análise completa"
          value={financeOrCashReportState.financingCompleteAnalysis}
          onChange={(v) =>
            setFinanceOrCashReportState("financingCompleteAnalysis", v)
          }
          showInput={false}
        />
      </Sheet>
    );
}