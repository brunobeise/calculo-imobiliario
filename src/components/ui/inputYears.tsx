import { Input } from "@mui/joy";
import React, { useRef, useState, useEffect } from "react";

interface InputYearsProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onChangeValue: (value: number) => void;
}

export default function InputYears({
  value,
  onChangeValue,
  ...rest
}: InputYearsProps) {
  const textWidthRef = useRef<HTMLInputElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [valueSpan, setValueSpan] = useState(value.toString());

  useEffect(() => {
    if (textWidthRef.current) {
      setTextWidth(textWidthRef.current.offsetWidth);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    let intValue = parseInt(newValue, 10);

    intValue = isNaN(intValue) ? 0 : Math.max(0, intValue);

    setValueSpan(intValue.toString());
    onChangeValue(intValue);
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
        variant="outlined"
        onChange={handleChange}
        type="number"
        value={value.toString()}
        slotProps={{
          input: {
            step: rest.step,
          },
        }}
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
        {value === 1 ? "ano" : "anos"}
      </span>
    </div>
  );
}
