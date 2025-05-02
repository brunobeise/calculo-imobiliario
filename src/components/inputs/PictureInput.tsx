/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaRedo, FaTrash } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { FormControl, FormHelperText, FormLabel } from "@mui/joy";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

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

interface DragItem {
  index: number;
  src: string;
  type: string;
  source: string;
}

const ItemTypes = {
  IMAGE: "image",
};

const DraggableImage = ({
  src,
  index,
  moveImage,
  handleDelete,
  source,
}: any) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.IMAGE,
    hover: (item) => {
      if (item.index === index) return;
      moveImage(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index, src, source, type: ItemTypes.IMAGE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="relative h-20 max-w-32 flex items-center justify-center border border-border rounded cursor-grab"
      style={{ opacity: isDragging ? 0.5 : 1 }}
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
  const [fileSrcs, setFileSrcs] = useState<string[]>(value);
  const [Error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [, dropArea] = useDrop({
    accept: ItemTypes.IMAGE,
    drop: (item: { src: string; source: string }) => {
      if (item.source !== label && onDrop) {
        onDrop(item.src, item.source);
      }
    },
  });

  const handleFiles = (files: FileList) => {
    const srcs = Array.from(files)
      .map((file) => {
        if (file.size / 1024 > maxSize) {
          setError(`Tamnanho máximo é ${maxSize}KB`);
          return null;
        }
        return URL.createObjectURL(file);
      })
      .filter((src) => src && src.trim() !== "");

    const newSrcs = multiple ? [...fileSrcs, ...srcs] : srcs;

    setFileSrcs(newSrcs);
    onChange(newSrcs.join(","));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const moveImage = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setFileSrcs((prevSrcs) => {
        const updated = [...prevSrcs];
        const [removed] = updated.splice(dragIndex, 1);
        updated.splice(hoverIndex, 0, removed);
        onChange(updated.join(","));
        return updated;
      });
    },
    [onChange]
  );

  const handleDelete = (index: number) => {
    const updated = fileSrcs.filter((_, i) => i !== index);
    setFileSrcs(updated);
    onChange(updated.join(","));
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setFileSrcs(value.filter((v) => v && v.trim() !== ""));
  }, [value]);

  return (
    <FormControl
      ref={dropArea}
      error={!!error || !!Error}
      className={`relative ${bordered ? "border border-border rounded" : ""}`}
    >
      <FormLabel>{label}</FormLabel>

      {fileSrcs.filter(Boolean).length > 1 ? (
        <div className="flex flex-wrap gap-2 border border-border p-4 ">
          {fileSrcs.filter(Boolean).map((src, index) => (
            <DraggableImage
              key={index}
              src={src}
              index={index}
              moveImage={moveImage}
              handleDelete={handleDelete}
              source={label}
            />
          ))}
          <div
            className="text-2xl flex items-center justify-center h-20 w-20 border border-dashed rounded text-grayText cursor-pointer hover:bg-border"
            onClick={() => fileInputRef.current?.click()}
          >
            <IoIosAdd />
          </div>
        </div>
      ) : fileSrcs.filter(Boolean).length === 1 ? (
        <div className="flex items-center justify-between p-4 border border-border rounded min-w-[300px]">
          <div className="flex gap-2 items-center">
            <img
              src={fileSrcs[0]}
              alt="Preview"
              className="max-h-20 max-w-32 object-cover rounded"
            />
            {multiple && (
              <div
                className="text-2xl flex items-center justify-center h-20 w-20 border border-dashed rounded text-grayText cursor-pointer hover:bg-border"
                onClick={() => fileInputRef.current?.click()}
              >
                <IoIosAdd />
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReplace}
              className="text-blue-500"
            >
              <FaRedo />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(0)}
              className="text-red"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`flex justify-center items-center border-dashed border-2 rounded-md p-6 cursor-pointer hover:border-grayScale-400 min-h-24 ${
            error || Error
              ? "border-red border-1 text-red"
              : "border-gray border-2  text-grayText"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <FormHelperText>
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
        <FormHelperText>{error?.toString() || Error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default PictureInput;
