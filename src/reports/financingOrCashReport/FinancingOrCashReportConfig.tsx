import ItemListInput from "@/components/inputs/ItemListInput";
import PictureInput from "@/components/inputs/PictureInput";
import TextInput from "@/components/inputs/TextInput";
import { Sheet } from "@mui/joy";

export interface FinaceOrCashReportData {
  principalPhoto: string;
  description: string;
  title: string;
  additionalPhotos: string[];
  features: string[];
}

interface FinaceOrCashReportConfigProps {
  data: FinaceOrCashReportData;
  setData: (data: FinaceOrCashReportData) => void;
}

export default function FinaceOrCashReportConfig(
  props: FinaceOrCashReportConfigProps
) {
  return (
    <Sheet className="grid grid-rows shadow">
      <PictureInput
        label="Foto Principal do imóvel"
        onChange={(v) => props.setData({ ...props.data, principalPhoto: v })}
      />
      <TextInput
        label="Nome do imóvel"
        onChange={(v) => props.setData({ ...props.data, title: v })}
      />
      <TextInput
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
