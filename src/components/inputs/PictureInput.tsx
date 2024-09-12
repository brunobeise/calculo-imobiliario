import React, { useState } from "react";
import { Button, FormLabel, SvgIcon } from "@mui/joy";

interface PictureReportInputProps {
  onChange: (src: string) => void;
  value?: string[];
  label: string;
  multiple?: boolean;
  bordered?: boolean;
}

export default function PictureInput({
  onChange,
  label,
  value,
  multiple = false,
  bordered = false,
}: PictureReportInputProps) {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileSrcs, setFileSrcs] = useState<string[]>(value || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const srcs = Array.from(files).map((file) => URL.createObjectURL(file));
      const names = Array.from(files).map((file) => file.name);
      setFileNames(names);
      setFileSrcs(srcs);
      onChange(srcs.join(","));
    }
  };

  return (
    <div
      className={`p-3 rounded ${
        bordered ? " py-3 px-0 border border-[#e7e5e4]" : ""
      }`}
    >
      <div className={"ms-4 w-full"}>
        <FormLabel htmlFor={label} className="mr-2">
          {label}
        </FormLabel>
        <div className="flex items-center mt-2">
          <Button
            role={undefined}
            tabIndex={-1}
            variant="outlined"
            color="neutral"
            startDecorator={
              <SvgIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
              </SvgIcon>
            }
          >
            Escolher arquivo
            <input
              id={label}
              type="file"
              multiple={multiple}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </Button>
          {fileSrcs.length === 1 && (
            <div className="flex items-center ml-4">
              {fileSrcs.map((src, index) => (
                <div key={index} className="flex items-center mr-4">
                  <img
                    src={src}
                    alt="Preview"
                    className="w-10 h-10 object-cover mr-2"
                  />
                  <span>{fileNames[index]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {fileSrcs.length > 1 && (
          <div className="flex items-center ml-4 mt-2 flex-wrap gap-5">
            {fileSrcs.map((src, index) => (
              <div key={index} className="flex items-center mr-4">
                <img
                  src={src}
                  alt="Preview"
                  className="w-10 h-10 object-cover mr-2"
                />
                <span>{fileNames[index]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
