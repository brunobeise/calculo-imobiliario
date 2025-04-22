/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useData } from "vike-react/useData";
import { Head } from "vike-react/Head";
import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";
import FinancingPlanningReportPreview from "@/reports/FinancingPlanningReportPreview";
import DirectFinancingReportPreview from "@/reports/DirectFinancingReportPreview";
import BuildingPreview from "@/reports/BuildingPreview";

import { Portfolio } from "@/types/portfolioTypes";
import { usePageContext } from "vike-react/usePageContext";
import Dialog from "@/components/modals/Dialog";
import { Button, Input } from "@mui/joy";
import { useAuth } from "@/auth";

export default function PortfolioSharedPage() {
  const portfolioData = useData<Portfolio>();
  const pageContext = usePageContext();
  const componentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = portfolioData.items[currentIndex];
  const queryWhatsapp = pageContext.urlParsed.search.whatsapp;

  const [requestName, setRequestName] = useState(
    !portfolioData.requestName
      ? false
      : localStorage.getItem("viewerName")
      ? false
      : true
  );
  const [viewerName, setViewerName] = useState(
    localStorage.getItem("viewerName")
  );

  const socket = useRef<Socket | null>(null);
  const sessionId = useRef<string>(nanoid(7));
  const sessionTime = useRef<number>(0);
  const itemTimes = useRef<number[]>(
    new Array(portfolioData.items.length).fill(0)
  );
  const auth = useAuth();

  useEffect(() => {
    const newSocket = io(import.meta.env.PUBLIC_ENV__API_URL, {
      transports: ["websocket"],
      query: { whatsapp: queryWhatsapp },
    });

    newSocket.on("connect", () => {
      console.log("Socket conectado:", newSocket.id);
    });

    socket.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (requestName && !viewerName) return;

    const interval = setInterval(() => {
      sessionTime.current += 1;
      itemTimes.current[currentIndex] += 1;

      if (sessionTime.current % 3 === 0) {
        sendTrackingData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, requestName, viewerName]);

  const sendTrackingData = () => {
    if (
      !socket?.current.connected ||
      auth.isAuthenticated ||
      (requestName && !viewerName)
    )
      return;

    const dataToSend = {
      id: sessionId.current,
      sessionTime: sessionTime.current,
      portfolioId: portfolioData.id,
      viewerName,
    };

    portfolioData.items.forEach((item, index) => {
      dataToSend[`item${index + 1}Name`] =
        item.case?.name || item.building?.propertyName;
      dataToSend[`item${index + 1}TimeVisible`] = itemTimes.current[index];
    });

    socket.current.emit("track_portfolio_session_data", dataToSend);
  };

  // === Layout ===
  const next = () => {
    if (currentIndex < portfolioData.items.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  useEffect(() => {
    if (!componentRef.current) return;

    const observer = new ResizeObserver(() => {
      const rect = componentRef.current?.getBoundingClientRect();
      if (!rect) return;

      const adjustedHeight =
        window.innerWidth <= 768 ? rect.height * 0.58 : rect.height;

      setDimensions({ width: rect.width, height: adjustedHeight });
    });

    observer.observe(componentRef.current);

    return () => {
      observer.disconnect();
    };
  }, [currentItem]);

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <Head>
        <title>{portfolioData.name}</title>
      </Head>

      <div
        className={`
        fixed z-20 backdrop-blur-md p-2 rounded-xl flex flex-col gap-2 md:flex flex-row fixed shadow-lg z-21 mt-6 left-[50%] translate-x-[-140mm] max-h-[85%] overflow-y-auto top-0
        `}
      >
        {portfolioData.items.map((item, index) => (
          <img
            src={item.case?.mainPhoto || item.building?.mainPhoto || ""}
            key={index}
            onClick={() => handleSelect(index)}
            className={`overflow-hidden flex max-w-[220px] object-cover w-20 h-16 flex-shrink-0 rounded-lg cursor-pointer hover:opacity-90 ${
              index === currentIndex
                ? "!text-primary border-3 border-white outline-white outline"
                : "text-grayScale-400 hover:text-grayScale-500"
            }`}
          />
        ))}
      </div>

      {/* Barra inferior com scroll horizontal apenas no mobile */}
      <div
        className={`
    fixed bottom-0 left-0 w-full bg-white/90 border-t border-2 z-20 p-2 overflow-x-auto
    flex gap-2 md:hidden
  `}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {portfolioData.items.map((item, index) => (
          <img
            key={index}
            src={item.case?.mainPhoto || item.building?.mainPhoto || ""}
            onClick={() => handleSelect(index)}
            className={`rounded-lg object-cover w-20 h-16 flex-shrink-0 cursor-pointer hover:opacity-90 ${
              index === currentIndex
                ? "!outline outline-2 outline-primary border-white border"
                : "opacity-70"
            }`}
          />
        ))}
      </div>

      <div
        {...swipeHandlers}
        className="relative w-full !min-h-full lg:bg-[#525659]"
        style={{ height: `${dimensions.height}px` }}
      >
        {currentItem.case?.type === "financingPlanning" && (
          <FinancingPlanningReportPreview
            custom={{
              backgroundColor:
                portfolioData.user.realEstate?.backgroundColor || "",
              primaryColor: portfolioData.user.realEstate?.primaryColor || "",
              secondaryColor:
                portfolioData.user.realEstate?.secondaryColor || "",
              headerType: portfolioData.user.realEstate?.headerType || 1,
            }}
            propertyData={currentItem.case?.propertyData}
            user={portfolioData.user}
            configData={{
              propertyName: currentItem.case?.propertyName || "",
              mainPhoto: currentItem.case?.mainPhoto || "",
              description: currentItem.case?.description || "",
              additionalPhotos: currentItem.case?.additionalPhotos,
              features: currentItem.case?.features,
              bedrooms: currentItem.case?.bedrooms,
              reportConfig: currentItem.case?.reportConfig,
              address: currentItem.case?.address,
              bathrooms: currentItem.case?.bathrooms,
              builtArea: currentItem.case?.builtArea,
              cod: currentItem.case?.cod,
              landArea: currentItem.case?.landArea,
              parkingSpaces: currentItem.case?.parkingSpaces,
              suites: currentItem.case?.suites,
              subType: currentItem.case?.subType,
              value: currentItem.case?.value,
            }}
            ref={componentRef}
          />
        )}

        {currentItem.case?.type === "directFinancing" && (
          <DirectFinancingReportPreview
            custom={{
              backgroundColor:
                portfolioData.user.realEstate?.backgroundColor || "",
              primaryColor: portfolioData.user.realEstate?.primaryColor || "",
              secondaryColor:
                portfolioData.user.realEstate?.secondaryColor || "",
              headerType: portfolioData.user.realEstate?.headerType || 1,
            }}
            propertyData={currentItem.case?.propertyData}
            user={portfolioData.user}
            configData={{
              propertyName: currentItem.case?.propertyName || "",
              mainPhoto: currentItem.case?.mainPhoto || "",
              description: currentItem.case?.description || "",
              additionalPhotos: currentItem.case?.additionalPhotos,
              features: currentItem.case?.features,
              bedrooms: currentItem.case?.bedrooms,
              reportConfig: currentItem.case?.reportConfig,
              address: currentItem.case?.address,
              bathrooms: currentItem.case?.bathrooms,
              builtArea: currentItem.case?.builtArea,
              cod: currentItem.case?.cod,
              landArea: currentItem.case?.landArea,
              parkingSpaces: currentItem.case?.parkingSpaces,
              suites: currentItem.case?.suites,
              subType: currentItem.case?.subType,
              value: currentItem.case?.value,
            }}
            ref={componentRef}
          />
        )}

        {currentItem.buildingId && (
          <BuildingPreview
            backgroundColor={
              portfolioData.user.realEstate?.backgroundColor || ""
            }
            primaryColor={portfolioData.user.realEstate?.primaryColor || ""}
            secondaryColor={portfolioData.user.realEstate?.secondaryColor}
            headerType={portfolioData.user.realEstate?.headerType || 1}
            configData={{
              propertyName: currentItem.building.propertyName,
              mainPhoto: currentItem.building.mainPhoto,
              description: currentItem.building.description,
              additionalPhotos: currentItem.building.additionalPhotos,
              features: currentItem.building.features,
              address: currentItem.building.address,
              bedrooms: currentItem.building.bedrooms,
              bathrooms: currentItem.building.bathrooms,
              builtArea: currentItem.building.builtArea,
              cod: currentItem.building.cod,
              landArea: currentItem.building.landArea,
              parkingSpaces: currentItem.building.parkingSpaces,
              suites: currentItem.building.suites,
              value: currentItem.building.value,
              buildingId: currentItem.buildingId,
            }}
            user={portfolioData.user}
            ref={componentRef}
          />
        )}
      </div>
      <Dialog
        actions={
          viewerName && (
            <div className="flex justify-center w-full">
              <Button
                onClick={() => {
                  if (viewerName) {
                    localStorage.setItem("viewerName", viewerName);
                    setRequestName(false);
                  }
                }}
              >
                Visualizar Proposta
              </Button>
            </div>
          )
        }
        title="Insira seu nome para continuar"
        closeButton={false}
        open={requestName}
        onClose={() => {
          if (viewerName) {
            localStorage.setItem("viewerName", viewerName);
            setRequestName(false);
          }
        }}
      >
        <div className="w-[300px] lg:w-[500px] p-6">
          <Input
            onChange={(e) => setViewerName(e.target.value)}
            value={viewerName}
          />
        </div>
      </Dialog>
    </>
  );
}
