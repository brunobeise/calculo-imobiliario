import ItemListInput from "@/components/inputs/ItemListInput";
import PictureInput from "@/components/inputs/PictureInput";
import TextFieldReportInput from "@/components/inputs/TextFieldReportInput";
import { Sheet } from "@mui/joy";

export interface FinancingPlanningReportData {
  principalPhoto: string;
  description: string;
  title: string;
  additionalPhotos: string[];
  features: string[];
}

interface FinancingPlanningReportConfigProps {
  data: FinancingPlanningReportData;
  setData: (data: FinancingPlanningReportData) => void;
}

export default function FinancingPlanningReportConfig(
  props: FinancingPlanningReportConfigProps
) {
  return (
    <Sheet className="grid grid-rows shadow">
      <PictureInput
        label="Foto Principal do imóvel"
        onChange={(v) => props.setData({ ...props.data, principalPhoto: v })}
      />
      <TextFieldReportInput
        label="Nome do imóvel"
        onChange={(v) => props.setData({ ...props.data, title: v })}
      />
      <TextFieldReportInput
        isTextarea
        label="Descrição do imóvel"
        onChange={(v) => props.setData({ ...props.data, description: v })}
      />
      <PictureInput
        label="Fotos Adicionais do imóvel"
        multiple
        onChange={(v) =>
          props.setData({
            ...props.data,
            additionalPhotos: v.split(","),
          })
        }
      />
      <ItemListInput
        label="Características do imóvel"
        items={props.data.features}
        onChange={(items) => props.setData({ ...props.data, features: items })}
      />
    </Sheet>
  );
}
