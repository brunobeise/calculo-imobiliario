import { PageLoading } from "@/components/Loading";
import { ReactNode } from "react";
import { Divider } from "@mui/joy";

interface PageStructureProps {
  header: ReactNode;
  contentHeader: ReactNode;
  content: ReactNode;
  loading?: boolean;
  footer?: ReactNode;
}

export default function PageStructure(props: PageStructureProps) {
  return (
    <div className="bg-[#f1f2f4] border-l border-gray p-4 flex flex-col h-screen overflow-y-hidden">
      <div>{props.header}</div>
      <div
        className={`bg-whitefull mt-6 rounded-lg p-5 flex flex-col h-full overflow-y-hidden relative ${
          props.footer ? "pb-20" : ""
        }`}
      >
        {props.contentHeader}
        <Divider className="!my-5" />

        <div className="h-fit overflow-y-auto">
          {props.loading ? <PageLoading /> : props.content}
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
