import UserSignature from "@/components/user/UserSignature";
import ImageWithOverlay from "./components/preview/ImageWithOverlary";
import PropertyDescription from "./components/preview/PropertyDescription";
import { ReportData } from "./ReportPreview";
import { User } from "@/types/userTypes";
import { ForwardedRef, forwardRef } from "react";

interface BuildingPreviewProps {
  headerType: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  configData: Partial<ReportData>;
  user: User;
}

const BuildingPreview = forwardRef<HTMLDivElement, BuildingPreviewProps>(
  (
    {
      configData,
      backgroundColor,
      headerType,
      primaryColor,
      secondaryColor,
      user,
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={`lg:max-w-[210mm] !min-w-[675px] w-full shadow absolute scale-[0.58] xl:scale-100 top-0 left-[50%] xl:left-[50%] translate-x-[-50%]`}
        style={{
          transformOrigin: "top center",
          backgroundColor: backgroundColor,
        }}
      >
        <div className="flex flex-col items-center w-full !m-0 overflow-x-hidden">
          <UserSignature
            type={headerType || 1}
            userData={user}
            desc={configData.propertyName}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            backgroundColor={backgroundColor}
          />
          <ImageWithOverlay
            mainPhoto={configData.mainPhoto}
            description={configData.description}
            overlayHeight={200}
            className="h-[460px]"
          />
          <PropertyDescription
            value={configData.value}
            photoViewer={true}
            color={primaryColor}
            secondary={secondaryColor}
            configData={configData}
          />
        </div>
      </div>
    );
  }
);

export default BuildingPreview;
