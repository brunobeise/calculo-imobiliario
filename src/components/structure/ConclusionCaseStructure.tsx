import { Sheet } from "@mui/joy";
import { toBRL } from "@/lib/formatter";
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
        <span className="text-[1rem]">{`- ${label}`}</span>
        <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
        <span className={valueClass + " text-[1rem]"}>
          {toBRL(value)}
        </span>
        {tooltipText && (
          <div className="absolute right-5">
            <InfoTooltip text={tooltipText} />
          </div>
        )}
      </div>
    );
};

interface ConclusionCaseStructureProps {
  title: string;
  subtitle: string;
  data: Array<{
    label: string;
    value: number;
    valueClass?: string;
    tooltipText?: string;
  }>;
  profitPercent?: {
    totalProfit: number;
    totalProfitPercent: number;
    finalYear: number;
  };
  finalNotes?: string;
  isPercentLastLine?: boolean;
}

export default function ConclusionCaseStructure({
  title,
  subtitle,
  data,
  profitPercent,
  finalNotes,
  isPercentLastLine = false, // Padrão é falso
}: ConclusionCaseStructureProps) {
  return (
    <Sheet
      variant="outlined"
      className="col-span-12 md:col-span-6 lg:col-span-4 order-last lg:order-none text-center p-5"
    >
      <h2 className="text-xl text-center my-2 font-bold">{title}</h2>
      <p className="text-md mb-7 text-center">{subtitle}</p>

      <div className="text-xl col-span-4 px-4 pe-6">
        {data.map((item, index) => (
          <InfoRow
            key={index}
            label={item.label}
            value={item.value}
            valueClass={item.valueClass}
            tooltipText={item.tooltipText}
          />
        ))}
        {isPercentLastLine && profitPercent && (
          <div className="flex justify-between items-center">
            <span className="text-[1rem]">{`- Lucro (%)`}</span>
            <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
            <span className="text-green font-bold text-[1rem]">
              {profitPercent.totalProfitPercent.toFixed(2) + "% / "}
              {(
                profitPercent.totalProfitPercent / profitPercent.finalYear
              ).toFixed(2) + "% (ano)"}
            </span>
          </div>
        )}
      </div>

      {finalNotes && (
        <p className="text-xs mt-5">
          <strong>{finalNotes}</strong>
        </p>
      )}
    </Sheet>
  );
}
