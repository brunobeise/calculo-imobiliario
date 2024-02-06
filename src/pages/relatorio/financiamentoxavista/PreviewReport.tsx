import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import Cover from "./Report/Cover";
import "./Report/index.css";

const PreviewRelatorio = forwardRef<HTMLDivElement>((_props, ref) => {
  return (
    <Card className="lg:col-span-7 uw:col-span-6 border border-border !w-[210mm] !h-[297mm] w-full shadow p-5 light relative justify-content-start !bg-whitefull">
      <div className="!bg-whitefull" ref={ref}>
        <Cover />
      </div>
    </Card>
  );
});

export default PreviewRelatorio;
