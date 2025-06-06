import PictureInput from "@/components/inputs/PictureInput";
import { Proposal } from "@/types/proposalTypes";

interface ImagesSectionProps {
  proposal: Proposal;
  onChange: (data: Proposal) => void;
}

export default function ImagesSection({
  proposal,
  onChange,
}: ImagesSectionProps) {
  const handleDrop = (image: string, source: string) => {
    if (source === "Foto Principal") {
      const updatedAdditionalPhotos = [
        ...proposal.additionalPhotos,
        proposal.mainPhoto,
      ].filter(Boolean);

      onChange({
        ...proposal,
        mainPhoto: image,
        additionalPhotos: updatedAdditionalPhotos,
      });
    } else if (source === "Fotos Adicionais") {
      const newAdditionalPhotos = proposal.additionalPhotos.filter(
        (img) => img !== image
      );

      if (proposal.mainPhoto) {
        newAdditionalPhotos.push(proposal.mainPhoto);
      }

      onChange({
        ...proposal,
        mainPhoto: image,
        additionalPhotos: newAdditionalPhotos,
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h5 className="font-bold text-xl">Imagens</h5>

      <PictureInput
        label="Foto Principal"
        value={[proposal.mainPhoto]}
        onChange={(v) => onChange({ ...proposal, mainPhoto: v })}
        onDrop={(image, source) => handleDrop(image, source)}
      />

      <PictureInput
        label="Fotos Adicionais"
        multiple
        value={proposal.additionalPhotos}
        onChange={(v) =>
          onChange({
            ...proposal,
            additionalPhotos: v.split(","),
          })
        }
        onDrop={(image, source) => handleDrop(image, source)}
      />
    </div>
  );
}
