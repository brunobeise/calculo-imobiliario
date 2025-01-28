import { useRef } from "react";
import DirectFinancingReportPreview from "./DirectFinancingReportPreview";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { Proposal } from "@/types/proposalTypes";
import { Divider } from "@mui/joy";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DirectFinancingData } from "@/pages/parcelamentodireto/@id/CaseData";
import ReportConfig, { ReportData } from "../components/ReportConfig";

interface DirectFinancingReportProps {
  propertyData: PropertyData;
  actualCase: Proposal;
  caseData: DirectFinancingData;
  onClose: () => void;
  onChange: (configData: ReportData) => void;
}

export default function DirectFinancingReport({
  caseData,
  actualCase,
  propertyData,
  onChange,
}: DirectFinancingReportProps) {
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
    buildingId: actualCase.buildingId,
  };

  return (
    <div>
      <Divider />
      <div className="pt-10 px-10 gap-5 flex  justify-center">
        <DirectFinancingReportPreview
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
            <ReportConfig data={configData} setData={(d) => onChange(d)} />
          </div>
        </div>
      </div>
    </div>
  );
}
