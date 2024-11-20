import React from "react";

interface ReportDividerProps {
  title: string;
  color: string;
  bars: number;
}

const ReportDivider: React.FC<ReportDividerProps> = ({ title, color, bars }) => {
  const renderBars = (number : number) => {
    const bars = [];
    for (let i = 0; i < number; i++) {
      bars.push(
        <span
          key={i}
          style={{
            display: "inline-block",
            width: "5px",
            height: "20px",
            backgroundColor: color,
            transform: "skewX(-30deg)",
            marginRight: "8px",
          }}
        ></span>
      );
    }
    return bars;
  };

  return (
    <div className="flex items-center justify-left w-full my-4">
      <div className="flex justify-end flex-grow">{renderBars(bars / 3)}</div>

      <h2
        className="px-4 font-bold text-xl uppercase text-center text-nowrap"
        style={{ color: color }}
      >
        {title}
      </h2>

      <div className="flex justify-start flex-grow">{renderBars(bars)}</div>
    </div>
  );
};

export default ReportDivider;
