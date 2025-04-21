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
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { TiThMenu } from "react-icons/ti";
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
  const [isOpenMobile, setIsOpenMobile] = useState(false);
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

  // === Tracking ===
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
    const updateSize = () => {
      if (componentRef.current) {
        const rect = componentRef.current.getBoundingClientRect();
        const adjustedHeight =
          window.innerWidth <= 768 ? rect.height * 0.58 : rect.height;
        setDimensions({ width: rect.width, height: adjustedHeight });
      }
    };

    const timeout = setTimeout(updateSize, 100);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const toggleMobileBar = () => setIsOpenMobile((prev) => !prev);
  const handleSelect = (index: number) => {
    setCurrentIndex(index);
    if (window.innerWidth <= 768) setIsOpenMobile(false);
  };

  return (
    <>
      <Head>
        <title>{portfolioData.name}</title>
      </Head>

      <div className="fixed top-1/2 left-[50%] translate-x-[-50%] z-10 w-[100mm] -translate-y-1/2 lg:hidden flex justify-between">
        <div>
          {currentIndex !== 0 ? (
            <button
              onClick={prev}
              className="bg-white p-1 lg:p-2 rounded-full shadow hover:scale-105 transition border border-border"
            >
              <IoChevronBack />
            </button>
          ) : (
            <div />
          )}
        </div>

        <div>
          {currentIndex !== portfolioData.items.length - 1 ? (
            <button
              onClick={next}
              className="bg-white  p-1 lg:p-2 rounded-full shadow hover:scale-105 transition border border-border"
            >
              <IoChevronForward />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>

      <div className="fixed top-8 left-2 z-30 lg:hidden">
        <button
          onClick={toggleMobileBar}
          className="bg-whitefull px-3 py-2 rounded-lg shadow text-sm flex items-center gap-1"
        >
          {isOpenMobile ? <TiThMenu /> : <TiThMenu />}
        </button>
      </div>

      <div
        className={`
        fixed z-20 backdrop-blur-md p-2 rounded-xl flex flex-col gap-2 md:flex
        ${
          isOpenMobile
            ? "flex-row fixed shadow-lg z-21 mt-6 left-2 max-h-[85%] overflow-y-auto top-[50%] translate-y-[-50%]"
            : "flex-row fixed shadow-lg z-21 mt-6 left-[50%] translate-x-[-140mm] max-h-[85%] overflow-y-auto top-0"
        }
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

      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur z-10 md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

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
            user={currentItem.case?.user}
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
            user={currentItem.case?.user}
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
