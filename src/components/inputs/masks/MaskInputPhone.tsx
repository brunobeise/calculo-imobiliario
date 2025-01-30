import * as React from "react";
import {
  PatternFormat,
  PatternFormatProps,
  NumberFormatValues,
} from "react-number-format";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  value?: string; // Adicionamos um valor opcional
}

const MaskInputPhone = React.forwardRef<PatternFormatProps, CustomProps>(
  function PatternFormatPhone({ onChange, value, name, ...other }, ref) {
    return (
      <PatternFormat
        {...other}
        getInputRef={ref}
        value={value} // Mantém a sincronia do valor do input
        onValueChange={(values: NumberFormatValues) => {
          const numericValue = values.value.replace(/\D/g, ""); // Remove caracteres não numéricos
          onChange({
            target: {
              name,
              value: numericValue,
            },
          });
        }}
        format="+55 ## #####-####"
        allowEmptyFormatting
        mask="_"
      />
    );
  }
);

export default MaskInputPhone;
