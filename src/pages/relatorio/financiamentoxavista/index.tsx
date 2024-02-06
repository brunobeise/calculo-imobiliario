import ConfigReport from "./Config/ConfigReport";
import { FinanceOrCashReportProvider } from "./Context";
import PreviewRelatorio from "./PreviewReport";

export default function RelatorioFinanciamentoXAvista() {
  return (
    <FinanceOrCashReportProvider>
      <div className="grid grid-cols-12 mt-10 pt-10 px-10">
        <ConfigReport />
        <PreviewRelatorio />
      </div>
    </FinanceOrCashReportProvider>
  );
}
