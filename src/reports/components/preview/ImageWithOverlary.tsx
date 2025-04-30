import React from "react";

interface ImageWithOverlayProps {
  mainPhoto: string;
  subtitle: string;
  overlayHeight?: number;
  className?: string;
}

const ImageWithOverlay: React.FC<ImageWithOverlayProps> = ({
  mainPhoto,
  subtitle,
  overlayHeight = 150,
  className = "",
}) => {
  return (
    <div
      className={`h-[460px] overflow-hidden flex justify-center items-center relative w-full ${className}`}
    >
      <img
        className="w-[210mm] h-[460px] object-cover object-center"
        src={mainPhoto}
        alt="Main Photo"
        decoding="async"
      />
      <div
        className="absolute bottom-0 w-full bg-gradient-to-t from-[#000000f0] to-transparent flex items-end pb-5 px-10 text-lg font-light"
        style={{ height: `${overlayHeight}px` }}
      >
        <p className="whitespace-pre-wrap break-words text-white text-xl !text-white">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default ImageWithOverlay;
