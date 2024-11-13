import React, { useState, useEffect } from "react";
import { Input, FormLabel } from "@mui/joy";
import InfoTooltip from "../ui/InfoTooltip";

interface PercentageInputProps {
  label: string;
  id?: string;
  value?: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  step?: number;
  required?: boolean;
  wrapperClassName?: string;
  infoTooltip?: string;
  noHeight?: boolean;
  placeholder?: string | number;
}

const PercentageInput: React.FC<PercentageInputProps> = ({
  label,
  id,
  value,
  onChange,
  min = 0.1,
  step = 0.1,
  required = true,
  wrapperClassName,
  infoTooltip,
  noHeight,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  useEffect(() => {
    setInputValue(
      value !== undefined ? value.toString().replace(".", ",") : ""
    );
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(",", ".");
    setInputValue(event.target.value);
    onChange({ ...event, target: { ...event.target, value: newValue } });
  };

  return (
    <div className={wrapperClassName}>
      <div className={`flex ${noHeight ? "" : "h-[40px]"} items-center`}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        {infoTooltip && <InfoTooltip text={infoTooltip} />}
      </div>

      <Input
        placeholder={placeholder?.toString()}
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        type="text"
        endDecorator="%"
        slotProps={{
          input: {
            min,
            step,
          },
        }}
        required={required}
      />
    </div>
  );
};

export default PercentageInput;
