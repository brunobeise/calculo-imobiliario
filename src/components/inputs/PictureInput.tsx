/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FaRedo, FaTrash } from "react-icons/fa";
import { useDrag, useDrop } from "react-dnd";
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
}

interface DraggableImageProps {
  src: string;
  index: number;
  moveImage: (from: number, to: number) => void;
  handleDelete: (index: number) => void;
  handleReplace: () => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
  src,
  index,
  moveImage,
  handleDelete,
  handleReplace,
}) => {
  const [, ref] = useDrag({
    type: "image",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "image",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className="relative h-20 max-w-32  flex items-center justify-center border border-border rounded overflow-hidden"
    >
      <img src={src} alt="Preview" className="object-cover h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
        <button type="button" onClick={handleReplace} className="text-white">
          <FaRedo />
        </button>
        <button
          type="button"
          onClick={() => handleDelete(index)}
          className="text-red"
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
}) => {
  const [fileNames, setFileNames] = useState<string[]>(value);
  const [fileSrcs, setFileSrcs] = useState<string[]>(value);

  const [Error, setError] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    const updatedSrcs = [...fileSrcs];
    const [movedSrc] = updatedSrcs.splice(from, 1);
    updatedSrcs.splice(to, 0, movedSrc);
    setFileSrcs(updatedSrcs);
    onChange(updatedSrcs.join(","));
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

  return (
    <FormControl
      error={!!error}
      className={`flex flex-col gap-2 p-4 ${
        bordered ? "border border-border rounded" : ""
      }`}
    >
      <FormLabel className="text-sm font-medium text-gray-700">
        {label}
      </FormLabel>
      {fileSrcs.filter(Boolean).length > 1 ? (
        <div className="relative flex items-center  gap-2 border border-border rounded p-4 min-h-24 w-full overflow-hidden">
          <div className="flex flex-wrap gap-2">
            {fileSrcs.map((src, index) => (
              <div key={src} className="cursor-pointer ">
                <DraggableImage
                  key={index}
                  src={src}
                  index={index}
                  moveImage={moveImage}
                  handleDelete={handleDelete}
                  handleReplace={handleReplace}
                />
              </div>
            ))}
            <div
              className={`text-2xl flex items-center justify-center h-20 w-20 border border-grayScale-400 border-dashed rounded text-grayText hover:border-grayScale-400 cursor-pointer hover:bg-border `}
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
  );
};

export default PictureInput;
