/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
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
  const [showHeaderOnScroll, setShowHeaderOnScroll] = useState(false);

  const currentItem = portfolioData.items[currentIndex];
  const currentTitle = portfolioData.useCustomNames
    ? portfolioData.itemNames[currentIndex]
    : undefined;
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
      const customNamesEnabled = portfolioData.useCustomNames;
      const nameToSend = customNamesEnabled
        ? portfolioData.itemNames?.[index] ??
          (item.case?.name || item.building?.propertyName)
        : item.case?.name || item.building?.propertyName;

      dataToSend[`item${index + 1}Name`] = nameToSend;
      dataToSend[`item${index + 1}TimeVisible`] = itemTimes.current[index];
    });

    socket.current.emit("track_portfolio_session_data", dataToSend);
  };

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

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const scrollTop = target.scrollTop;
      if (scrollTop > 100) setShowHeaderOnScroll(true);
      else setShowHeaderOnScroll(false);
    };

    document.body.addEventListener("scroll", handleScroll);
    document.documentElement.addEventListener("scroll", handleScroll);

    return () => {
      document.body.removeEventListener("scroll", handleScroll);
      document.documentElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <Head>
        <title>{portfolioData.name}</title>
      </Head>

      {portfolioData.items.length > 1 && (
        <div
          className={`
        fixed z-20 backdrop-blur-md p-2 rounded-xl flex flex-col gap-2 md:flex flex-row fixed shadow-lg z-21 mt-6 left-[50%] translate-x-[-140mm] max-h-[85%] overflow-y-auto top-0
        `}
        >
          {portfolioData.items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={`relative cursor-pointer rounded-lg overflow-hidden max-w-[220px] flex-shrink-0 ${
                index === currentIndex
                  ? "border-3 border-white outline-white outline"
                  : ""
              }`}
            >
              <img
                src={item.case?.mainPhoto || item.building?.mainPhoto || ""}
                alt={item.case?.propertyName || item.building?.propertyName}
                className="w-20 h-16 object-cover"
                decoding="async"
              />
              {portfolioData.useThumbnailNames && (
                <div className={`absolute bottom-0 w-full px-1 py-1 text-center ${portfolioData.useThumbnailNames ? " bg-black/70 h-full flex items-center justify-center" : ""}`}>
                  <p className="text-white text-[0.6rem] select-none">
                    {portfolioData.useCustomNames
                      ? portfolioData.itemNames[index]
                      : item.case?.propertyName || item.building?.propertyName}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {portfolioData.items.length > 1 && (
        <div
          className={`
    fixed bottom-0 left-0 w-full bg-white z-20 p-2 overflow-x-auto
    flex gap-2 md:hidden justify-evenly
  `}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {portfolioData.items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={`relative cursor-pointer rounded-lg overflow-hidden max-w-[220px] flex-shrink-0 ${
                index === currentIndex
                  ? "border-3 border-white outline-white outline"
                  : ""
              }`}
            >
              <img
                key={index}
                src={item.case?.mainPhoto || item.building?.mainPhoto || ""}
                onClick={() => handleSelect(index)}
                className={`rounded-lg object-cover w-20 h-16 flex-shrink-0 cursor-pointer hover:opacity-90 ${
                  index === currentIndex
                    ? "!outline outline-b outline-1 outline-primary border-white border"
                    : "opacity-50"
                }`}
              />
              {portfolioData.useThumbnailNames && (
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/100 to-transparent px-1 py-1">
                  <p className="text-white text-[0.66rem] select-none text-center">
                    {portfolioData.useCustomNames
                      ? portfolioData.itemNames[index]
                      : item.case?.propertyName || item.building?.propertyName}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        className="relative w-full !min-h-full lg:bg-[#525659]"
        style={{ height: `${dimensions.height}px` }}
      >
        {portfolioData.useShowNamePage && showHeaderOnScroll && (
          <div
            className="
          max-w-[210mm] translate-x-[-50%] fixed top-0 left-[50%] w-full z-[30] pointer-events-none
          bg-gradient-to-b from-black/85 to-transparent
          p-2.5 !text-white text-lg select-none text-center h-[100px]
        "
          >
            {portfolioData.useCustomNames
              ? portfolioData.itemNames[currentIndex]
              : currentItem.case?.propertyName ||
                currentItem.building?.propertyName}
          </div>
        )}

        {currentItem.case?.type === "financingPlanning" && (
          <FinancingPlanningReportPreview
            title={currentTitle}
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
            proposal={currentItem.case}
            ref={componentRef}
          />
        )}

        {currentItem.case?.type === "directFinancing" && (
          <DirectFinancingReportPreview
            title={currentTitle}
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
            proposal={currentItem.case}
            ref={componentRef}
          />
        )}

        {currentItem.buildingId && (
          <BuildingPreview
            backgroundColor={
              portfolioData.user.realEstate?.backgroundColor || ""
            }
            title={currentTitle}
            primaryColor={portfolioData.user.realEstate?.primaryColor || ""}
            secondaryColor={portfolioData.user.realEstate?.secondaryColor}
            headerType={portfolioData.user.realEstate?.headerType || 1}
            proposal={{
              propertyName: currentItem.building.propertyName,
              propertyNameFont: currentItem.building.propertyNameFont,
              mainPhoto: currentItem.building.mainPhoto,
              description: currentItem.building.description,
              subtitle: currentItem.building.subtitle,
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
