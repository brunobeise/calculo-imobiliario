import React from "react";
import { Input, FormLabel } from "@mui/joy";
import InfoTooltip from "../ui/InfoTooltip";

interface PercentageInputProps {
  label: string;
  id: string;
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  step?: number;
  required?: boolean;
  wrapperClassName?: string;
  infoTooltip?: string;
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
}) => {
  return (
    <div className={wrapperClassName}>
      <div className="flex">
        <FormLabel htmlFor={id}>{label}</FormLabel>
        {infoTooltip && <InfoTooltip text={infoTooltip} />}
      </div>

      <Input
        id={id}
        value={value === 0 ? "" : value}
        onChange={onChange}
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