import ItemListInput from "@/reports/components/inputs/ItemListInput";
import PictureReportInput from "@/reports/components/inputs/PictureReportInput";
import TextFieldReportInput from "@/reports/components/inputs/TextFieldReportInput";
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
      <PictureReportInput
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
      <PictureReportInput
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
