import PictureReportInput from "@/components/report/PictureReportInput";
import { useContext } from "react";
import { FinanceOrCashReportContext } from "../Context";
import TextReportInput from "@/components/report/TextReportInput";
import { Sheet } from "@mui/joy";

export default function ConfigIntro() {
  const { financeOrCashReportState, setFinanceOrCashReportState } = useContext(
    FinanceOrCashReportContext
  );

  return (
    <div>
      <Sheet variant="outlined" className="grid grid-rows gap-5 p-5">
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
          label="Apresentação"
          value={financeOrCashReportState.presentation}
          onChange={(v) => setFinanceOrCashReportState("presentation", v)}
          type="textarea"
        />

        <TextReportInput
          label="Cálculo"
          value={financeOrCashReportState.calculation}
          onChange={(v) => setFinanceOrCashReportState("calculation", v)}
          showInput={false}
        />

        <TextReportInput
          label="Detalhes do Corretor"
          value={financeOrCashReportState.agentDetails}
          onChange={(v) => setFinanceOrCashReportState("agentDetails", v)}
          showInput={false}
        />

        <TextReportInput
          label="Data da elaboração"
          value={financeOrCashReportState.createdAt}
          onChange={(v) => setFinanceOrCashReportState("createdAt", v)}
          type="date"
        />
      </Sheet>
    </div>
  );
}
