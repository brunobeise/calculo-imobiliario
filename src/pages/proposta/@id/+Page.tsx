import { useRef } from "react";

import { useData } from "vike-react/useData";
import { CaseStudy } from "@/types/caseTypes";
import FinancingPlanningReportPreview from "@/reports/financingPlanningReport/FinancingPlanningReportPreview";
import { calcCaseData } from "@/pages/planejamentofinanciamento/@id/Calculator";
import { Head } from "vike-react/Head";

export default function FinancingPlanningReportSharedPage() {
  const proposalData = useData<CaseStudy>();

  const componentRef = useRef<HTMLDivElement>(null);

  const caseData = calcCaseData(proposalData.propertyData);

  return (
    <>
      <Head>
        {/* Image shown when sharing on social sites (Twitter, WhatsApp, ...) */}
        <title>{proposalData.name}</title>
      </Head>
      <div className="flex justify-center items-center justify-center w-full min-h-screen bg-[#525659]">
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
          }}
          ref={componentRef}
        />
      </div>
    </>
  );
}

export { documentProps };

function documentProps({
  documentProps,
}: {
  documentProps: { title: string; description: string };
}) {
  return documentProps;
}
