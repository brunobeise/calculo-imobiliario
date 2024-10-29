import { useRef, useState } from "react";
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

  return (
    <div>
      <FinaceOrCashReportConfig
        data={configData}
        setData={(d) => setConfigData(d)}
      />

      <FinancingOrCashReportPreview
        configData={configData}
        ref={componentRef}
      />
    </div>
  );
}
