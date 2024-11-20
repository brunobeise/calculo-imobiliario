import { FiFileText } from "react-icons/fi";

interface SummaryItem {
  title: string;
  description: string;
}

interface SummaryProps {
  items: SummaryItem[];
  color: string;
  secondary: string;
}

export default function Summary({ items, color, secondary }: SummaryProps) {
  return (
    <div style={{ color }} className="p-6 ">
      <div className="flex items-center mb-4 text-lg font-semibold">
        <FiFileText className="text-grayText text-2xl me-2" />
        <p>
          <span style={{ color }} className="font-bold">
            Sumário
          </span>{" "}
          - Clique na seção abaixo para acessar diretamente.
        </p>
      </div>
      <div className="flex flex-col gap-4 px-6">
        {items.map((item, index) => (
          <a href={`#section${index + 2}`}>
            <button
              key={index}
              className="w-full border rounded-xl p-2 text-left hover:bg-gray-100 transition-all ps-4"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-1" style={{ color: secondary }}>
                {item.description}
              </p>
            </button>
          </a>
        ))}
      </div>
    </div>
  );
}
