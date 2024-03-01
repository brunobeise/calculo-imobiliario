/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputReportElement } from "@/pages/financiamento/financiamentoxavista/report/Context";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface TextReportInputProps {
  onChange: (value: InputReportElement) => void;
  value:
    | InputReportElement
    | (InputReportElement & {
        [key: string]: string;
      });
  label: string;
  type?: React.HTMLInputTypeAttribute;
  keyName?: keyof InputReportElement;
  checkbox?: boolean;
  showInput?: boolean;
}

export default function TextReportInput({
  checkbox = true,
  showInput = true,
  ...props
}: TextReportInputProps) {
  const handleFileChange = (e: any) => {
    props.onChange({
      ...props.value,
      [props.keyName || "content"]: e.target.value,
    });
  };

  return (
    <div
      className={`p-3 rounded flex items-center ${
        !props.value.active
          ? " outline-0"
          : "outline outline-border outline-1 shadow"
      }`}
    >
      {checkbox && (
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
      )}
      {showInput && (
        <div className={checkbox ? "ms-4 w-full " : "w-full"}>
          <Label htmlFor={props.label}>{props.label}</Label>
          {props.type === "textarea" ? (
            <Textarea
              className="w-full min-h-[100px]"
              value={props.value[props.keyName ?? "content"]?.toString()}
              onChange={handleFileChange}
              id={props.label}
            />
          ) : (
            <Input
              className="w-full"
              value={props.value[props.keyName ?? "content"]?.toString()}
              onChange={handleFileChange}
              id={props.label}
              type={props.type ?? "text"}
            />
          )}
        </div>
      )}
      {!showInput && (
        <Label className="ms-5 w-full" htmlFor={props.label}>
          {props.label}
        </Label>
      )}
    </div>
  );
}
