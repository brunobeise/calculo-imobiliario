import UserSignature from "@/components/user/UserSignature";
import ImageWithOverlay from "./components/preview/ImageWithOverlary";
import PropertyDescription from "./components/preview/PropertyDescription";
import { User } from "@/types/userTypes";
import { ForwardedRef, forwardRef } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { Proposal } from "@/types/proposalTypes";
import { FaRegHeart } from "react-icons/fa";

interface BuildingPreviewProps {
  headerType: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  proposal: Partial<Proposal>;
  user?: User;
  preview?: boolean;
  title?: string;
}

const BuildingPreview = forwardRef<HTMLDivElement, BuildingPreviewProps>(
  (
    {
      proposal,
      backgroundColor,
      headerType,
      primaryColor,
      secondaryColor,
      user,
      preview,
      title,
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
              title={title || "Imóvel"}
              desc={proposal.propertyName}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              backgroundColor={backgroundColor}
            />
          )}

          <ImageWithOverlay
            mainPhoto={proposal.mainPhoto}
            subtitle={proposal.subtitle}
            overlayHeight={200}
            className="h-[460px]"
          />
          <PropertyDescription
            value={proposal.value}
            photoViewer={true}
            color={primaryColor}
            secondary={secondaryColor}
            proposal={proposal}
          />
          <p
            style={{ color: secondaryColor }}
            className="text-[0.7rem] opacity-70 my-4 flex items-center justify-center gap-1"
          >
            Feito com <FaRegHeart className="text-[0.8rem]" /> no{" "}
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
