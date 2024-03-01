/* eslint-disable @typescript-eslint/no-explicit-any */

import { InputReportElement } from "@/pages/financiamento/financiamentoxavista/report/Context";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface PictureReportInputProps {
  onChange: (value: InputReportElement) => void;
  value: InputReportElement;
  label: string;
}

export default function PictureReportInput(props: PictureReportInputProps) {
  const handleFileChange = (e: React.ChangeEvent<any>) => {
    const file = e.target.files[0];
    if (file) {
      const src = URL.createObjectURL(file);

      props.onChange({
        ...props.value,
        content: src,
      });
    }
  };

  return (
    <div
      className={`p-3 rounded flex items-center ${
        !props.value.active
          ? " outline-0"
          : " outline outline-border outline-1 shadow"
      }`}
    >
      <Checkbox
        checked={props.value.active}
        onCheckedChange={(v) => {
          props.onChange({
            ...props.value,
            active: v as boolean,
          });
        }}
        className="block "
      />
      <div className="ms-4 w-full">
        <Label htmlFor={props.label}>{props.label}</Label>
        <Input
          className="w-full"
          onChange={handleFileChange}
          id={props.label}
          type="file"
        />
      </div>
    </div>
  );
}
