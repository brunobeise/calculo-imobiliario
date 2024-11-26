import { useRef } from "react";
import FinancingPlanningReportConfig, {
  FinancingPlanningReportData,
} from "./FinancingPlanningReportConfig";
import FinancingPlanningReportPreview from "./FinancingPlanningReportPreview";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { FinancingPlanningData } from "@/pages/planejamentofinanciamento/@id/CaseData";
import { Proposal } from "@/types/proposalTypes";
import { Divider } from "@mui/joy";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface FinancingPlanningReportProps {
  propertyData: PropertyData;
  actualCase: Proposal;
  caseData: FinancingPlanningData;
  onClose: () => void;
  onChange: (configData: FinancingPlanningReportData) => void;
}

export default function FinancingPlanningReport({
  caseData,
  actualCase,
  propertyData,
  onChange,
}: FinancingPlanningReportProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const userData = useSelector((state: RootState) => state.user.userData);
  const realEstateData = useSelector(
    (state: RootState) => state.realEstate.realEstateData
  );

  const configData = {
    propertyName: actualCase.propertyName || "",
    mainPhoto: actualCase.mainPhoto || "",
    description: actualCase.description || "",
    additionalPhotos: actualCase.additionalPhotos,
    features: actualCase.features,
    pageViewMap:
      actualCase.pageViewMap.length === 0 ||
      actualCase.subType === "Simplificado"
        ? [true, true, true, true, true, true, true, true]
        : actualCase.pageViewMap,
    address: actualCase.address,
    bathrooms: actualCase.bathrooms,
    builtArea: actualCase.builtArea,
    cod: actualCase.cod,
    landArea: actualCase.landArea,
    parkingSpaces: actualCase.parkingSpaces,
    suites: actualCase.suites,
    subType: actualCase.subType,
  };

  return (
    <div>
      <Divider />
      <div className="pt-10 px-10 gap-5 flex  justify-center">
        <FinancingPlanningReportPreview
          custom={{
            backgroundColor: realEstateData?.backgroundColor || "",
            primaryColor: realEstateData?.primaryColor || "",
            secondaryColor: realEstateData?.secondaryColor || "",
            headerType: realEstateData?.headerType || 1,
          }}
          preview
          propertyData={propertyData}
          caseData={caseData}
          configData={configData}
          ref={componentRef}
          user={userData}
        />
        <div>
          <div style={{ position: "sticky", top: "10px" }}>
            <FinancingPlanningReportConfig
              data={configData}
              setData={(d) => onChange(d)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
