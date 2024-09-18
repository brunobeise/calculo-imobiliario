import React from "react";
import { Input, FormLabel } from "@mui/joy";
import MaskInputBRL from "@/components/inputs/masks/MaskInputBRL";
import InfoTooltip from "../ui/InfoTooltip";

interface CurrencyInputProps {
  label: string;
  id: string;
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  wrapperClassName?: string;
  infoTooltip?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  id,
  value,
  onChange,
  required = true,
  disabled = false,
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
        value={value}
        onChange={onChange}
        type="text"
        startDecorator="R$"
        slotProps={{
          input: {
            component: MaskInputBRL,
          },
        }}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default CurrencyInput;
