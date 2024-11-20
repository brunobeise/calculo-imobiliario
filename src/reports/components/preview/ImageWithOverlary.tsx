import React from "react";

interface ImageWithOverlayProps {
  mainPhoto: string;
  description: string;
  overlayHeight?: number;
  className?: string;
}

const ImageWithOverlay: React.FC<ImageWithOverlayProps> = ({
  mainPhoto,
  description,
  overlayHeight = 150,
  className = "",
}) => {
  return (
    <div
      className={`h-[460px] overflow-hidden flex justify-center items-center relative w-full ${className}`}
    >
      <img
        className="w-full h-full object-cover"
        src={mainPhoto}
        alt="Main Photo"
      />
      <div
        className="absolute bottom-0 w-full bg-gradient-to-t from-[#000000de] to-transparent flex items-center px-10 text-lg font-light"
        style={{ height: `${overlayHeight}px` }}
      >
        <p className="whitespace-pre text-white text-xl">{description}</p>
      </div>
    </div>
  );
};

export default ImageWithOverlay;
