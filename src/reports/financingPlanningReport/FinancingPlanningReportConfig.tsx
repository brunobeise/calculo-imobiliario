import BooleanInput from "@/components/inputs/BooleanInput";
import ItemListInput from "@/components/inputs/ItemListInput";
import PictureInput from "@/components/inputs/PictureInput";
import TextInput from "@/components/inputs/TextInput";
import {
  List,
  ListItem,
  ListItemDecorator,
  Radio,
  RadioGroup,
  Sheet,
} from "@mui/joy";
import { LuBox } from "react-icons/lu";
import { FaCalculator } from "react-icons/fa";
export interface FinancingPlanningReportData {
  mainPhoto: string;
  description: string;
  propertyName: string;
  additionalPhotos: string[];
  features: string[];
  pageViewMap: boolean[];
  suites?: string;
  bathrooms?: string;
  parkingSpaces?: string;
  builtArea?: string;
  landArea?: string;
  address?: string;
  cod?: string;
  subType: string;
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
    "Pagamento e retorno esperado",
    "Cálculo do investimento",
    "Divisão do capital",
    "Conversão para valor presente",
    "Reinvestimento em Renda Fixa",
    "Análise Gráfica Detalhada",
    "Descrição do imóvel",
  ];

  return (
    <Sheet className="grid grid-rows shadow w-[600px] py-5 max-h-screen overflow-y-auto">
      <RadioGroup
        aria-label="subType"
        name="subType"
        onChange={(e) =>
          props.setData({ ...props.data, subType: e.target.value })
        }
        value={props.data.subType}
      >
        <List
          orientation="horizontal"
          className="!grid !grid-cols-2 !mb-10 !px-4"
          sx={{
            "--List-gap": "0.5rem",
            "--ListItem-paddingY": "1rem",
            "--ListItem-radius": "8px",
            "--ListItemDecorator-size": "32px",
          }}
        >
          {["Simplificado", "Avançado"].map((item, index) => (
            <ListItem variant="outlined" key={item} sx={{ boxShadow: "sm" }}>
              <ListItemDecorator>
                {[<LuBox />, <FaCalculator />][index]}
              </ListItemDecorator>
              <Radio
                overlay
                value={item}
                label={item}
                sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                slotProps={{
                  action: ({ checked }) => ({
                    sx: (theme) => ({
                      ...(checked && {
                        inset: -1,
                        border: "2px solid",
                        borderColor: theme.vars.palette.primary[500],
                      }),
                    }),
                  }),
                }}
              />
            </ListItem>
          ))}
        </List>
      </RadioGroup>
      {props.data.subType !== "Simplificado" && (
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
      )}

      <PictureInput
        label="Foto Principal do imóvel"
        value={[props.data.mainPhoto]}
        onChange={(v) => props.setData({ ...props.data, mainPhoto: v })}
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

      <div className="grid grid-cols-2 gap-y-5">
        <div className="col-span-2">
          <TextInput
            value={props.data.address}
            label="Endereço do Imóvel"
            onChange={(v) => props.setData({ ...props.data, address: v })}
          />
        </div>
        <TextInput
          value={props.data.suites}
          label="Número de Suítes"
          onChange={(v) => props.setData({ ...props.data, suites: v })}
        />
        <TextInput
          value={props.data.bathrooms}
          label="Número de Banheiros"
          onChange={(v) => props.setData({ ...props.data, bathrooms: v })}
        />
        <TextInput
          value={props.data.parkingSpaces}
          label="Número de Vagas"
          onChange={(v) => props.setData({ ...props.data, parkingSpaces: v })}
        />
        <TextInput
          value={props.data.builtArea}
          label="Área Construída (m²)"
          onChange={(v) => props.setData({ ...props.data, builtArea: v })}
        />
        <TextInput
          value={props.data.landArea}
          label="Área do Terreno (m²)"
          onChange={(v) => props.setData({ ...props.data, landArea: v })}
        />

        <TextInput
          value={props.data.cod}
          label="Código do Imóvel"
          onChange={(v) => props.setData({ ...props.data, cod: v })}
        />
      </div>
      <ItemListInput
        label="Características do imóvel"
        items={props.data.features}
        onChange={(items) => props.setData({ ...props.data, features: items })}
      />
    </Sheet>
  );
}
