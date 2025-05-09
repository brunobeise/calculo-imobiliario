import { ReportData } from "@/reports/ReportPreview";
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
import { FaSackDollar } from "react-icons/fa6";
import { SimpleViewer } from "@/components/tiptap-templates/simple/simple-viewer";

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

    if (configData.additionalPhotos?.length > 0) {
      fetchImageSizes();
    }
  }, [configData.additionalPhotos]);

  return (
    <div>
      <div className="px-12 pt-6 mb-6">
        <div className="text-2xl mb-6">
          <strong style={{ color, fontFamily: configData.propertyNameFont }}>
            {configData.propertyName}
          </strong>
        </div>
        {configData.description && (
          <div style={{ color }} className="my-6 mb-8">
            <SimpleViewer html={configData.description} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4 text-lg">
          {value && (
            <span style={{ color: color }} className="col-span-2">
              <FaSackDollar style={{ color }} className="inline mb-2 me-2" />
              <strong> Valor do imóvel: </strong>
              <strong style={{ color: secondary }}>{toBRL(value)}</strong>
            </span>
          )}

          <div>
            {configData.bedrooms && (
              <p style={{ color: secondary }}>
                <FaBed style={{ color }} className="inline mb-2 me-2" />
                <strong style={{ color }}> Dormitórios:</strong>{" "}
                <strong> {configData.bedrooms} </strong>
                <span className="text-md">
                  {" "}
                  {configData.suites &&
                    Number(configData.suites) > 0 &&
                    `(${configData.suites} suíte${
                      Number(configData.suites) > 1 ? "s" : ""
                    })`}
                </span>
              </p>
            )}
            {configData.bathrooms && Number(configData.bathrooms) > 0 && (
              <p style={{ color: secondary }}>
                <FaBath style={{ color }} className="inline mb-2 me-2" />
                <strong style={{ color }}> Banheiros:</strong>{" "}
                <strong> {configData.bathrooms} </strong>
              </p>
            )}
            {configData.parkingSpaces &&
              Number(configData.parkingSpaces) > 0 && (
                <p style={{ color: secondary }}>
                  <FaCar style={{ color }} className="inline mb-2 me-2" />
                  <strong style={{ color }}> Vagas:</strong>{" "}
                  <strong> {configData.parkingSpaces} </strong>
                </p>
              )}
            {configData.builtArea && Number(configData.builtArea) > 0 && (
              <p style={{ color: secondary }}>
                <FaHammer style={{ color }} className="inline mb-2 me-2" />
                <strong style={{ color }}> Área construída:</strong>{" "}
                <strong>{configData.builtArea}m² </strong>
              </p>
            )}
            {configData.landArea && Number(configData.landArea) > 0 && (
              <p style={{ color: secondary }}>
                <SlSizeFullscreen
                  style={{ color }}
                  className="inline mb-2 me-2"
                />
                <strong style={{ color }}> Área do terreno:</strong>{" "}
                <strong>{configData.landArea}m²</strong>
              </p>
            )}
          </div>
          {configData.address && (
            <div className="text-lg">
              <div
                style={{ color: secondary }}
                className="flex items-center mb-2"
              >
                <FaMapMarkerAlt style={{ color }} size={16} className="mr-2" />
                <strong style={{ color }}>Localização</strong>
              </div>
              <p style={{ color: secondary }}>{configData.address}</p>
            </div>
          )}
        </div>

        {configData.features.length > 0 && (
          <div className="text-lg">
            <strong style={{ color }} className="block mb-3">
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
      {imageData.length > 0 && configData.additionalPhotos?.length > 1 && (
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
