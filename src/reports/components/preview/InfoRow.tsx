import { toBRL } from "@/lib/formatter";

interface InfoRowProps {
  label: string;
  value: number;
  valueClass?: string;
  isTitle?: boolean;
}

const InfoRow = ({ label, value, valueClass, isTitle }: InfoRowProps) => {
  if (value !== 0)
    return (
      <div className="flex justify-between items-center">
        <span className={isTitle ? "font-bold" : ""}>{`${
          !isTitle ? "- " : ""
        }${label}`}</span>
        <div className="flex-grow border-b h-full border-dotted border-black mx-1 mt-5 border-primary"></div>
        {!isTitle ? (
          <span className={valueClass}>{toBRL(value)}</span>
        ) : (
          <span className={valueClass}>
            <strong>{toBRL(value)}</strong>
          </span>
        )}{" "}
      </div>
    );
};

export default InfoRow;
