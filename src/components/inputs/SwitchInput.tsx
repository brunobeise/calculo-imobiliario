import React from "react";
import { FormLabel, Switch, switchClasses } from "@mui/joy";
import InfoTooltip from "../ui/InfoTooltip";

interface BooleanInputSwitchProps {
  label: string;
  id?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  infoTooltip?: string;
}

const BooleanInputSwitch: React.FC<BooleanInputSwitchProps> = ({
  label,
  id,
  checked,
  onChange,
  infoTooltip,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Switch
        sx={() => ({
          [`& .${switchClasses.thumb}`]: {
            transition: "width 0.2s, left 0.2s",
          },
        })}
        id={id}
        onChange={(e) => onChange(e.target.checked)}
        checked={checked}
      />
      <FormLabel htmlFor={id} className="text-sm font-medium">
        {label}
      </FormLabel>
      {infoTooltip && <InfoTooltip text={infoTooltip} />}
    </div>
  );
};

export default BooleanInputSwitch;
