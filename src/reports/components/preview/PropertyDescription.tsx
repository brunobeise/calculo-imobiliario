import { ReportData } from "@/reports/ReportPreview";
import SectionTitle from "./SectionTitle";
import { BsHouse } from "react-icons/bs";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { FaBath, FaBed, FaCar, FaHammer } from "react-icons/fa6";
import { SlSizeFullscreen } from "react-icons/sl";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";
import { toBRL } from "@/lib/formatter";

interface PropertyDescriptionProps {
  configData: Partial<ReportData>;
  color: string;
  secondary: string;
  photoViewer: boolean;
  value?: number;
}

export default function PropertyDescription({
  color,
  configData,
  secondary,
  photoViewer = true,
  value,
}: PropertyDescriptionProps) {
  const [imageData, setImageData] = useState<
    { src: string; original: string; width: number; height: number }[]
  >([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        [...configData.additionalPhotos].map(async (image) => {
          const { width, height } = await getImageSize(image);
          return { src: image, original: image, width, height };
        })
      );
      setImageData(updatedImages);
    };

    if (configData.additionalPhotos.length > 0) {
      fetchImageSizes();
    }
  }, [configData.additionalPhotos]);

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
          {value && (
            <span className="col-span-2">
              Valor do imóvel:{" "}
              <b style={{ color: color }} className="font-bold">
                {toBRL(value)}
              </b>
            </span>
          )}

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
      {imageData.length > 0 && configData.additionalPhotos.length > 1 && (
        <div className="my-4">
          <ColumnsPhotoAlbum
            photos={imageData}
            spacing={5}
            columns={2}
            onClick={(click) => {
              if (photoViewer) {
                setCurrentIndex(click.index);
                setLightboxOpen(true);
              }
            }}
          />

          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={imageData}
            index={currentIndex}
            controller={{
              closeOnBackdropClick: true,
            }}
            on={{
              view: ({ index: newIndex }) => setCurrentIndex(newIndex),
            }}
            styles={{
              container: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            }}
            plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Zoom]}
            animation={{ navigation: 500 }}
          />
        </div>
      )}
    </div>
  );
}
