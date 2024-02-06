/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputReportElement } from "@/pages/relatorio/financiamentoxavista/Context";
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
  keyDefinite?: string;
}

export default function TextReportInput(props: TextReportInputProps) {
  const handleFileChange = (e: any) => {
    props.onChange({
      ...props.value,
      content: e.target.value,
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

      <div className=" ms-4 w-full">
        <Label htmlFor={props.label}>{props.label}</Label>
        {props.type === "textarea" ? (
          <Textarea
            className="w-full min-h-[100px]"
            value={props.value.content}
            onChange={handleFileChange}
            id={props.label}
          />
        ) : (
          <Input
            className="w-full"
            value={props.value.content}
            onChange={handleFileChange}
            id={props.label}
            type={props.type ?? "text"}
          />
        )}
      </div>
    </div>
  );
}
