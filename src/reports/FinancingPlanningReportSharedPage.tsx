import { useEffect, useRef, useState } from "react";
import FinancingPlanningReportPreview from "./financingPlanningReport/FinancingPlanningReportPreview";
import { CaseStudy } from "@/types/caseTypes";
import { useParams } from "react-router-dom";
import { caseService } from "@/service/caseService";
import GlobalLoading from "@/components/Loading";
import { calcCaseData } from "@/pages/financiamento/financingPlanning/Calculator";
import { Helmet } from "react-helmet";

export default function FinancingPlanningReportSharedPage() {
  const componentRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const [actualCase, setActualCase] = useState<CaseStudy>();

  useEffect(() => {
    if (id) {
      caseService.getCaseToProposal(id).then((response) => {
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

  <Helmet>
    <title>Proposta Imobiliária - {actualCase.name}</title>
    <meta
      property="og:title"
      content={`Proposta Imobiliária - ${actualCase.name}`}
    />
    <meta
      property="og:description"
      content="Veja os detalhes da proposta imobiliária e calcule o valor ideal para sua propriedade."
    />
   
    <meta
      property="og:image"
      content={actualCase.mainPhoto}
    />
    <meta property="og:type" content="website" />
  </Helmet>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#525659]">
      <div className="bg-white shadow-lg">
        <FinancingPlanningReportPreview
          propertyData={actualCase?.propertyData}
          user={actualCase.user}
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
