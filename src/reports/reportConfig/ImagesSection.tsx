import PictureInput from "@/components/inputs/PictureInput";
import { ReportData } from "../ReportPreview";

interface ImagesSectionProps {
  configData: ReportData;
  onChange: (data: ReportData) => void;
}

export default function ImagesSection({
  configData,
  onChange,
}: ImagesSectionProps) {
  const handleDrop = (image: string, source: string) => {
    if (source === "Foto Principal") {
      const updatedAdditionalPhotos = [
        ...configData.additionalPhotos,
        configData.mainPhoto,
      ].filter(Boolean);

      onChange({
        ...configData,
        mainPhoto: image,
        additionalPhotos: updatedAdditionalPhotos,
      });
    } else if (source === "Fotos Adicionais") {
      const newAdditionalPhotos = configData.additionalPhotos.filter(
        (img) => img !== image
      );

      if (configData.mainPhoto) {
        newAdditionalPhotos.push(configData.mainPhoto);
      }

      onChange({
        ...configData,
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
        value={[configData.mainPhoto]}
        onChange={(v) => onChange({ ...configData, mainPhoto: v })}
        onDrop={(image, source) => handleDrop(image, source)}
      />

      <PictureInput
        label="Fotos Adicionais"
        multiple
        value={configData.additionalPhotos}
        onChange={(v) =>
          onChange({
            ...configData,
            additionalPhotos: v.split(","),
          })
        }
        onDrop={(image, source) => handleDrop(image, source)}
      />
    </div>
  );
}
