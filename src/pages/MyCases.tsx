import GlobalLoading from "@/components/Loading";
import CaseCard from "@/components/shared/CaseCard";
import { CaseStudy, caseService } from "@/service/caseService";
import { Divider } from "@mui/joy";
import { useEffect, useState } from "react";

export const CaseStudyTypeMap = {
  financingPlanning: "Planejamento de Financiamento",
};

export default function MyCases() {
  const [cases, setCases] = useState<CaseStudy[]>();

  useEffect(() => {
    caseService.getAllCases().then((result) => {
      setCases(result);
    });
  }, []);

  const casesByType =
    cases?.reduce((acc, caseStudy) => {
      const type = caseStudy.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(caseStudy);
      return acc;
    }, {} as Record<string, CaseStudy[]>) || {};

  return (
    <div className="px-12 mt-4">
      {!cases ? (
        <GlobalLoading />
      ) : (
        Object.keys(casesByType).map((type) => (
          <div key={type} className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {CaseStudyTypeMap[type as keyof typeof CaseStudyTypeMap] || type}
            </h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {casesByType[type].map((caseStudy) => (
                <CaseCard key={caseStudy.name} caseStudy={caseStudy} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
