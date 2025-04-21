/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { useData } from "vike-react/useData";
import { Proposal } from "@/types/proposalTypes";
import FinancingPlanningReportPreview from "@/reports/FinancingPlanningReportPreview";
import { Head } from "vike-react/Head";
import { useAuth } from "@/auth";
import { nanoid } from "nanoid";
import { io, Socket } from "socket.io-client";
import DirectFinancingReportPreview from "@/reports/DirectFinancingReportPreview";
import Clarity from "@microsoft/clarity";
import Dialog from "@/components/modals/Dialog";
import { Button, Input } from "@mui/joy";
import { usePageContext } from "vike-react/usePageContext";

function useVisibility(ref: React.RefObject<HTMLElement>) {
  const timeVisibleRef = useRef(0);
  const visibilityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!visibilityTimer.current) {
            visibilityTimer.current = setInterval(() => {
              timeVisibleRef.current += 1;
            }, 1000);
          }
        } else {
          if (visibilityTimer.current) {
            clearInterval(visibilityTimer.current);
            visibilityTimer.current = null;
          }
        }
      },
      { threshold: 0.34 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      if (visibilityTimer.current) clearInterval(visibilityTimer.current);
    };
  }, [ref]);

  return timeVisibleRef;
}

export default function FinancingPlanningReportSharedPage() {
  const socket = useRef<Socket | null>(null);
  const sessionTimeRef = useRef(0);
  const proposalData = useData<Proposal>();
  const componentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const pageContext = usePageContext();
  const queryWhatsapp = pageContext.urlParsed.search.whatsapp;

  const auth = useAuth();

  const [sessionId] = useState(nanoid(7));
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);
  const page4Ref = useRef(null);
  const page5Ref = useRef(null);
  const page6Ref = useRef(null);
  const page7Ref = useRef(null);
  const page8Ref = useRef(null);

  const page1TimeVisible = useVisibility(page1Ref);
  const page2TimeVisible = useVisibility(page2Ref);
  const page3TimeVisible = useVisibility(page3Ref);
  const page4TimeVisible = useVisibility(page4Ref);
  const page5TimeVisible = useVisibility(page5Ref);
  const page6TimeVisible = useVisibility(page6Ref);
  const page7TimeVisible = useVisibility(page7Ref);
  const page8TimeVisible = useVisibility(page8Ref);

  const [requestName, setRequestName] = useState(
    !proposalData.reportConfig.requestName
      ? false
      : localStorage.getItem("viewerName")
      ? false
      : true
  );
  const [viewerName, setViewerName] = useState(
    localStorage.getItem("viewerName")
  );

  useEffect(() => {
    const newSocket = io(import.meta.env.PUBLIC_ENV__API_URL, {
      transports: ["websocket"],
      query: {
        whatsapp: queryWhatsapp,
      },
    });

    newSocket.on("connect", () => {
      console.log("Conectado ao servidor WebSocket com ID:", newSocket.id);
    });

    socket.current = newSocket;
    if (!auth.isAuthenticated)
      Clarity.init(import.meta.env.PUBLIC_ENV__CLARITY_TAG);

    return () => {
      newSocket.disconnect();
      console.log("Conexão com WebSocket encerrada.");
    };
  }, []);

  useEffect(() => {
    if (requestName && !viewerName) return;

    const sessionTimer = setInterval(() => {
      sessionTimeRef.current += 1;

      if (sessionTimeRef.current % 3 === 0) {
        saveSessionData();
      }
    }, 1000);

    return () => clearInterval(sessionTimer);
  }, [requestName, viewerName]);

  const saveSessionData = useCallback(() => {
    if (
      !socket?.current.connected ||
      auth.isAuthenticated ||
      (requestName && !viewerName)
    ) {
      console.warn("Socket não conectado. Dados não enviados.");
      return;
    }

    const currentSessionTime = sessionTimeRef.current;
    const dataToSend = {
      sessionTime: currentSessionTime,
      caseId: proposalData.id,
      id: sessionId,
      viewerName: viewerName || localStorage.getItem("viewerName"),
      page1TimeVisible: page1TimeVisible.current,
      page2TimeVisible: page2TimeVisible.current,
      page3TimeVisible: page3TimeVisible.current,
      page4TimeVisible: page4TimeVisible.current,
      page5TimeVisible: page5TimeVisible.current,
      page6TimeVisible: page6TimeVisible.current,
      page7TimeVisible: page7TimeVisible.current,
      page8TimeVisible: page8TimeVisible.current,
    };

    socket.current.emit("track_session_data", dataToSend);
    console.log("Dados enviados via WebSocket:", dataToSend);
  }, [
    auth,
    socket,
    sessionId,
    proposalData.id,
    viewerName,
    page1TimeVisible,
    page2TimeVisible,
    page3TimeVisible,
    page4TimeVisible,
    page5TimeVisible,
    page6TimeVisible,
    page7TimeVisible,
    page8TimeVisible,
  ]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].contentRect) {
        const { width, height } = entries[0].contentRect;
        const adjustedHeight =
          window.innerWidth <= 768 ? height * 0.58 : height;
        setDimensions({ width, height: adjustedHeight });
      }
    });

    if (componentRef.current) {
      resizeObserver.observe(componentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>{proposalData.name}</title>
      </Head>

      <div
        className="relative w-full lg:bg-[#525659]"
        style={{ height: `${dimensions.height}px` }}
      >
        {proposalData.type === "financingPlanning" && (
          <FinancingPlanningReportPreview
            custom={{
              backgroundColor:
                proposalData.user.realEstate?.backgroundColor || "",
              primaryColor: proposalData.user.realEstate?.primaryColor || "",
              secondaryColor:
                proposalData.user.realEstate?.secondaryColor || "",
              headerType: proposalData.user.realEstate?.headerType || 1,
            }}
            propertyData={proposalData?.propertyData}
            user={proposalData.user}
            configData={{
              propertyName: proposalData.propertyName || "",
              mainPhoto: proposalData.mainPhoto || "",
              description: proposalData.description || "",
              additionalPhotos: proposalData.additionalPhotos,
              features: proposalData.features,
              address: proposalData.address,
              bedrooms: proposalData.bedrooms,
              bathrooms: proposalData.bathrooms,
              builtArea: proposalData.builtArea,
              cod: proposalData.cod,
              landArea: proposalData.landArea,
              parkingSpaces: proposalData.parkingSpaces,
              suites: proposalData.suites,
              subType: proposalData.subType,
              reportConfig: proposalData.reportConfig,
              value: proposalData.value,
            }}
            ref={componentRef}
            page1Ref={page1Ref}
            page2Ref={page2Ref}
            page3Ref={page3Ref}
            page4Ref={page4Ref}
            page5Ref={page5Ref}
            page6Ref={page6Ref}
            page7Ref={page7Ref}
            page8Ref={page8Ref}
          />
        )}

        {proposalData.type === "directFinancing" && (
          <DirectFinancingReportPreview
            custom={{
              backgroundColor:
                proposalData.user.realEstate?.backgroundColor || "",
              primaryColor: proposalData.user.realEstate?.primaryColor || "",
              secondaryColor:
                proposalData.user.realEstate?.secondaryColor || "",
              headerType: proposalData.user.realEstate?.headerType || 1,
            }}
            propertyData={proposalData?.propertyData}
            user={proposalData.user}
            configData={{
              propertyName: proposalData.propertyName || "",
              mainPhoto: proposalData.mainPhoto || "",
              description: proposalData.description || "",
              additionalPhotos: proposalData.additionalPhotos,
              features: proposalData.features,
              bedrooms: proposalData.bedrooms,
              reportConfig: proposalData.reportConfig,
              address: proposalData.address,
              bathrooms: proposalData.bathrooms,
              builtArea: proposalData.builtArea,
              cod: proposalData.cod,
              landArea: proposalData.landArea,
              parkingSpaces: proposalData.parkingSpaces,
              suites: proposalData.suites,
              subType: proposalData.subType,
              value: proposalData.value,
            }}
            ref={componentRef}
            page1Ref={page1Ref}
            page2Ref={page2Ref}
            page3Ref={page3Ref}
            page4Ref={page4Ref}
            page5Ref={page5Ref}
            page6Ref={page6Ref}
            page7Ref={page7Ref}
            page8Ref={page8Ref}
          />
        )}

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
      </div>
    </>
  );
}
