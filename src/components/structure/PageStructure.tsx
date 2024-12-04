import { PageLoading } from "@/components/Loading";
import { ReactNode } from "react";
import { Divider } from "@mui/joy";

interface PageStructureProps {
  header: ReactNode;
  contentHeader?: ReactNode;
  content: ReactNode;
  loading?: boolean;
  footer?: ReactNode;
}

export default function PageStructure(props: PageStructureProps) {
  return (
    <div className="bg-background p-4 flex flex-col h-screen overflow-y-hidden">
      <div>{props.header}</div>
      <div
        className={`bg-whitefull mt-6 rounded-lg p-5 flex flex-col h-full overflow-y-hidden relative ${
          props.footer ? "pb-20" : ""
        }`}
      >
        {props.contentHeader}
        {props.contentHeader && <Divider className="!my-5" />}

        <div
          className={`h-fit relative min-h-[80%] ${
            props.loading ? "overflow-y-visible" : "overflow-y-auto"
          }`}
        >
          {props.content}
          {props.loading && (
            <div className="absolute top-0 left-0 flex items-center justify-center bg-white/80 z-10 w-full h-full">
              <PageLoading />
            </div>
          )}
        </div>

        {props.footer && (
          <div className="absolute bottom-0 w-full left-0 pb-5 px-8">
            {props.footer}
          </div>
        )}
      </div>
    </div>
  );
}
