import React, { useState } from "react";
import { Input, FormLabel } from "@mui/joy";
import InfoTooltip from "../ui/InfoTooltip";

interface PercentageInputProps {
  label: string;
  id?: string;
  value?: number;
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
  const [inputValue, setInputValue] = useState<string>(
    value !== undefined ? value.toString() : ""
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Permite que o usuário apague ou insira valores parcialmente
    setInputValue(newValue);

    // Apenas dispara onChange se o valor for um número válido
    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue)) {
      onChange({
        ...event,
        target: { ...event.target, value: parsedValue.toString() },
      });
    } else if (newValue === "") {
      onChange({ ...event, target: { ...event.target, value: "" } });
    }
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
        type="number"
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
