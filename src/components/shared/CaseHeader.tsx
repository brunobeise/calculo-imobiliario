import React from "react";
import { Button, Tooltip, Tabs, TabList, tabClasses, Tab } from "@mui/joy";
import { FaBook, FaFile } from "react-icons/fa";
import { MdRestartAlt } from "react-icons/md";
import StatusTag from "@/components/shared/CaseStatusTag";
import { getCaseTitle } from "@/lib/maps";
import { Proposal } from "@/types/proposalTypes";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

interface CaseHeaderProps {
  actualCase?: Proposal;
  setActualCase: React.Dispatch<React.SetStateAction<Proposal | undefined>>;
  onRestart: () => void;
}

const CaseHeader: React.FC<CaseHeaderProps> = ({
  actualCase,
  setActualCase,
  onRestart,
}) => {
  const pageContext = usePageContext();
  const { urlParsed } = pageContext;

  const tabParam = urlParsed.search.tab as string | undefined;
  const [report, setReport] = React.useState(tabParam !== "case");

  const handleTabChange = async (isReport: boolean) => {
    setReport(isReport);

    const searchParams = new URLSearchParams(urlParsed.search);
    searchParams.set("tab", isReport ? "report" : "case");

    const newUrl = `${urlParsed.pathname}?${searchParams.toString()}`;

    await navigate(newUrl, { overwriteLastHistoryEntry: true });
  };

  return (
    <div className="bg-whitefull absolute w-full z-[10] h-[80px] border-b border-border">
      <div className="hidden md:block">
        <RestartButton onRestart={onRestart} />
      </div>

      {actualCase && (
        <TabsComponent report={report} onTabChange={handleTabChange} />
      )}
      <div className={actualCase ? "h-[85px]" : "h-[50px]"}>
        <div className="flex justify-center md:items-center h-full">
          <div className="flex flex-col items-center gap-1">
            {actualCase ? (
              <>
                <h1 className="scroll-m-20 text-sm md:text-xl text-primary text-center">
                  {actualCase.name}
                  {actualCase.propertyName && " - "}
                  {actualCase.propertyName}
                </h1>
                <div className="hidden md:block">
                  <StatusTag
                    status={actualCase.status}
                    id={actualCase.id}
                    enableEdit
                    onChange={(status) =>
                      setActualCase((prev) => prev && { ...prev, status })
                    }
                  />
                </div>
              </>
            ) : (
              <h1 className="scroll-m-20 text-xl text-primary text-center mt-2">
                {getCaseTitle(urlParsed.pathname.split("/")[1])}
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TabsComponentProps {
  report: boolean;
  onTabChange: (isReport: boolean) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  report,
  onTabChange,
}) => (
  <Tabs
    value={report ? "report" : "case"}
    aria-label="tabs"
    sx={{ bgcolor: "transparent" }}
    className="!absolute !right-[2rem] top-[50%] translate-y-[-50%]"
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
          bgcolor: "background.surface",
        },
      }}
    >
      <div onClick={() => onTabChange(false)}>
        <Tab className="!text-primary" value="case">
          <FaBook className="text-sm" />{" "}
          <span className="font-bold">Estudo</span>
        </Tab>
      </div>
      <div onClick={() => onTabChange(true)}>
        <Tab className="!text-primary" value="report">
          <FaFile className="text-sm" />{" "}
          <span className="font-bold">Proposta</span>
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
