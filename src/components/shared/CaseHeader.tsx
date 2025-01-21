import React from "react";
import {
  Divider,
  Button,
  Tooltip,
  Tabs,
  TabList,
  tabClasses,
  Tab,
} from "@mui/joy";
import { FaBook, FaFile } from "react-icons/fa";
import { MdRestartAlt } from "react-icons/md";
import StatusTag from "@/components/shared/CaseStatusTag";
import { getCaseTitle } from "@/lib/maps";
import { Proposal } from "@/types/proposalTypes";
import { usePageContext } from "vike-react/usePageContext";

interface CaseHeaderProps {
  actualCase?: Proposal;
  setActualCase: React.Dispatch<React.SetStateAction<Proposal | undefined>>;
  report: boolean;
  setReport: React.Dispatch<React.SetStateAction<boolean>>;
  onRestart: () => void;
}

const CaseHeader: React.FC<CaseHeaderProps> = ({
  actualCase,
  setActualCase,
  report,
  setReport,
  onRestart,
}) => {
  const pageContext = usePageContext();

  return (
    <div className="bg-whitefull relative">
      <RestartButton onRestart={onRestart} />
      {actualCase && <TabsComponent report={report} setReport={setReport} />}
      <div className={actualCase ? "h-[85px]" : "h-[50px]"}>
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center gap-2">
            {actualCase ? (
              <>
                <h1 className="scroll-m-20 text-xl text-primary text-center">
                  {actualCase.name}
                  {actualCase.propertyName && " - "}
                  {actualCase.propertyName}
                </h1>
                <StatusTag
                  status={actualCase.status}
                  id={actualCase.id}
                  enableEdit
                  onChange={(status) =>
                    setActualCase((prev) => prev && { ...prev, status })
                  }
                />
              </>
            ) : (
              <h1 className="scroll-m-20 text-xl text-primary text-center mt-2">
                {getCaseTitle(pageContext.urlPathname.split("/")[1])}
              </h1>
            )}
          </div>
        </div>
      </div>
      <Divider className="!mt-3" />
    </div>
  );
};
interface TabsComponentProps {
  report: boolean;
  setReport: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabsComponent: React.FC<TabsComponentProps> = ({ report, setReport }) => (
  <Tabs
    defaultValue={report ? "report" : "case"}
    aria-label="tabs"
    sx={{ bgcolor: "transparent" }}
    className="!absolute !right-[2rem] top-[2rem]"
  >
    <TabList
      disableUnderline
      sx={{
        justifyContent: "center",
        p: 0.5,
        gap: 0.5,
        borderRadius: "xl",
        bgcolor: "transparent",
        [`& .${tabClasses.root}[aria-selected="true"]`]: {
          boxShadow: "sm",
          bgcolor: "background.surface",
        },
      }}
    >
      <div onClick={() => setReport(false)}>
        <Tab className="!text-primary" value="case">
          <FaBook className="text-sm" />{" "}
          <span className="font-bold"> Estudo </span>
        </Tab>
      </div>
      <div onClick={() => setReport(true)}>
        <Tab className="!text-primary" value="report">
          <FaFile className="text-sm" />{" "}
          <span className="font-bold">Proposta </span>
        </Tab>
      </div>
    </TabList>
  </Tabs>
);

interface RestartButtonProps {
  onRestart: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ onRestart }) => (
  <div className="absolute top-[0.6rem] left-[4rem] z-10">
    <Tooltip title="Recomeçar estudo" placement="left-end">
      <Button variant="plain" className="!p-0 !px-1" onClick={onRestart}>
        <MdRestartAlt className="text-xl text-grayText" />
      </Button>
    </Tooltip>
  </div>
);

export default CaseHeader;
