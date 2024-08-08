import { FormLabel, Textarea } from "@mui/joy";

interface TextFieldInputProps {
  onChange: (value: string) => void;
  label: string;
}

export default function TextFieldReportInput({
  onChange,
  label,
}: TextFieldInputProps) {
  return (
    <div className="p-3 rounded flex items-center">
      <div className="ms-4 w-full">
        <FormLabel htmlFor={label}>{label}</FormLabel>
        <div className="mt-2">
          <Textarea
            minRows={2}
            slotProps={{
              textarea: {
                onChange: (e) => onChange(e.target.value),
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
