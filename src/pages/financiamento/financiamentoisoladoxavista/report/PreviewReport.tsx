import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import Cover from "./preview/Cover";
import PropertyDetails from "./preview/PropertyDetails";
import FinancingAnalysis from "./preview/FinancingAnalysis";
import InCashAnalysis from "./preview/InCashAnalysis";
import Comparative from "./preview/Comparative";
import Conclusion from "./preview/Conclusion";

interface PreviewReportProps {
  viewMap: {
    cover: boolean;
    propertyDetails: boolean;
    finance: boolean;
    inCash: boolean;
    comparative: boolean;
    conclusion: boolean;
  };
}

const PreviewReport = forwardRef<HTMLDivElement, PreviewReportProps>(
  ({ viewMap }, ref) => {
    return (
      <Card className="lg:col-span-7 uw:col-span-6 border border-border !w-[210mm] !pageBreakAfter w-full shadow p-5 light relative justify-content-start !bg-whitefull">
        <div className="!bg-whitefull grid grid-rows gap-y-2" ref={ref}>
          {viewMap.cover && <Cover />}
          {viewMap.propertyDetails && <PropertyDetails />}
          {viewMap.finance && <FinancingAnalysis />}
          {viewMap.inCash && <InCashAnalysis />}
          {viewMap.comparative && <Comparative />}
          {viewMap.conclusion && <Conclusion />}
        </div>
      </Card>
    );
  }
);

export default PreviewReport;
