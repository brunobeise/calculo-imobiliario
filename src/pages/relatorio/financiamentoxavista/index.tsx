import { useRef } from "react";
import ConfigReport from "./Config/ConfigReport";
import { FinanceOrCashReportProvider } from "./Context";
import PreviewRelatorio from "./PreviewReport";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RelatorioFinanciamentoXAvista() {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  console.log(componentRef.current);

  return (
    <FinanceOrCashReportProvider>
      <div className="grid grid-cols-12 mt-10 pt-10 px-10">
        <div className="col-span-12 lg:col-span-5">
          <ConfigReport />
          <div className="w-full text-center mt-5">
            <Button
              className=""
              onClick={handlePrint}
              Icon={Printer}
              text="Imprimir Relatório"
            />
          </div>
        </div>

        <PreviewRelatorio ref={componentRef} />
      </div>
    </FinanceOrCashReportProvider>
  );
}
