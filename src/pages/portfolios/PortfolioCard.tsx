import { Tooltip, Typography } from "@mui/joy";
import dayjs from "dayjs";
import { Portfolio } from "@/types/portfolioTypes";
import { FaRegEye } from "react-icons/fa";
import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import PortfolioSessionsModal from "@/components/session/SessionPortfolioModal";

const PortfolioCard = ({ portfolio }: { portfolio: Portfolio }) => {
  const images = portfolio.items
    ?.map((item) => item.case?.mainPhoto || item.building?.mainPhoto)
    .filter(Boolean);

  const [sessionsModal, setSessionsModal] = useState(false);
  const [hasNewSession, setHasNewSession] = useState(false);

  return (
    <div className="relative overflow-hidden min-h-[235px] rounded-[12px] shadow-md duration-300 px-5 pt-[150px] flex flex-col bg-white cursor-pointer hover:shadow-lg">
      <div className="absolute w-full top-0 left-0 h-[150px] overflow-hidden">
        <div className="absolute w-full top-0 left-0 h-[150px] flex overflow-hidden rounded-t-[12px]">
          {images.map((src, i) => (
            <div
              key={i}
              className="h-full flex-1 relative z-0"
              style={{
                marginLeft:
                  i === 0
                    ? 0
                    : `-${Math.max(2, Math.floor(52 / images.length))}px`,
                clipPath:
                  i === 0
                    ? "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
                    : i === images.length - 1
                    ? "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)"
                    : "polygon(20% 0, 100% 0, 80% 100%, 0% 100%)",
                zIndex: images.length - i,
              }}
            >
              <img src={src} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <Tooltip title={portfolio.hasNewSession ? "Novas vizualizações!" : ""}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
            setHasNewSession(false);
            setSessionsModal(true);
          }}
          className={`relative text-primary !absolute top-[130px] !right-[-2px] rounded !bg-white  shadow flex gap-1 items-center justify-center h-10 w-14 hover:shadow-lg z-10`}
        >
          {portfolio._count.sessions}
          <FaRegEye className="text-md mt-1" />
        </div>
      </Tooltip>

      {hasNewSession && (
        <FaExclamationCircle className="absolute top-[127px] !right-[44px] text-primary bg-white rounded-full border-[1px] border-white text-lg" />
      )}

      <div className="mt-4 mb-2">
        <Typography className="font-bold text-gray-800 !text-lg" level="h4">
          {portfolio.name}
        </Typography>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-grayScale-400 text-xs">
          {portfolio.clientName ? `Cliente: ${portfolio.clientName}` : ""}
        </div>

        <div className="text-gray text-xs">
          {dayjs(portfolio.createdAt).format("DD/MM/YYYY")}
        </div>
      </div>

      <PortfolioSessionsModal
        open={sessionsModal}
        onClose={() => setSessionsModal(false)}
        portfolioId={portfolio.id}
      />
    </div>
  );
};

export default PortfolioCard;
