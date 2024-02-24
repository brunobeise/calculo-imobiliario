import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import Cover from "./Report/Cover";
import PropertyDetails from "./Report/PropertyDetails";
import FinancingAnalysis from "./Report/FinancingAnalysis";
import InCashAnalysis from "./Report/InCashAnalysis";
import Comparative from "./Report/Comparative";

interface PreviewReportProps {
  viewMap: {
    cover: boolean;
    propertyDetails: boolean;
    finance: boolean;
    inCash: boolean;
    comparative: boolean;
  };
}

const PreviewReport = forwardRef<HTMLDivElement, PreviewReportProps>(
  ({ viewMap }, ref) => {
    return (
      <Card className="lg:col-span-7 uw:col-span-6 border border-border !w-[210mm] !min-h-[297mm] w-full shadow p-5 light relative justify-content-start !bg-whitefull">
        <div className="!bg-whitefull" ref={ref}>
          {viewMap.cover && <Cover />}
          {viewMap.propertyDetails && <PropertyDetails />}
          {viewMap.finance && <FinancingAnalysis />}
          {viewMap.inCash && <InCashAnalysis />}
          {viewMap.comparative && <Comparative />}
        </div>
      </Card>
    );
  }
);

export default PreviewReport;
