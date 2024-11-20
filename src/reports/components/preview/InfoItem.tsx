import { toBRL } from "@/lib/formatter";
import dayjs from "dayjs";

interface InfoItemProps {
  text: string;
  value: number | string;
  type: "reais" | "percent" | "years" | "date";
  color: string;
  secondary: string;
}

const InfoItem = ({ text, value, type, color, secondary }: InfoItemProps) => {
  let formattedValue;

  switch (type) {
    case "reais":
      formattedValue = toBRL(value as number);
      break;

    case "percent":
      formattedValue = `${(value as number).toFixed(2)}%`;
      break;

    case "years":
      formattedValue = `${value} Anos`;
      break;

    case "date":
      formattedValue = dayjs(value as string, "MM/YYYY").format("MMM/YYYY");
      break;

    default:
      throw new Error(`Invalid type: ${type}`);
  }

  return (
    <p style={{color: secondary}}>
      {text}
      {"  "}
      <strong style={{color: color}}>{formattedValue}</strong>
    </p>
  );
};

export default InfoItem;
