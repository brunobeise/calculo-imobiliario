import { FormControl, FormLabel, Input, Textarea } from "@mui/joy";
import LinkBuildingButton from "@/components/shared/VinculateBuildingButton";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import ItemListInput from "@/components/inputs/ItemListInput";
import { ReportData } from "../ReportPreview";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

interface PropertySectionProps {
  configData: ReportData;
  onChange: (data: ReportData) => void;
}

export default function PropertySection({
  configData,
  onChange,
}: PropertySectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <h5 className="font-bold text-xl">Imóvel</h5>

      <LinkBuildingButton
        buildingId={configData.buildingId}
        buildingName={configData.propertyName}
        buildingPhoto={configData.mainPhoto}
        onUnlink={() => onChange({ ...configData, buildingId: null })}
        onLink={(building) => {
          onChange({
            ...configData,
            mainPhoto: building.mainPhoto,
            description: building.description,
            subtitle: building.subtitle,
            propertyName: building.propertyName,
            propertyNameFont: building.propertyNameFont,
            additionalPhotos: building.additionalPhotos,
            features: building.features,
            suites: building.suites,
            bedrooms: building.bedrooms,
            bathrooms: building.bathrooms,
            parkingSpaces: building.parkingSpaces,
            builtArea: building.builtArea,
            landArea: building.landArea,
            address: building.address,
            cod: building.cod,
            value: building.value,
            buildingId: building.id,
          });
        }}
      />

      <div className="grid grid-cols-2 gap-5">
        <FormControl className="col-span-2">
          <FormLabel htmlFor="propertyName">Nome</FormLabel>
          <Input
            id="propertyName"
            value={configData.propertyName}
            onChange={(e) =>
              onChange({ ...configData, propertyName: e.target.value })
            }
          />
        </FormControl>

        <FormControl className="col-span-2">
          <FormLabel htmlFor="subtitle">Subtítulo</FormLabel>
          <Textarea
            id="subtitle"
            value={configData.subtitle}
            minRows={2}
            onChange={(e) => {
              onChange({ ...configData, subtitle: e.target.value });
            }}
          />
        </FormControl>

        <div className="col-span-2">
          <div className="flex flex-col gap-2">
            <FormLabel>Descrição</FormLabel>
            <SimpleEditor
              content={configData.description}
              onUpdate={(newHtml) =>
                onChange({ ...configData, description: newHtml })
              }
            />
          </div>
        </div>

        <FormControl className="col-span-2">
          <CurrencyInput
            infoTooltip=""
            noHeight
            label="Valor Original"
            value={configData.value}
            onChange={(e) =>
              onChange({ ...configData, value: Number(e.target.value) })
            }
          />
        </FormControl>

        <FormControl className="col-span-2">
          <FormLabel htmlFor="address">Endereço</FormLabel>
          <Input
            id="address"
            value={configData.address}
            onChange={(e) =>
              onChange({ ...configData, address: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="bedrooms">Quartos</FormLabel>
          <Input
            id="bedrooms"
            value={configData.bedrooms}
            onChange={(e) =>
              onChange({ ...configData, bedrooms: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="suites">Suítes</FormLabel>
          <Input
            id="suites"
            value={configData.suites}
            onChange={(e) =>
              onChange({ ...configData, suites: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="bathrooms">Banheiros</FormLabel>
          <Input
            id="bathrooms"
            value={configData.bathrooms}
            onChange={(e) =>
              onChange({ ...configData, bathrooms: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="parkingSpaces">Vagas</FormLabel>
          <Input
            id="parkingSpaces"
            value={configData.parkingSpaces}
            onChange={(e) =>
              onChange({ ...configData, parkingSpaces: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="builtArea">Área Construída (m²)</FormLabel>
          <Input
            id="builtArea"
            value={configData.builtArea}
            onChange={(e) =>
              onChange({ ...configData, builtArea: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="landArea">Área do Terreno (m²)</FormLabel>
          <Input
            id="landArea"
            value={configData.landArea}
            onChange={(e) =>
              onChange({ ...configData, landArea: e.target.value })
            }
          />
        </FormControl>
      </div>

      <ItemListInput
        label="Características"
        items={configData.features}
        onChange={(items) => onChange({ ...configData, features: items })}
      />
    </div>
  );
}
