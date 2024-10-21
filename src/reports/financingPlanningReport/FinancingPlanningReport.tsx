import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FaPrint, FaSave } from "react-icons/fa";
import FinancingPlanningReportConfig, {
  FinancingPlanningReportData,
} from "./FinancingPlanningReportConfig";
import FinancingPlanningReportPreview from "./FinancingPlanningReportPreview";
import FloatingButtonList from "@/components/shared/FloatingButtonList";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { FinancingPlanningData } from "@/pages/financiamento/financingPlanning/CaseData";
import { CaseStudy } from "@/types/caseTypes";
import { caseService } from "@/service/caseService";
import { uploadImage } from "@/lib/imgur";

interface FinancingPlanningReportProps {
  propertyData: PropertyData;
  actualCase: CaseStudy;
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

  const [editLoading, setEditLoading] = useState(false);
  const [configData, setConfigData] = useState<FinancingPlanningReportData>({
    propertyName: actualCase.propertyName || "",
    mainPhoto: actualCase.mainPhoto || "",
    description: actualCase.description || "",
    additionalPhotos: actualCase.additionalPhotos,
    features: actualCase.features,
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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const buttons = [
    {
      icon: <FaArrowRotateLeft />,
      tooltip: "Voltar ao estudo",
      onClick: onClose,
    },
    {
      onClick: () => handlePrint,
      icon: <FaPrint />,
      tooltip: "Gerar PDF",
    },
    {
      onClick: () => handleEditCase(),
      icon: <FaSave />,
      tooltip: "Salvar",
      loading: editLoading,
    },
  ];

  return (
    <div className="flex pt-10 px-10 gap-5">
      <div>
        <FinancingPlanningReportPreview
          propertyData={propertyData}
          caseData={caseData}
          configData={configData}
          ref={componentRef}
        />
      </div>
      <div className="w-full" style={{ position: "relative" }}>
        <div style={{ position: "sticky", top: "10px" }}>
          <FinancingPlanningReportConfig
            data={configData}
            setData={(d) => setConfigData(d)}
          />
        </div>
      </div>
      <FloatingButtonList buttons={buttons} />
    </div>
  );
}
