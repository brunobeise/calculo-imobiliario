import { numeroParaReal } from "@/lib/formatter";
import InfoTooltip from "../ui/InfoTooltip";

interface InfoRowProps {
  label: string;
  value: number;
  valueClass?: string;
  tooltipText?: string;
}

const InfoRow = ({ label, value, valueClass, tooltipText }: InfoRowProps) => {
  if (value !== 0)
    return (
      <div className="flex justify-between items-center">
        <span>{`- ${label}`}</span>
        <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
        <span className={valueClass}>{numeroParaReal(value)}</span>
        {tooltipText && (
          <div className="absolute right-7">
            <InfoTooltip text={tooltipText} />
          </div>
        )}
      </div>
    );
};

export default InfoRow;
