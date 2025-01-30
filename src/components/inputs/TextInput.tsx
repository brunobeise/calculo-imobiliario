/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormLabel,
  Textarea,
  Input,
  FormControl,
  FormHelperText,
} from "@mui/joy";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface TextFieldInputProps {
  onChange: (value: string) => void;
  label: string;
  isTextarea?: boolean;
  value?: string | number;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

export default function TextInput({
  onChange,
  value,
  label,
  isTextarea = false,
  error,
}: TextFieldInputProps) {
  return (
    <FormControl error={!!error} className="p-3 rounded flex items-center">
      <div className="w-full">
        <FormLabel>{label}</FormLabel>

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
            <Input
              error={!!error}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </div>
        {error && <FormHelperText>{error.toString()}</FormHelperText>}
      </div>
    </FormControl>
  );
}
