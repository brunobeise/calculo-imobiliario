import { useRef, useState } from "react";
import { FinanceOrCashReportProvider } from "./Context";

import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";
import PreviewReport from "./PreviewReport";
import { FinanceOrInCashCaseDataProvider } from "@/pages/financiamento/financiamentoxavista/Context";
import ConfigReport from "./config/ConfigReport";

export default function RelatorioFinanciamentoXAvista() {
  const componentRef = useRef<HTMLDivElement>(null);
  const [viewMap, setViewMap] = useState({
    cover: true,
    propertyDetails: true,
    finance: true,
    inCash: true,
    comparative: true,
  });

  const changeViewMap = (key: keyof typeof viewMap) => {
    setViewMap({ ...viewMap, [key]: !viewMap[key] });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <FinanceOrCashReportProvider>
      <FinanceOrInCashCaseDataProvider>
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
          <div className="!w-[210mm]">
            <div>
              <div className="flex justify-evenly mb-2">
                <div>
                  <Checkbox
                    checked={viewMap.cover}
                    onCheckedChange={() => changeViewMap("cover")}
                  />
                  <Label className="ms-1">Capa</Label>
                </div>
                <div>
                  <Checkbox
                    checked={viewMap.propertyDetails}
                    onCheckedChange={() => changeViewMap("propertyDetails")}
                  />
                  <Label className="ms-1">
                    Dados do imóvel e financiamento
                  </Label>
                </div>
                <div>
                  <Checkbox
                    checked={viewMap.finance}
                    onCheckedChange={() => changeViewMap("finance")}
                  />
                  <Label className="ms-1">Financiamento</Label>
                </div>
                <div>
                  <Checkbox
                    checked={viewMap.inCash}
                    onCheckedChange={() => changeViewMap("inCash")}
                  />
                  <Label className="ms-1">À vista</Label>
                </div>
                <div>
                  <Checkbox
                    checked={viewMap.comparative}
                    onCheckedChange={() => changeViewMap("comparative")}
                  />
                  <Label className="ms-1">Comparativo</Label>
                </div>
              </div>
            </div>
            <PreviewReport viewMap={viewMap} ref={componentRef} />
          </div>
        </div>
      </FinanceOrInCashCaseDataProvider>
    </FinanceOrCashReportProvider>
  );
}
