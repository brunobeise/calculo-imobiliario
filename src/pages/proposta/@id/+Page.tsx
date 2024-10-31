import { useEffect, useRef, useState } from "react";
import { useData } from "vike-react/useData";
import { CaseStudy } from "@/types/caseTypes";
import FinancingPlanningReportPreview from "@/reports/financingPlanningReport/FinancingPlanningReportPreview";
import { calcCaseData } from "@/pages/planejamentofinanciamento/@id/Calculator";
import { Head } from "vike-react/Head";
import { useAuth } from "@/auth";
import { MdSpatialTracking } from "react-icons/md";

function useVisibility(ref: React.RefObject<HTMLElement>) {
  const [timeVisible, setTimeVisible] = useState(0);
  const visibilityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Inicia o contador se a página estiver visível
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
  const proposalData = useData<CaseStudy>();
  const componentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const caseData = calcCaseData(proposalData.propertyData);
  const auth = useAuth();

  const [sessionTime, setSessionTime] = useState(0);
  const sessionTimeRef = useRef(sessionTime);

  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);
  const page4Ref = useRef(null);
  const page5Ref = useRef(null);
  const page6Ref = useRef(null);

  const page1TimeVisible = useVisibility(page1Ref);
  const page2TimeVisible = useVisibility(page2Ref);
  const page3TimeVisible = useVisibility(page3Ref);
  const page4TimeVisible = useVisibility(page4Ref);
  const page5TimeVisible = useVisibility(page5Ref);
  const page6TimeVisible = useVisibility(page6Ref);

  useEffect(() => {
    sessionTimeRef.current = sessionTime;
  }, [sessionTime]);

  useEffect(() => {
    const sessionTimer = setInterval(() => {
      setSessionTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(sessionTimer);
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].contentRect) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    if (componentRef.current) {
      resizeObserver.observe(componentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const currentSessionTime = sessionTimeRef.current;

      const dataToSend = {
        sessionTime: currentSessionTime,
        caseId: proposalData.id,
        page1TimeVisible,
        page2TimeVisible,
        page3TimeVisible,
        page4TimeVisible,
        page5TimeVisible,
        page6TimeVisible,
      };

      event.preventDefault();

      if (!auth.isAuthenticated)
        navigator.sendBeacon(
          import.meta.env.PUBLIC_ENV__API_URL + "/proposal-session",
          JSON.stringify(dataToSend)
        );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    page1TimeVisible,
    page2TimeVisible,
    page3TimeVisible,
    page4TimeVisible,
    page5TimeVisible,
    page6TimeVisible,
  ]);

  return (
    <>
      <Head>
        <title>{proposalData.name}</title>
      </Head>

      <div
        className="relative w-full lg:bg-[#525659]"
        style={{ height: `${dimensions.height}px` }}
      >
        {auth.isAuthenticated && (
          <div className="fixed text-primary ms-10 bg-white p-3 rounded mt-10 w-[270px] text-sm hidden lg:block">
            <h2 className="mb-2 flex items-center gap-2 text-xl">
              {" "}
              {"Tracking"}{" "}
              <MdSpatialTracking className="text-xl mt-1 opacity-100 animate-pulse" />
            </h2>
            <h2 className="mb-2 flex items-center gap-2 text-lg">
              {"Usuário logado detectado"}
            </h2>
            <small>
              *Usuários que não estiverem logados não terão acesso a este
              exemplo.
            </small>{" "}
            <br />
            <small className="">
              *Esta seção é apenas ilustrativa, e nenhum dado de sessão será
              coletado ou enviado.
            </small>
            <p className="mt-2"> Tempo de sessão: {sessionTime} segundos</p>
            <p className="mt-2">
              {" "}
              Página 1 - Visível por: {page1TimeVisible} segundos
            </p>
            <p> Página 2 - Visível por: {page2TimeVisible} segundos</p>
            <p> Página 3 - Visível por: {page3TimeVisible} segundos</p>
            <p> Página 4 - Visível por: {page4TimeVisible} segundos</p>
            <p> Página 5 - Visível por: {page5TimeVisible} segundos</p>
            <p> Página 6 - Visível por: {page6TimeVisible} segundos</p>
          </div>
        )}
        <FinancingPlanningReportPreview
          propertyData={proposalData?.propertyData}
          user={proposalData.user}
          caseData={caseData}
          configData={{
            mainPhoto: proposalData?.mainPhoto || "",
            additionalPhotos: proposalData?.additionalPhotos || [],
            description: proposalData?.description || "",
            features: proposalData?.features || [],
            propertyName: proposalData?.propertyName || "",
            pageViewMap:
              proposalData.pageViewMap.length === 0
                ? [true, true, true, true, true, true, true, true]
                : proposalData.pageViewMap,
          }}
          ref={componentRef}
          page1Ref={page1Ref}
          page2Ref={page2Ref}
          page3Ref={page3Ref}
          page4Ref={page4Ref}
          page5Ref={page5Ref}
          page6Ref={page6Ref}
        />
      </div>
    </>
  );
}
