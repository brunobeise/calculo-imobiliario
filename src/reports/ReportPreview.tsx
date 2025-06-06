import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { Proposal, ProposalTypes } from "@/types/proposalTypes";
import ReportMenu from "./reportConfig/ReportMenu";
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

interface ReportPreviewProps {
  propertyData: PropertyData;
  proposal: Proposal;
  onChange: (proposal: Proposal) => void;
}

export default function ReportPreview({
  propertyData,
  proposal,
  onChange,
}: ReportPreviewProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState("property");
  const userData = useSelector((state: RootState) => state.user.userData);
  const realEstateData = useSelector(
    (state: RootState) => state.realEstate.realEstateData
  );

  const handleUpdate = (values: Partial<Proposal>) => {
    onChange({ ...proposal, ...values });
  };

  const handlePaymentConditionsConfig = (payload: PaymentConditionsConfig) => {
    handleUpdate({
      reportConfig: {
        ...proposal.reportConfig,
        PaymentConditionsConfig: payload,
      } as ReportConfig,
    });
  };

  const renderPreview = () =>
    proposal.type === ProposalTypes.ParcelamentoDireto ? (
      <DirectFinancingReportPreview
        custom={{
          backgroundColor: realEstateData?.backgroundColor,
          primaryColor: realEstateData?.primaryColor,
          secondaryColor: realEstateData?.secondaryColor,
          headerType: realEstateData?.headerType || 1,
        }}
        preview
        propertyData={propertyData}
        proposal={proposal}
        ref={componentRef}
        user={userData}
        handlePaymentConditionsConfig={handlePaymentConditionsConfig}
      />
    ) : (
      <FinancingPlanningReportPreview
        custom={{
          backgroundColor: realEstateData?.backgroundColor,
          primaryColor: realEstateData?.primaryColor,
          secondaryColor: realEstateData?.secondaryColor,
          headerType: realEstateData?.headerType || 1,
        }}
        preview
        propertyData={propertyData}
        proposal={proposal}
        ref={componentRef}
        user={userData}
        handlePaymentConditionsConfig={handlePaymentConditionsConfig}
      />
    );

  const renderSection = () => {
    if (activeItem === "property")
      return <PropertySection proposal={proposal} onChange={handleUpdate} />;

    if (activeItem === "config")
      return <ConfigSection proposal={proposal} onChange={handleUpdate} />;

    if (activeItem === "images")
      return <ImagesSection proposal={proposal} onChange={handleUpdate} />;

    if (activeItem === "notes")
      return <NotesSection proposal={proposal} onChange={handleUpdate} />;
  };

  const placeholderRef = useRef<HTMLDivElement>(null);
  const [placeholderWidth, setPlaceholderWidth] = useState(0);

  useEffect(() => {
    if (!placeholderRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === placeholderRef.current) {
          const width = entry.contentRect.width;
          setPlaceholderWidth(width);
        }
      }
    });

    resizeObserver.observe(placeholderRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-[1800px] pe-10 pb-4">
        <div
          aria-hidden="true"
          ref={placeholderRef}
          className="hidden md:block flex-1 ps-[105px]"
        >
          <div ref={placeholderRef} className="w-full bg-green" />
        </div>
        <div className="hidden md:block fixed flex-1 ">
          <ReportMenu activeItem={activeItem} onSelectItem={setActiveItem}>
            <div className="p-4 md:p-8" style={{ width: placeholderWidth }}>
              {renderSection()}
            </div>
          </ReportMenu>
        </div>
        <div>{renderPreview()}</div>
      </div>
    </div>
  );
}
