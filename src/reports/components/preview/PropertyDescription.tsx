import { FinancingPlanningReportData } from "@/reports/financingPlanningReport/FinancingPlanningReportConfig";
import SectionTitle from "./SectionTitle";
import { BsHouse } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";

interface PropertyDescriptionProps {
  configData: FinancingPlanningReportData;
  color: string;
  secondary: string;
}

export default function PropertyDescription(props: PropertyDescriptionProps) {
  const { color, configData, secondary } = props;

  return (
    <div className="px-12 pt-6 mb-10">
      <SectionTitle
        color={color}
        secondary={secondary}
        icon={<BsHouse />}
        title={configData.propertyName}
      />
      <div className="grid grid-cols-2 gap-4 mb-4 text-lg">
        <div>
          {configData.suites && (
            <p style={{ color: secondary }}>
              <strong style={{ color }}>Dormitórios:</strong>{" "}
              {configData.suites}{" "}
            </p>
          )}
          {configData.bathrooms && (
            <p style={{ color: secondary }}>
              <strong style={{ color }}>Banheiros:</strong>{" "}
              {configData.bathrooms}
            </p>
          )}
          {configData.parkingSpaces && (
            <p style={{ color: secondary }}>
              <strong style={{ color }}>Vagas:</strong>{" "}
              {configData.parkingSpaces}
            </p>
          )}
          {configData.builtArea && (
            <p style={{ color: secondary }}>
              <strong style={{ color }}>Área construída:</strong>{" "}
              {configData.builtArea}m²
            </p>
          )}

          {configData.landArea && (
            <p style={{ color: secondary }}>
              <strong style={{ color }}>Área do terreno:</strong>{" "}
              {configData.landArea}m²
            </p>
          )}
        </div>

        {configData.address && (
          <div className="text-lg">
            <div style={{ color }} className="flex items-center mb-2">
              <FaMapMarkerAlt
                size={16}
                style={{ color: secondary }}
                className="mr-2"
              />
              <strong>Localização</strong>
            </div>
            <p style={{ color: secondary }}>{configData.address}</p>
          </div>
        )}
      </div>

      {configData.features.length > 0 && (
        <div className="text-lg">
          <strong style={{ color }}>Características</strong>
          <p style={{ color: secondary }}>{configData.features?.join(" · ")}</p>
        </div>
      )}

      {configData.additionalPhotos.length > 0 && (
        <>
          <div className="columns-2 mt-5">
            {configData.additionalPhotos.map((p) => (
              <div
                style={{ borderColor: color }}
                className="relative overflow-hidden rounded-lg border border-4 my-2"
              >
                <img src={p} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
