import SectionTitle from "./SectionTitle";
import { BsHouse } from "react-icons/bs";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { ReportData } from "../ReportConfig";
import { FaBath, FaBed, FaCar, FaHammer } from "react-icons/fa6";
import { SlSizeFullscreen } from "react-icons/sl";

interface PropertyDescriptionProps {
  configData: ReportData & { pageViewMap?: boolean[] };
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
              <FaBed className="inline mb-2 me-2" />
              <strong>Dormitórios:</strong> <strong style={{ color }}> {configData.suites} </strong>
            </p>
          )}
          {configData.bathrooms && (
            <p style={{ color: secondary }}>
              <FaBath className="inline mb-2 me-2" />
              <strong>Banheiros:</strong> <strong style={{ color }}> {configData.bathrooms} </strong>
            </p>
          )}
          {configData.parkingSpaces && (
            <p style={{ color: secondary }}>
              <FaCar className="inline mb-2 me-2" />
              <strong>Vagas:</strong> <strong style={{ color }}> {configData.parkingSpaces} </strong>
            </p>
          )}
          {configData.builtArea && (
            <p style={{ color: secondary }}>
              <FaHammer className="inline mb-2 me-2" />
              <strong>Área construída:</strong>{" "}
              <strong style={{ color }}>{configData.builtArea}m² </strong>
            </p>
          )}

          {configData.landArea && (
            <p style={{ color: secondary }}>
              <SlSizeFullscreen className="inline mb-2 me-2" />
              <strong>Área do terreno:</strong>{" "}
              <strong style={{ color }}>{configData.landArea}m²</strong>
            </p>
          )}
        </div>

        {configData.address && (
          <div className="text-lg">
            <div style={{ color: secondary }} className="flex items-center mb-2">
              <FaMapMarkerAlt size={16} className="mr-2" />
              <strong>Localização</strong>
            </div>
            <p style={{ color: secondary }}>{configData.address}</p>
          </div>
        )}
      </div>

      {configData.features.length > 0 && (
        <div className="text-lg">
          <strong style={{ color: secondary }} className="block mb-3">
            Características
          </strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
            {configData.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <FaCheckCircle
                  style={{ color }}
                  className="flex-shrink-0 w-4 h-4"
                />
                <span className="ml-2" style={{ color: secondary }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {configData.additionalPhotos.length > 0 && (
        <>
          <div className="columns-2 mt-5">
            {configData.additionalPhotos.map((p) => (
              <div
                key={p}
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
