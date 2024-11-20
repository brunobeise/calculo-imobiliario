import React, { ReactNode } from "react";
import { toBRL } from "@/lib/formatter";

interface LineItem {
  label: string;
  value: number;
  green?: boolean;
}

interface SectionProps {
  title: string;
  subtitle?: ReactNode;
  lines: LineItem[];
  color: string;
  secondary: string;
}

const ScenarioCard: React.FC<SectionProps> = ({
  title,
  subtitle,
  lines,
  color,
  secondary,
}) => {
  return (
    <div style={{ color }} className="border rounded-xl">
      <div className="px-3 py-2">
        <h6 style={{ color }} className="font-bold text-2xl">
          {title}
        </h6>
        <span style={{ color: secondary }}>{subtitle}</span>
      </div>
      <div style={{ backgroundColor: color }} className="h-[0.5px] mt-2" />

      <div className="p-2 px-4 text-md lg:text-xl">
        {lines.map(
          (line, index) =>
            line.value > 0 && (
              <div id={"scenario-card-" + line.label} key={index} className="flex">
                <span>{line.label}</span>
                <div className="flex-grow border-b border-dotted mx-1 mb-1"></div>
                <strong className={line.green ? "text-green" : "text-red"}>
                  {toBRL(line.value)}
                </strong>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default ScenarioCard;
