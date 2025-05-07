import React, { ReactNode } from "react";
import { Input, FormLabel } from "@mui/joy";
import MaskInputBRL from "@/components/inputs/masks/MaskInputBRL";
import InfoTooltip from "../ui/InfoTooltip";
import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";

interface CurrencyInputProps {
  label?: string;
  id?: string;
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  opacity?: boolean;
  wrapperClassName?: string;
  infoTooltip?: string;
  lock?: boolean;
  setLock?: (value: boolean) => void;
  noHeight?: boolean;
  extraButton?: ReactNode;
  placeholder?: string;
  valueAddon?: string;
  error?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  id,
  value,
  onChange,
  required = true,
  disabled = false,
  opacity = false,
  wrapperClassName,
  infoTooltip,
  lock,
  setLock,
  noHeight,
  extraButton,
  placeholder,
  valueAddon,
  error = false,
}) => {
  return (
    <div className={`${wrapperClassName} ${opacity ? "opacity-50" : ""}`}>
      <div className={`flex ${noHeight ? "" : "h-[40px]"} items-center`}>
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
        {label && <FormLabel htmlFor={id}>{label}</FormLabel>}

        {infoTooltip && <InfoTooltip text={infoTooltip} />}
      </div>

      <Input
        error={error}
        className={`${error ? "border" : ""}`}
        placeholder={placeholder}
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
        readOnly={disabled}
        endDecorator={
          <>
            {valueAddon && (
              <span
                className={`text-xs me-2 ${error ? "text-red" : " text-gray"}`}
              >
                ({valueAddon})
              </span>
            )}
            {extraButton}
          </>
        }
      />
    </div>
  );
};

export default CurrencyInput;
