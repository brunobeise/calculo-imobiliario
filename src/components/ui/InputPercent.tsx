import React, { useRef, useState, useEffect } from "react";
import { Input } from "./input";

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
    const newValue = e.target.value;

    if (/^\d*\.?\d*$/.test(newValue) || newValue === "") {
      let displayValue = newValue;
      if (displayValue !== "0" && !displayValue.startsWith("0.")) {
        displayValue = displayValue.replace(/^0+(\d)/, "$1");
      }

      if (displayValue === ".") {
        displayValue = "0.";
      }

      if (displayValue.includes(".") && displayValue.endsWith("0")) {
        displayValue = displayValue.slice(0, -1);
      }

      setValueSpan(displayValue);

      if (displayValue === "" || displayValue === "0.") {
        onChangeValue(0);
      } else {
        onChangeValue(Number(displayValue));
      }
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
        onChange={handleChange}
        type="text"
        step={0.1}
        value={value.toString()}
        {...rest}
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
