import { Card } from "@/components/ui/card";
// import { FinanceOrCashReportContext } from "./Context";
// import { useContext } from "react";
import Cover from "./Report/Cover";
import "./Report/index.css";

export default function PreviewRelatorio() {
  // const { financeOrCashReportState } = useContext(FinanceOrCashReportContext);

  return (
    <Card className="lg:col-span-7 uw:col-span-6 border border-border !w-[210mm] !h-[297mm] w-full shadow p-5 light relative justify-content-start">
      <Cover />
    </Card>
  );
}
