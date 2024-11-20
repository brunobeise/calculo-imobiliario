import { useRef, useState } from "react";
import { FaExternalLinkAlt, FaSave } from "react-icons/fa";
import FinancingPlanningReportConfig, {
  FinancingPlanningReportData,
} from "./FinancingPlanningReportConfig";
import FinancingPlanningReportPreview from "./FinancingPlanningReportPreview";
import FloatingButtonList from "@/components/shared/FloatingButtonList";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { FinancingPlanningData } from "@/pages/planejamentofinanciamento/@id/CaseData";
import { Proposal } from "@/types/proposalTypes";
import { caseService } from "@/service/caseService";
import { uploadImage } from "@/lib/imgur";
import { Divider } from "@mui/joy";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface FinancingPlanningReportProps {
  propertyData: PropertyData;
  actualCase: Proposal;
  caseData: FinancingPlanningData;
  onClose: () => void;
}

export default function FinancingPlanningReport({
  caseData,
  actualCase,
  propertyData,
  onClose,
}: FinancingPlanningReportProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const userData = useSelector((state: RootState) => state.user.userData);
  const realEstateData = useSelector(
    (state: RootState) => state.realEstate.realEstateData
  );

  const [editLoading, setEditLoading] = useState(false);
  const [configData, setConfigData] = useState<FinancingPlanningReportData>({
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
  });

  const handleEditCase = async () => {
    setEditLoading(true);

    let uploadMainPhoto = configData.mainPhoto;

    if (
      configData.mainPhoto &&
      !configData.mainPhoto.includes("res.cloudinary.com")
    ) {
      uploadMainPhoto = await uploadImage(configData.mainPhoto);
    }

    const uploadAdditionalPhotos = await Promise.all(
      configData.additionalPhotos.map(async (photo) => {
        if (photo && !photo.includes("res.cloudinary.com")) {
          const uploadedPhoto = await uploadImage(photo);
          return uploadedPhoto;
        }
        return photo;
      })
    );

    caseService
      .updateCase(actualCase.id, {
        ...configData,
        mainPhoto: uploadMainPhoto,
        additionalPhotos: uploadAdditionalPhotos,
      })
      .finally(() => {
        setEditLoading(false);
      });
  };

  const buttons = [
    {
      icon: <FaExternalLinkAlt className="!text-[1.1rem]" />,
      tooltip: "Acessar link compartilhado",
      onClick: onClose,
      href: "/proposta/" + actualCase.id,
    },

    {
      onClick: () => handleEditCase(),
      icon: <FaSave />,
      tooltip: "Salvar",
      loading: editLoading,
    },
  ];

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
              setData={(d) => setConfigData(d)}
            />
          </div>
        </div>
        <FloatingButtonList buttons={buttons} />
      </div>
    </div>
  );
}
