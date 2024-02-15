import PictureReportInput from "@/components/report/PictureReportInput";
import { useContext } from "react";
import { FinanceOrCashReportContext } from "../Context";
import TextReportInput from "@/components/report/TextReportInput";
import { Card } from "@/components/ui/card";

export default function ConfigIntro() {
  const { financeOrCashReportState, setFinanceOrCashReportState } = useContext(
    FinanceOrCashReportContext
  );

  return (
    <div>
      <Card className="grid grid-rows gap-5 p-5">
        {/* <div className="grid grid-cols-2 gap-2">
          <RadioGroup
            onValueChange={(e) =>
              setFinanceOrCashReportState("coverType", Number(e))
            }
            className="col-span-2 flex justify-evenly my-2"
            defaultValue={financeOrCashReportState.coverType.toString()}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r1" />
              <Label htmlFor="r1">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2" />
              <Label htmlFor="r2">Sobreposto</Label>
            </div>
          </RadioGroup>
          <PictureReportInput
            label="Logo da Empresa 1"
            value={financeOrCashReportState.companyLogo1}
            onChange={(v) => setFinanceOrCashReportState("companyLogo1", v)}
          />
          <PictureReportInput
            label="Logo da Empresa 2"
            value={financeOrCashReportState.companyLogo2}
            onChange={(v) => setFinanceOrCashReportState("companyLogo2", v)}
          />
        </div> */}
        <PictureReportInput
          label="Foto do Imóvel"
          value={financeOrCashReportState.propertyPicture}
          onChange={(v) => setFinanceOrCashReportState("propertyPicture", v)}
        />
        <div className="grid grid-cols-3 gap-x-2">
          <div className="col-span-2">
            <TextReportInput
              label="Nome do Imóvel"
              value={financeOrCashReportState.propertyName}
              onChange={(v) => setFinanceOrCashReportState("propertyName", v)}
            />
          </div>

          <TextReportInput
            checkbox={false}
            label="Cor do texto"
            value={financeOrCashReportState.propertyName}
            onChange={(v) => setFinanceOrCashReportState("propertyName", v)}
            type="color"
            keyName="color"
          />
        </div>
        <TextReportInput
          label="Título"
          value={financeOrCashReportState.title}
          onChange={(v) => setFinanceOrCashReportState("title", v)}
        />
        <TextReportInput
          label="Subtitulo"
          value={financeOrCashReportState.subtitle}
          onChange={(v) => setFinanceOrCashReportState("subtitle", v)}
        />
        <TextReportInput
          label="Apresentação"
          value={financeOrCashReportState.presentation}
          onChange={(v) => setFinanceOrCashReportState("presentation", v)}
          type="textarea"
        />

        <div className="grid grid-cols-2">
          <TextReportInput
            label="Nome do Corretor"
            value={financeOrCashReportState.agentName}
            onChange={(v) => {
              setFinanceOrCashReportState("agentName", v);
            }}
          />
          <TextReportInput
            label="CRECI"
            value={financeOrCashReportState.agentCRECI}
            onChange={(v) => setFinanceOrCashReportState("agentCRECI", v)}
          />
        </div>
        <TextReportInput
          label="Data da elaboração"
          value={financeOrCashReportState.createdAt}
          onChange={(v) => setFinanceOrCashReportState("createdAt", v)}
          type="date"
        />
      </Card>
    </div>
  );
}
