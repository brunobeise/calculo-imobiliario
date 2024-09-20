import React from "react";
import { Input, FormLabel } from "@mui/joy";
import MaskInputBRL from "@/components/inputs/masks/MaskInputBRL";
import InfoTooltip from "../ui/InfoTooltip";
import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";

interface CurrencyInputProps {
  label: string;
  id?: string;
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  wrapperClassName?: string;
  infoTooltip?: string;
  lock?: boolean;
  setLock?: (value: boolean) => void;
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
  lock,
  setLock,
}) => {
  return (
    <div className={wrapperClassName}>
      <div className="flex h-[40px] items-center">
        {lock === false && (
          <FaLock
            className="w-[10px] me-1 cursor-pointer"
            onClick={() => setLock && setLock(true)}
          />
        )}
        {lock && (
          <FaUnlock
            className="w-[10px] me-1 cursor-pointer"
            onClick={() => setLock && setLock(false)}
          />
        )}
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
