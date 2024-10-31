import BooleanInput from "@/components/inputs/BooleanInput";
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
  pageViewMap: boolean[];
}

interface FinancingPlanningReportConfigProps {
  data: FinancingPlanningReportData;
  setData: (data: FinancingPlanningReportData) => void;
}

export default function FinancingPlanningReportConfig(
  props: FinancingPlanningReportConfigProps
) {
  const labels = [
    "Introdução",
    "Entenda o cálculo",
    "Divisão do capital",
    "Explicação valor presente",
    "Reinvestimento do Lucro Mensal",
    "Comparação com CDI",
    "Análise Gráfica Detalhada",
    "Dados do imóvel",
  ];

  return (
    <Sheet className="grid grid-rows shadow w-[600px] py-5 max-h-screen overflow-y-auto">
      <div className="grid grid-cols-2 gap-y-5 mb-5 ms-5">
        {labels.map((label, index) => (
          <BooleanInput
            key={index}
            label={label}
            onChange={(v) =>
              props.setData({
                ...props.data,
                pageViewMap: [
                  ...props.data.pageViewMap.slice(0, index),
                  v.target.checked,
                  ...props.data.pageViewMap.slice(index + 1),
                ],
              })
            }
            checked={
              index >= props.data.pageViewMap.length ||
              props.data.pageViewMap[index] === true
            }
          />
        ))}
      </div>
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
        value={props.data.additionalPhotos}
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
