import UserSignature from "@/components/user/UserSignature";
import ImageWithOverlay from "./components/preview/ImageWithOverlary";
import PropertyDescription from "./components/preview/PropertyDescription";
import { ReportData } from "./ReportPreview";
import { User } from "@/types/userTypes";
import { ForwardedRef, forwardRef } from "react";
import { usePageContext } from "vike-react/usePageContext";

interface BuildingPreviewProps {
  headerType: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  configData: Partial<ReportData>;
  user?: User;
  preview?: boolean;
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
      preview,
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const pageContext = usePageContext();
    return (
      <div
        ref={ref}
        className={`${
          !preview
            ? "lg:max-w-[210mm] !min-w-[675px] w-full shadow absolute scale-[0.58] xl:scale-100 top-0 left-[50%] xl:left-[50%] translate-x-[-50%]"
            : ""
        }`}
        style={{
          transformOrigin: "top center",
          backgroundColor: backgroundColor,
        }}
      >
        <div className="flex flex-col items-center w-full !m-0 overflow-x-hidden">
          {user && (
            <UserSignature
              type={headerType || 1}
              userData={user}
              title="Imóvel"
              desc={configData.propertyName}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              backgroundColor={backgroundColor}
            />
          )}

          <ImageWithOverlay
            mainPhoto={configData.mainPhoto}
            subtitle={configData.subtitle}
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
          <p
            style={{ color: secondaryColor }}
            className="text-xs my-4 flex items-center justify-center gap-1"
          >
            Feito com <span className="text-red-500">❤️</span> no{" "}
            <strong>ImobDeal</strong>
          </p>
        </div>
        {pageContext.urlPathname.includes("/portfolio/") && (
          <div className="md:hidden h-[140px]" />
        )}
      </div>
    );
  }
);

export default BuildingPreview;
