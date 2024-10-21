import GlobalLoading from "@/components/Loading";
import CaseCard from "@/components/shared/CaseCard";
import { caseService } from "@/service/caseService";
import { CaseStudy } from "@/types/caseTypes";
import { Divider } from "@mui/joy";
import { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";

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
    <div className="px-12 ms-6">
      {!cases ? (
        <GlobalLoading />
      ) : (
        <>
          <div className="w-full flex justify-center items-center text-primary gap-2  text-2xl mt-[-20px]">
            <FaBook className="text-xl" />
            <h2 className="font-bold">Meus estudos</h2>
          </div>

          {Object.keys(casesByType).map((type) => (
            <div key={type} className="mb-8">
              <h2 className="text-xl font-bold mb-4">
                {CaseStudyTypeMap[type as keyof typeof CaseStudyTypeMap] ||
                  type}
              </h2>
              <Divider />
              <div className="flex flex-wrap gap-6 mt-4">
                {casesByType[type].map((caseStudy) => (
                  <CaseCard key={caseStudy.name} caseStudy={caseStudy} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
