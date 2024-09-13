import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@mui/joy";
import { FaPrint } from "react-icons/fa";
import FinancingPlanningReportConfig, {
  FinancingPlanningReportData,
} from "./FinancingPlanningReportConfig";
import FinancingPlanningReportPreview from "./FinancingPlanningReportPreview";

export default function FinancingPlanningReport() {
  const componentRef = useRef<HTMLDivElement>(null);

  const [configData, setConfigData] = useState<FinancingPlanningReportData>({
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
        <FinancingPlanningReportConfig
          data={configData}
          setData={(d) => setConfigData(d)}
        />
        <div className="w-full text-center mt-5">
          <div className="fixed bottom-4 right-4 z-10">
            <Button
              onClick={handlePrint}
              className="!rounded-full w-[50px] h-[50px] flex"
            >
              <FaPrint className="!text-4xl" />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <FinancingPlanningReportPreview
          configData={configData}
          ref={componentRef}
        />
      </div>
    </div>
  );
}
