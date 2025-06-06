import { FormControl, FormLabel, Input, Textarea } from "@mui/joy";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import ItemListInput from "@/components/inputs/ItemListInput";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import VinculateBuildingButton from "@/components/shared/VinculateBuildingButton";
import { Proposal } from "@/types/proposalTypes";

interface PropertySectionProps {
  proposal: Proposal;
  onChange: (data: Proposal) => void;
}

export default function PropertySection({
  proposal,
  onChange,
}: PropertySectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <h5 className="font-bold text-xl">Imóvel</h5>

      <VinculateBuildingButton
        buildingId={proposal.buildingId}
        buildingName={proposal.propertyName}
        buildingPhoto={proposal.mainPhoto}
        onUnlink={() => onChange({ ...proposal, buildingId: null })}
        onLink={(building) => {
          onChange({
            ...proposal,
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
            value={proposal.propertyName}
            onChange={(e) =>
              onChange({ ...proposal, propertyName: e.target.value })
            }
          />
        </FormControl>

        <FormControl className="col-span-2">
          <FormLabel htmlFor="subtitle">Subtítulo</FormLabel>
          <Textarea
            id="subtitle"
            value={proposal.subtitle}
            minRows={2}
            onChange={(e) => {
              onChange({ ...proposal, subtitle: e.target.value });
            }}
          />
        </FormControl>

        <div className="col-span-2">
          <div className="flex flex-col gap-2">
            <FormLabel>Descrição</FormLabel>
            <SimpleEditor
              content={proposal.description}
              onUpdate={(newHtml) =>
                onChange({ ...proposal, description: newHtml })
              }
            />
          </div>
        </div>

        <FormControl className="col-span-2">
          <CurrencyInput
            infoTooltip=""
            noHeight
            label="Valor Original"
            value={proposal.value}
            onChange={(e) =>
              onChange({ ...proposal, value: Number(e.target.value) })
            }
          />
        </FormControl>

        <FormControl className="col-span-2">
          <FormLabel htmlFor="address">Endereço</FormLabel>
          <Input
            id="address"
            value={proposal.address}
            onChange={(e) => onChange({ ...proposal, address: e.target.value })}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="bedrooms">Quartos</FormLabel>
          <Input
            id="bedrooms"
            value={proposal.bedrooms}
            onChange={(e) =>
              onChange({ ...proposal, bedrooms: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="suites">Suítes</FormLabel>
          <Input
            id="suites"
            value={proposal.suites}
            onChange={(e) => onChange({ ...proposal, suites: e.target.value })}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="bathrooms">Banheiros</FormLabel>
          <Input
            id="bathrooms"
            value={proposal.bathrooms}
            onChange={(e) =>
              onChange({ ...proposal, bathrooms: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="parkingSpaces">Vagas</FormLabel>
          <Input
            id="parkingSpaces"
            value={proposal.parkingSpaces}
            onChange={(e) =>
              onChange({ ...proposal, parkingSpaces: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="builtArea">Área Construída (m²)</FormLabel>
          <Input
            id="builtArea"
            value={proposal.builtArea}
            onChange={(e) =>
              onChange({ ...proposal, builtArea: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="landArea">Área do Terreno (m²)</FormLabel>
          <Input
            id="landArea"
            value={proposal.landArea}
            onChange={(e) =>
              onChange({ ...proposal, landArea: e.target.value })
            }
          />
        </FormControl>
      </div>

      <ItemListInput
        label="Características"
        items={proposal.features}
        onChange={(items) => onChange({ ...proposal, features: items })}
      />
    </div>
  );
}
