import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@mui/joy";
import { FaPrint } from "react-icons/fa";
import FinaceOrCashReportConfig, {
  FinaceOrCashReportData,
} from "./FinancingOrCashReportConfig";
import FinancingOrCashReportPreview from "./FinancingOrCashReportPreview";

export default function FinancingOrCashReport() {
  const componentRef = useRef<HTMLDivElement>(null);

  const [configData, setConfigData] = useState<FinaceOrCashReportData>({
    title: "",
    principalPhoto: "",
    description: "",
    additionalPhotos: [],
    features: [],
  });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="grid grid-cols-12 mt-10 pt-10 px-10 gap-5">
      <div className="col-span-12 lg:col-span-5">
        <FinaceOrCashReportConfig
          data={configData}
          setData={(d) => setConfigData(d)}
        />
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
        <FinancingOrCashReportPreview
          configData={configData}
          ref={componentRef}
        />
      </div>
    </div>
  );
}
