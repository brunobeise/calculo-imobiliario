/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FaEdit, FaRedo, FaTrash } from "react-icons/fa";
import { useDrag, useDrop } from "react-dnd";
import { IoIosAdd } from "react-icons/io";
import { Button, FormControl, FormHelperText, FormLabel } from "@mui/joy";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import Dialog from "../modals/Dialog";
import { ColumnsPhotoAlbum, RenderImageProps } from "react-photo-album";

interface PictureInputProps {
  onChange: (src: string) => void;
  value?: string[];
  label: string;
  multiple?: boolean;
  bordered?: boolean;
  maxSize?: number;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  onDrop?: (image: string, source: string) => void;
}

interface DraggableGalleryImageProps {
  photo: {
    src: string;
    width: number;
    height: number;
  };
  imageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  index: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
}

interface DraggableImageProps {
  src: string;
  index: number;
  handleDelete: (index: number) => void;
  handleReplace: () => void;
  source: string;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
  src,
  index,
  handleDelete,
  source,
}) => {
  const [, ref] = useDrag({
    type: "image",
    item: { index, src, source },
  });

  const [, drop] = useDrop({
    accept: "image",
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className="relative h-20 max-w-32 flex items-center justify-center border border-border rounded cursor-grab"
    >
      <img src={src} alt="Preview" className="object-cover h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => handleDelete(index)}
          className="absolute top-[-5px] right-[-5px] shadow-lg z-[10] border p-1 bg-white rounded-full text-red"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

interface DraggableGalleryImageProps {
  photo: {
    src: string;
    width: number;
    height: number;
  };
  imageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  index: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
}

const DraggableGalleryImage: React.FC<DraggableGalleryImageProps> = ({
  photo,
  imageProps,
  index,
  moveImage,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [, ref] = useDrag({
    type: "image",
    item: { index },
  });

  const [{ isOver }, drop] = useDrop({
    accept: "image",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        setHoverIndex(index);
      }
    },
    drop: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveImage(draggedItem.index, index);
      }
      setHoverIndex(null);
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`cursor-grab transition-all ${
        isOver || hoverIndex === index ? "opacity-50" : ""
      }`}
    >
      <span className="absolute rounded-full flex items-center justify-center bg-white text-primary w-6 h-6 m-2">{index + 1}</span>
      <img {...imageProps} src={photo.src} alt="Gallery Image" />
    </div>
  );
};

export const PictureInput: React.FC<PictureInputProps> = ({
  onChange,
  label,
  value = [],
  multiple = false,
  bordered = false,
  maxSize = 5120,
  error,
  onDrop,
}) => {
  const [fileNames, setFileNames] = useState<string[]>(value);
  const [fileSrcs, setFileSrcs] = useState<string[]>(value);
  const [Error, setError] = useState<string | null>(null);
  const [sortModal, setSortModal] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [, drop] = useDrop({
    accept: "image",
    drop: (item: { src: string; source: string }) => {
      if (item.source !== label && onDrop) {
        onDrop(item.src, item.source);
      }
    },
  });

  const handleFiles = (files: FileList) => {
    const srcs = Array.from(files).map((file) => {
      if (file.size / 1024 > maxSize) {
        setError(`File size exceeds the limit of ${maxSize}KB`);
        return "";
      }
      return URL.createObjectURL(file);
    });

    const names = Array.from(files).map((file) => file.name);
    const newSrcs = multiple
      ? [...fileSrcs.filter(Boolean), ...srcs.filter((src) => src !== "")]
      : srcs.filter((src) => src !== "");
    const newNames = multiple ? [...fileNames, ...names] : names;

    setFileNames(newNames);
    setFileSrcs(newSrcs);
    onChange(newSrcs.join(","));
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) handleFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const moveImage = (from: number, to: number) => {
    setImageData((prevImages) => {
      const updatedImages = [...prevImages];

      // Troca direta de posição entre os elementos
      [updatedImages[from], updatedImages[to]] = [
        updatedImages[to],
        updatedImages[from],
      ];

      return updatedImages;
    });

    setFileSrcs((prevSrcs) => {
      const updatedSrcs = [...prevSrcs];

      // Troca direta de posição entre os elementos
      [updatedSrcs[from], updatedSrcs[to]] = [
        updatedSrcs[to],
        updatedSrcs[from],
      ];

      onChange(updatedSrcs.join(",")); // Atualiza os valores corretamente

      return updatedSrcs;
    });
  };

  const handleDelete = (index: number) => {
    if (multiple) {
      const updatedSrcs = fileSrcs
        .filter((_, i) => i !== index)
        .filter(Boolean);
      const updatedNames = fileNames.filter((_, i) => i !== index);
      setFileSrcs(updatedSrcs);
      setFileNames(updatedNames);
      onChange(updatedSrcs.join(","));
    } else {
      setFileSrcs([]);
      setFileNames([]);
      onChange("");
    }
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setFileSrcs(value);
  }, [value]);

  const [imageData, setImageData] = useState<
    { src: string; original: string; width: number; height: number }[]
  >([]);

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
        fileSrcs.map(async (image) => {
          const { width, height } = await getImageSize(image);
          return { src: image, original: image, width, height };
        })
      );
      setImageData(updatedImages);
    };

    if (fileSrcs.length > 0) {
      fetchImageSizes();
    }
  }, [fileSrcs]);

  return (
    <>
      <FormControl
        ref={drop}
        error={!!error}
        className={`flex flex-col gap-2 relative ${
          bordered ? "border border-border rounded" : ""
        }`}
      >
        <FormLabel className="text-sm font-medium text-gray-700">
          {label}
        </FormLabel>
        {multiple && fileSrcs.length > 2 && (
          <button
            type="button"
            onClick={() => setSortModal(true)}
            className="!absolute !top-11 !right-2 !z-10  hover:text-grayScale-800 p-1 rounded bg-whitefull"
          >
            <FaEdit className="text-xl" />
          </button>
        )}

        {fileSrcs.filter(Boolean).length > 1 ? (
          <div className="relative flex items-center gap-2 border border-border rounded p-4 min-h-24 w-full overflow-hidden">
            <div className="flex flex-wrap gap-2">
              {fileSrcs.filter(Boolean).map((src, index) => (
                <DraggableImage
                  key={index}
                  src={src}
                  index={index}
                  handleDelete={handleDelete}
                  handleReplace={handleReplace}
                  source={label}
                />
              ))}

              <div
                className={`text-2xl flex items-center justify-center h-20 w-20 border border-grayScale-400 border-dashed rounded text-grayText hover:border-grayScale-400 cursor-pointer hover:bg-border`}
                onClick={() => fileInputRef.current?.click()}
              >
                <IoIosAdd />
              </div>
            </div>
          </div>
        ) : fileSrcs.filter(Boolean).length === 1 ? (
          <div className="flex items-center justify-between gap-2 p-4 border border-border rounded min-w-[300px] w-full h-24">
            <div className="flex gap-2">
              <img
                src={fileSrcs[0]}
                alt="Preview"
                className="max-h-20 max-w-32 object-cover rounded"
              />
              {multiple && (
                <div
                  className="text-2xl flex items-center justify-center h-20 w-20 border border-grayScale-400 border-dashed rounded text-grayText hover:border-grayScale-400 cursor-pointer hover:bg-border"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IoIosAdd />
                </div>
              )}
            </div>
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => handleReplace()}
                className="text-blue-500 hover:text-gray-600"
              >
                <FaRedo />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(0)}
                className="text-red hover:text-redDark"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`flex justify-center items-center border-dashed border-2 border-gray text-grayText rounded-md p-6 cursor-pointer hover:border-grayScale-400 min-h-24${
              error ? " border-error hover:border-red" : ""
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <FormHelperText className="text-sm font-medium">
              {multiple ? "Selecionar imagens" : "Selecionar imagem"}
            </FormHelperText>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={handleFileChange}
        />
        {(error || Error) && (
          <FormHelperText>{error.toString() || Error}</FormHelperText>
        )}
      </FormControl>
      {multiple && (
        <Dialog
          title="Ordenar Imagens"
          open={sortModal}
          onClose={() => setSortModal(false)}
          actions={
            <Button onClick={() => setSortModal(false)}>Confirmar</Button>
          }
        >
          <div className="w-[150mm]">
            <ColumnsPhotoAlbum
              photos={imageData}
              spacing={5}
              columns={2}
              render={{
                image: ({
                  src,
                  width,
                  height,
                  ...imageProps
                }: RenderImageProps) => {
                  const index = imageData.findIndex((img) => img.src === src);
                  return (
                    <DraggableGalleryImage
                      key={src}
                      photo={{
                        src,
                        width: Number(width),
                        height: Number(height),
                      }}
                      imageProps={imageProps}
                      index={index}
                      moveImage={moveImage}
                    />
                  );
                },
              }}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};

export default PictureInput;
