import { notify } from "@/notify";
import { FaRegCopy } from "react-icons/fa";
interface PortfolioWhatsappPreviewProps {
  image: string;
  title: string;
  description: string;
  link: string;
  time?: string;
  layout?: "vertical" | "horizontal";
}

export function PortfolioWhatsappPreview({
  image,
  title,
  description,
  link,
  time,
  layout = "vertical",
}: PortfolioWhatsappPreviewProps) {
  if (layout === "horizontal") {
    // Layout antigo com imagem pequena à esquerda e texto resumido
    return (
      <div className="max-w-sm bg-transparent rounded-lg p-2 flex gap-2 font-sans text-white select-text cursor-text shadow-lg border border-border relative">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
            draggable={false}
          />
        </div>

        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div className="truncate font-semibold text-sm text-[#1b1b1b]">
            {title}
          </div>
          <div className="text-[12px] text-[#1b1b1b] line-clamp-2 leading-tight mt-0.5">
            {description}
          </div>
          <div className="text-[9px] text-[#6f767e] truncate mt-1">{link}</div>
        </div>

        {time && (
          <div className="flex-shrink-0 text-[10px] text-[#727a80] leading-none absolute bottom-2 right-2 mt-1">
            {time}
          </div>
        )}
      </div>
    );
  }

  const handleCopy = () => {
    const message = `${description}\n\nhttps://${link}`;
    navigator.clipboard.writeText(message);
    notify("info", "Mensagem copiada para o clipboard");
  };

  return (
    <div className="max-w-xs bg-transparent rounded-lg p-3 flex flex-col font-sans text-[#1b1b1b] select-text cursor-text shadow-lg border border-border mt-4 relative">
      <button
        type="button"
        className="absolute right-4 top-4 bg-white/80 p-2 rounded"
      >
        <FaRegCopy onClick={handleCopy} className="text-primary text-xl" />
      </button>
      <div className="w-full rounded-lg overflow-hidden mb-3 aspect-square">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full"
          draggable={false}
        />
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <div className="text-sm text-gray-700 whitespace-pre-line leading-snug">
          {description}
        </div>
      </div>

      <a
        href={`https://${link}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-sm text-[#3376d0] hover:underline truncate"
        title={link}
      >
        {link}
      </a>

      {time && (
        <div className="text-xs text-gray-500 mt-1 self-end">{time}</div>
      )}
    </div>
  );
}
