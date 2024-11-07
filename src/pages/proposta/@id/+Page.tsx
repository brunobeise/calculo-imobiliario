/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useData } from "vike-react/useData";
import { CaseStudy } from "@/types/caseTypes";
import FinancingPlanningReportPreview from "@/reports/financingPlanningReport/FinancingPlanningReportPreview";
import { calcCaseData } from "@/pages/planejamentofinanciamento/@id/Calculator";
import { Head } from "vike-react/Head";
import { useAuth } from "@/auth";
import { nanoid } from "nanoid";

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
  const proposalData = useData<CaseStudy>();
  const componentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const caseData = calcCaseData(proposalData.propertyData);
  const auth = useAuth();
  const [sessionId] = useState(nanoid(7));

  const [sessionTime, setSessionTime] = useState(0);
  const sessionTimeRef = useRef(sessionTime);

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

  useEffect(() => {
    sessionTimeRef.current = sessionTime;
    if (sessionTime % 3 === 0) {
      saveSessionData();
    }
  }, [sessionTime]);

  useEffect(() => {
    const sessionTimer = setInterval(() => {
      setSessionTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(sessionTimer);
  }, []);

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

    if (!auth.isAuthenticated)
      navigator.sendBeacon(
        import.meta.env.PUBLIC_ENV__API_URL + "/proposal-session",
        JSON.stringify(dataToSend)
      );
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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      saveSessionData();
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
    page7TimeVisible,
    page8TimeVisible,

    saveSessionData,
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
          page7Ref={page7Ref}
          page8Ref={page8Ref}
        />
      </div>
    </>
  );
}
