import { Chip } from "@mui/joy";
import { ReactNode } from "react";

const styles = {
  default: "!bg-[#f3f4f6] !text-[#374151] border-[#d1d5db]",
  danger: "!bg-[#fee2e2] !text-[#b91c1c] border-[#f87171]",
  warning: "!bg-[#fef3c7] !text-[#92400e] border-[#fbbf24]",
  success: "!bg-[#d1fae5] !text-[#065f46] border-[#065f46]",
  info: "!bg-[#e0f2fe] !text-[#1565c0] border-[#1565c0]",
};

const Badge = ({
  type = "default",
  children,
}: {
  type: keyof typeof styles;
  children: ReactNode;
}) => {
  const baseClasses = "px-2 py-1 text-sm font-medium rounded-full border";

  const selectedStyle = styles[type] || styles.default;

  return (
    <Chip
      className={`${baseClasses} ${selectedStyle} !text-xs max-h-[28px]`}
      sx={{
        "*": {
          color: "inherit",
        },
      }}
    >
      {children}
    </Chip>
  );
};

export default Badge;
