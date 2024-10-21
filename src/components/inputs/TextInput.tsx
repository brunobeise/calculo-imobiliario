import { FormLabel, Textarea, Input } from "@mui/joy";

interface TextFieldInputProps {
  onChange: (value: string) => void;
  label: string;
  isTextarea?: boolean;
  value?: string;
}

export default function TextInput({
  onChange,
  value,
  label,
  isTextarea = false,
}: TextFieldInputProps) {
  return (
    <div className="p-3 rounded flex items-center">
      <div className="ms-4 w-full">
        <FormLabel htmlFor={label}>{label}</FormLabel>
        <div className="mt-2">
          {isTextarea ? (
            <Textarea
              value={value}
              minRows={2}
              slotProps={{
                textarea: {
                  onChange: (e) => onChange(e.target.value),
                },
              }}
            />
          ) : (
            <Input value={value} onChange={(e) => onChange(e.target.value)} />
          )}
        </div>
      </div>
    </div>
  );
}
