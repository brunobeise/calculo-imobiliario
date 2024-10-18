import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const MaskInputBRL = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatBRL(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        valueIsNumericString
        allowLeadingZeros
      />
    );
  }
);

export default MaskInputBRL;
