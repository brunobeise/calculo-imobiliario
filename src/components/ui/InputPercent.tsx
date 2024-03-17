import { Input } from "@mui/joy";
import React, { useRef, useState, useEffect } from "react";

interface InputPercentProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onChangeValue: (value: number) => void;
}

export default function InputPercent({
  value,
  onChangeValue,
  ...rest
}: InputPercentProps) {
  const textWidthRef = useRef<HTMLInputElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [valueSpan, setValueSpan] = useState(value.toString());

  useEffect(() => {
    if (textWidthRef.current) {
      setTextWidth(textWidthRef.current.offsetWidth);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue.trim() === "") {
      newValue = "0";
    }

    if (/^\d*\.?\d*$/.test(newValue)) {
      let displayValue = newValue;

      if (displayValue === ".") {
        displayValue = "0.";
      }

      if (displayValue !== "0" && !displayValue.startsWith("0.")) {
        displayValue = displayValue.replace(/^0+(\d)/, "$1");
      }

      setValueSpan(displayValue);

      const numericValue = displayValue === "0." ? 0 : parseFloat(displayValue);
      onChangeValue(numericValue);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (textWidthRef.current) {
        setTextWidth(textWidthRef.current.offsetWidth);
      }
    });

    return () => clearTimeout(timeoutId);
  }, [valueSpan]);

  return (
    <div className="relative">
      <Input
        color="neutral"
        variant="outlined"
        onChange={handleChange}
        type="number"
        slotProps={{
          input: {
            step: rest.step || 1,
          },
        }}
        value={value.toString()}
      />

      <span
        ref={textWidthRef}
        className="absolute opacity-0 pointer-events-none"
      >
        {valueSpan || "0"}
      </span>

      <span
        className="absolute top-[50%] translate-y-[-45%]"
        style={{ left: `${textWidth + 15}px` }}
      >
        %
      </span>
    </div>
  );
}
