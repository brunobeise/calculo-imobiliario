/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useData } from "vike-react/useData";
import { Proposal } from "@/types/proposalTypes";
import FinancingPlanningReportPreview from "@/reports/financingPlanningReport/FinancingPlanningReportPreview";
import { calcCaseData } from "@/pages/planejamentofinanciamento/@id/Calculator";
import { Head } from "vike-react/Head";
import { useAuth } from "@/auth";
import { nanoid } from "nanoid";
import { io, Socket } from "socket.io-client";

function useVisibility(ref: React.RefObject<HTMLElement>) {
  const [timeVisible, setTimeVisible] = useState(0);
  const visibilityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visibilityTimer.current = setInterval(() => {
            setTimeVisible((prevTime) => prevTime + 1);
          }, 1000);
        } else {
          if (visibilityTimer.current) {
            clearInterval(visibilityTimer.current);
          }
        }
      },
      { threshold: 0.34 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      if (visibilityTimer.current) {
        clearInterval(visibilityTimer.current);
      }
    };
  }, [ref]);

  return timeVisible;
}

export default function FinancingPlanningReportSharedPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const sessionTimeRef = useRef(sessionTime);
  const proposalData = useData<Proposal>();
  const componentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const caseData = calcCaseData(proposalData.propertyData);
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

  // Configura conexão com o WebSocket
  useEffect(() => {
    const newSocket = io(import.meta.env.PUBLIC_ENV__API_URL, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Conectado ao servidor WebSocket com ID:", newSocket.id);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log("Conexão com WebSocket encerrada.");
    };
  }, []);

  useEffect(() => {
    const sessionTimer = setInterval(() => {
      setSessionTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(sessionTimer);
  }, []);

  useEffect(() => {
    sessionTimeRef.current = sessionTime;

    if (sessionTime % 3 === 0) {
      saveSessionData();
    }
  }, [sessionTime]);

  const saveSessionData = () => {
    const currentSessionTime = sessionTimeRef.current;

    const dataToSend = {
      sessionTime: currentSessionTime,
      caseId: proposalData.id,
      id: sessionId,
      page1TimeVisible,
      page2TimeVisible,
      page3TimeVisible,
      page4TimeVisible,
      page5TimeVisible,
      page6TimeVisible,
      page7TimeVisible,
      page8TimeVisible,
    };

    if (socket?.connected && !auth.isAuthenticated) {
      socket.emit("track_session_data", dataToSend);
      console.log("Dados enviados via WebSocket:", dataToSend);
    } else {
      console.warn("Socket não conectado. Dados não enviados.");
    }
  };

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
        <FinancingPlanningReportPreview
          custom={{
            backgroundColor:
              proposalData.user.realEstate?.backgroundColor || "",
            primaryColor: proposalData.user.realEstate?.primaryColor || "",
            secondaryColor: proposalData.user.realEstate?.secondaryColor || "",
            headerType: proposalData.user.realEstate?.headerType || 1,
          }}
          propertyData={proposalData?.propertyData}
          user={proposalData.user}
          caseData={caseData}
          configData={{
            propertyName: proposalData.propertyName || "",
            mainPhoto: proposalData.mainPhoto || "",
            description: proposalData.description || "",
            additionalPhotos: proposalData.additionalPhotos,
            features: proposalData.features,
            pageViewMap:
              proposalData.pageViewMap.length === 0
                ? [true, true, true, true, true, true, true, true]
                : proposalData.pageViewMap,
            address: proposalData.address,
            bathrooms: proposalData.bathrooms,
            builtArea: proposalData.builtArea,
            cod: proposalData.cod,
            landArea: proposalData.landArea,
            parkingSpaces: proposalData.parkingSpaces,
            suites: proposalData.suites,
            subType: proposalData.subType,
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
      </div>
    </>
  );
}
