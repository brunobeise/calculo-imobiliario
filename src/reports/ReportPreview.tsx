import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { Proposal } from "@/types/proposalTypes";
import ReportMenu from "./reportConfig/ReportMenu";
import SessionsDrawer from "@/components/session/SessionsDrawer";
import FinancingPlanningReportPreview from "./FinancingPlanningReportPreview";
import DirectFinancingReportPreview from "./DirectFinancingReportPreview";
import {
  PaymentConditionsConfig,
  ReportConfig,
} from "@/types/reportConfigTypes";
import PropertySection from "./reportConfig/PropertySection";
import ConfigSection from "./reportConfig/ConfigSection";
import ImagesSection from "./reportConfig/ImagesSection";
import NotesSection from "./reportConfig/NotesSection";

export interface ReportData {
  mainPhoto: string;
  description: string;
  subtitle: string;
  propertyName: string;
  propertyNameFont: string;
  additionalPhotos: string[];
  features: string[];
  suites?: string;
  bathrooms?: string;
  bedrooms?: string;
  parkingSpaces?: string;
  builtArea?: string;
  landArea?: string;
  address?: string;
  cod?: string;
  subType: string;
  buildingId?: string;
  value?: number;
  reportConfig: ReportConfig;
}

interface ReportPreviewProps {
  propertyData: PropertyData;
  proposal: Proposal;
  onClose: () => void;
  onChange: (configData: ReportData) => void;
  context: "financingPlanning" | "directFinancing";
}

export default function ReportPreview({
  propertyData,
  proposal,
  context,
  onChange,
}: ReportPreviewProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const userData = useSelector((state: RootState) => state.user.userData);
  const realEstateData = useSelector(
    (state: RootState) => state.realEstate.realEstateData
  );

  const configData: ReportData = {
    mainPhoto: proposal.mainPhoto || "",
    description: proposal.description || "",
    subtitle: proposal.subtitle || "",
    propertyName: proposal.propertyName || "",
    propertyNameFont: proposal.propertyNameFont,
    additionalPhotos: proposal.additionalPhotos || [],
    features: proposal.features || [],
    suites: proposal.suites || "",
    bathrooms: proposal.bathrooms || "",
    bedrooms: proposal.bedrooms || "",
    parkingSpaces: proposal.parkingSpaces || "",
    builtArea: proposal.builtArea || "",
    landArea: proposal.landArea || "",
    address: proposal.address || "",
    cod: proposal.cod || "",
    subType: proposal.subType || "Simplificado",
    buildingId: proposal.buildingId,
    value: proposal.value,
    reportConfig: proposal.reportConfig,
  };

  const [activeItem, setActiveItem] = useState("property");

  const handlePaymentConditionsConfig = (payload: PaymentConditionsConfig) => {
    onChange({
      ...configData,
      reportConfig: {
        ...configData.reportConfig,
        PaymentConditionsConfig: payload,
      },
    });
  };

  const renderPreview = () =>
    context === "directFinancing" ? (
      <DirectFinancingReportPreview
        custom={{
          backgroundColor: realEstateData?.backgroundColor || "",
          primaryColor: realEstateData?.primaryColor || "",
          secondaryColor: realEstateData?.secondaryColor || "",
          headerType: realEstateData?.headerType || 1,
        }}
        preview
        propertyData={propertyData}
        configData={configData}
        ref={componentRef}
        user={userData}
        handlePaymentConditionsConfig={handlePaymentConditionsConfig}
      />
    ) : (
      <FinancingPlanningReportPreview
        custom={{
          backgroundColor: realEstateData?.backgroundColor || "",
          primaryColor: realEstateData?.primaryColor || "",
          secondaryColor: realEstateData?.secondaryColor || "",
          headerType: realEstateData?.headerType || 1,
        }}
        preview
        propertyData={propertyData}
        configData={configData}
        ref={componentRef}
        user={userData}
        handlePaymentConditionsConfig={handlePaymentConditionsConfig}
      />
    );

  const renderSection = () => {
    if (activeItem === "property")
      return <PropertySection configData={configData} onChange={onChange} />;

    if (activeItem === "config")
      return <ConfigSection configData={configData} onChange={onChange} />;

    if (activeItem === "images")
      return <ImagesSection configData={configData} onChange={onChange} />;

    if (activeItem === "notes")
      return <NotesSection configData={configData} onChange={onChange} />;
  };

  return (
    <div className="h-screen pb-10 overflow-auto">
      <div className="flex gap-5 w-full relative justify-between pr-8 xl:pr-0">
        <ReportMenu activeItem={activeItem} onSelectItem={setActiveItem}>
          {renderSection()}
        </ReportMenu>
        <div className="mt-5 pr-4">{renderPreview()}</div>
        <div className="hidden xl:block w-[420px] uw:w-[520px]" />
        <SessionsDrawer caseId={proposal.id} />
      </div>
    </div>
  );
}
