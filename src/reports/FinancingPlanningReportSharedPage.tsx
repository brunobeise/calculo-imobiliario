import { useEffect, useRef, useState } from "react";
import FinancingPlanningReportPreview from "./financingPlanningReport/FinancingPlanningReportPreview";
import { CaseStudy } from "@/types/caseTypes";
import { useParams } from "react-router-dom";
import { caseService } from "@/service/caseService";
import GlobalLoading from "@/components/Loading";
import { calcCaseData } from "@/pages/financiamento/financingPlanning/Calculator";

export default function FinancingPlanningReportSharedPage() {
  const componentRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const [actualCase, setActualCase] = useState<CaseStudy>();

  useEffect(() => {
    if (id) {
      caseService.getCaseById(id).then((response) => {
        if (response) {
          setActualCase(response);
          localStorage.setItem(
            "financingPlanningPropertyData",
            JSON.stringify(response.propertyData)
          );
        }
      });
    }
  }, [id]);

  if (!actualCase) return <GlobalLoading text="Carregando relatório..." />;

  const caseData = calcCaseData(actualCase.propertyData);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#525659]">
      <div className="bg-white shadow-lg">
        <FinancingPlanningReportPreview
          propertyData={actualCase?.propertyData}
          caseData={caseData}
          configData={{
            mainPhoto: actualCase?.mainPhoto || "",
            additionalPhotos: actualCase?.additionalPhotos || [],
            description: actualCase?.description || "",
            features: actualCase?.features || [],
            propertyName: actualCase?.propertyName || "",
          }}
          ref={componentRef}
        />
      </div>
    </div>
  );
}
