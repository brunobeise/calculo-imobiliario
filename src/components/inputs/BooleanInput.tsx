import React from "react";
import { Checkbox } from "@mui/joy";
import InfoTooltip from "../ui/InfoTooltip";

interface BooleanInputProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  infoTooltip?: string;
}

const BooleanInput: React.FC<BooleanInputProps> = ({
  label,
  id,
  checked,
  onChange,
  infoTooltip,
}) => {
  return (
    <div className="flex items-center">
      <Checkbox id={id} onChange={onChange} checked={checked} label={label} />
      {infoTooltip && <InfoTooltip text={infoTooltip} />}
    </div>
  );
};

export default BooleanInput;
