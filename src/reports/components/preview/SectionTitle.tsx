import { ReactNode } from "react";

interface SectionTitleProps {
  icon: ReactNode;
  color: string;
  secondary: string;
  title: string;
}

export default function SectionTitle(props: SectionTitleProps) {
  return (
    <div className="flex items-center mb-6 text-lg font-semibold text-primary">
      <span
        role="img"
        aria-label="payment"
        style={{ color: props.secondary }}
        className="mr-2 text-2xl me-2"
      >
        {props.icon}
      </span>
      <p style={{ color: props.color }} className="text-2xl font-bold">
        {props.title}
      </p>
    </div>
  );
}