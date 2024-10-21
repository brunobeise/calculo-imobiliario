import ItemListInput from "@/components/inputs/ItemListInput";
import PictureInput from "@/components/inputs/PictureInput";
import TextInput from "@/components/inputs/TextInput";
import { Sheet } from "@mui/joy";

export interface FinancingPlanningReportData {
  mainPhoto: string;
  description: string;
  propertyName: string;
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
        value={[props.data.mainPhoto]}
        onChange={(v) => props.setData({ ...props.data, mainPhoto: v })}
      />
      <TextInput
        value={props.data.propertyName}
        label="Nome do imóvel"
        onChange={(v) => props.setData({ ...props.data, propertyName: v })}
      />
      <TextInput
        isTextarea
        value={props.data.description}
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
