import { ReactNode } from "react";
import { Skeleton } from "@mui/joy";

interface DashboardPaperProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  titleSize?: string;
  loading?: boolean;
}

export default function DashboardPaper(props: DashboardPaperProps) {
  return (
    <div className="bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-white p-7 shadow-lg rounded-lg">
      <div className="grid grid-cols-3 h-full">
        <div className="col-span-2 grid grid-rows items-center relative">
          {props.loading ? (
            <div className="p-1">
              <Skeleton variant="rectangular" width={40} height={40} className="mb-4" />
              <Skeleton variant="text" width={100} height={18} />
            </div>
          ) : (
            <>
              <p className={`text-${props.titleSize || "5xl"} font-bold mb-2`}>
                {props.value}
              </p>
              <p className="font-bold">{props.title}</p>
            </>
          )}
        </div>
        <div className="flex justify-center items-center">
          {props.loading ? (
            <Skeleton variant="circular" width={60} height={60} />
          ) : (
            <div className="bg-white text-primary rounded-full p-5">
              <span className="text-5xl">{props.icon}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
