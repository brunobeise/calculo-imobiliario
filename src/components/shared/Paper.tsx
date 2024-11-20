import React from "react";

interface PaperProps {
  children?: React.ReactNode;
  className?: string;
}

const Paper: React.FC<PaperProps> = ({ children, className }) => {
  return (
    <div className={` border border-grayScale-200 p-7 rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default Paper;
