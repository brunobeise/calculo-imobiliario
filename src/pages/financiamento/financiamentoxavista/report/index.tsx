import { useRef, useState } from "react";
import { FinanceOrCashReportProvider } from "./Context";
import { useReactToPrint } from "react-to-print";
import PreviewReport from "./PreviewReport";
import ConfigReport from "./config/ConfigReport";
import { Button } from "@mui/joy";
import { FaPrint } from "react-icons/fa";

export default function RelatorioFinanciamentoXAvista() {
  const componentRef = useRef<HTMLDivElement>(null);
  const [viewMap, setViewMap] = useState({
    cover: true,
    propertyDetails: true,
    finance: true,
    inCash: true,
    comparative: true,
    conclusion: true,
  });

  const changeViewMap = (key: keyof typeof viewMap) => {
    setViewMap({ ...viewMap, [key]: !viewMap[key] });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <FinanceOrCashReportProvider>
      <div className="grid grid-cols-12 mt-10 pt-10 px-10">
        <div className="col-span-12 lg:col-span-5">
          <ConfigReport viewMap={viewMap} changeViewMap={changeViewMap} />
          <div className="w-full text-center mt-5">
            <Button
              startDecorator={<FaPrint />}
              className=""
              onClick={handlePrint}
            >
              Imprimir Relatório
            </Button>
          </div>
        </div>
        <div>
          <PreviewReport viewMap={viewMap} ref={componentRef} />
        </div>
      </div>
    </FinanceOrCashReportProvider>
  );
}
