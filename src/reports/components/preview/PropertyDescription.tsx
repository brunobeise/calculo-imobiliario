import { ReportData } from "@/reports/ReportPreview";
import SectionTitle from "./SectionTitle";
import { BsHouse } from "react-icons/bs";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { FaBath, FaBed, FaCar, FaHammer } from "react-icons/fa6";
import { SlSizeFullscreen } from "react-icons/sl";
import { Gallery } from "react-grid-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { useEffect, useState } from "react";

interface PropertyDescriptionProps {
  configData: ReportData;
  color: string;
  secondary: string;
}

export default function PropertyDescription(props: PropertyDescriptionProps) {
  const { color, configData, secondary } = props;

  const [imageData, setImageData] = useState<
    { src: string; original: string; width: number; height: number }[]
  >([]);
  const [index, setIndex] = useState(-1);

  const getImageSize = (
    src: string
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => resolve({ width: 300, height: 200 });
      img.src = src;
    });
  };

  useEffect(() => {
    const fetchImageSizes = async () => {
      const updatedImages = await Promise.all(
        [...configData.additionalPhotos].map(
          async (image) => {
            const { width, height } = await getImageSize(image);
            return { src: image, original: image, width, height };
          }
        )
      );
      setImageData(updatedImages);
    };

    if (configData.additionalPhotos.length > 0) {
      fetchImageSizes();
    }
  }, [configData.additionalPhotos]);

  const handleClick = (clickedIndex: number) => {
    setIndex(clickedIndex);
  };

  const handleClose = () => setIndex(-1);

  const nextIndex = (index + 1) % imageData.length;
  const prevIndex = (index - 1 + imageData.length) % imageData.length;

  return (
    <div>
      <div className="px-12 pt-6 mb-6">
        <SectionTitle
          color={color}
          secondary={secondary}
          icon={<BsHouse />}
          title={configData.propertyName}
        />
        <div className="grid grid-cols-2 gap-4 mb-4 text-lg">
          <div>
            {configData.bedrooms && (
              <p style={{ color: secondary }}>
                <FaBed className="inline mb-2 me-2" />
                <strong>Dormitórios:</strong>{" "}
                <strong style={{ color }}> {configData.bedrooms} </strong>
                <span className="text-md" style={{ color }}>
                  {" "}
                  {configData.suites &&
                    `(${configData.suites} suíte${
                      Number(configData.suites) > 1 ? "s" : ""
                    })`}
                </span>
              </p>
            )}
            {configData.bathrooms && (
              <p style={{ color: secondary }}>
                <FaBath className="inline mb-2 me-2" />
                <strong>Banheiros:</strong>{" "}
                <strong style={{ color }}> {configData.bathrooms} </strong>
              </p>
            )}
            {configData.parkingSpaces && (
              <p style={{ color: secondary }}>
                <FaCar className="inline mb-2 me-2" />
                <strong>Vagas:</strong>{" "}
                <strong style={{ color }}> {configData.parkingSpaces} </strong>
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
              <div
                style={{ color: secondary }}
                className="flex items-center mb-2"
              >
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm">
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
      </div>
      {imageData.length > 0 && (
        <div className="my-4">
          <Gallery
           rowHeight={300}
            images={imageData}
            onClick={handleClick}
            enableImageSelection={false}
          />
          {index >= 0 && (
            <Lightbox
              mainSrc={imageData[index].original}
              nextSrc={imageData[nextIndex].original}
              prevSrc={imageData[prevIndex].original}
              onCloseRequest={handleClose}
              onMovePrevRequest={() => setIndex(prevIndex)}
              onMoveNextRequest={() => setIndex(nextIndex)}
            />
          )}
        </div>
      )}
    </div>
  );
}
