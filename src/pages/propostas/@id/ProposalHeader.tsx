import { Button } from "@mui/joy";
import {
  FaBook,
  FaEdit,
  FaExternalLinkAlt,
  FaFile,
  FaFileAlt,
} from "react-icons/fa";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { useProposal } from "./ProposalContext";
import { IoDuplicate } from "react-icons/io5";
import { MenuSelector } from "@/components/shared/MenuSelector";
import { FaArrowLeft, FaEye } from "react-icons/fa6";
import { useEffect, useState } from "react";
import ProposalFormModal from "@/components/modals/ProposalFormModal";

const ProposalHeader = () => {
  const pageContext = usePageContext();
  const { urlParsed } = pageContext;
  const { proposal, setProposal } = useProposal();

  const [proposalFormModal, setProposalFormModal] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState(false);

  const tabs = [
    { id: "report", label: "Layout", icon: <FaFile /> },
    { id: "case", label: "Estudo", icon: <FaBook /> },
    { id: "sessions", label: "Visualizações", icon: <FaEye /> },
  ];

  const handleTabChange = async (newTab: string) => {
    const searchParams = new URLSearchParams(urlParsed.search);
    searchParams.set("tab", newTab);
    await navigate(`${urlParsed.pathname}?${searchParams.toString()}`, {
      overwriteLastHistoryEntry: true,
    });
  };

  const tabParam = (urlParsed.search.tab as string) ?? "";

  useEffect(() => {
    if (!tabParam) {
      const searchParams = new URLSearchParams(urlParsed.search);
      searchParams.set("tab", "report");
      navigate(`${urlParsed.pathname}?${searchParams.toString()}`, {
        overwriteLastHistoryEntry: true,
      });
    }
  }, [tabParam, urlParsed.pathname, urlParsed.search]);

  return (
    <div className="bg-whitefull !absolute w-full z-[12] h-[80px] border-b border-border shadow flex items-center md:items-center ps-12 pe-10 justify-between">
      <div className="flex flex-col items-center gap-1">
        <div className="w-full flex items-center text-primary gap-2  text-xl ms-4">
          <Button onClick={() => navigate("/propostas")} variant="plain">
            <FaArrowLeft />
          </Button>
          <FaFileAlt />
          <h2 className="font-bold text-nowrap">{proposal.name}</h2>
        </div>
      </div>
      <div className="absolute ms-4 left-[50%] translate-x-[-50%]">
        <MenuSelector
          items={tabs}
          initialItemId={tabParam || "report"}
          onChange={handleTabChange}
          queryParamKey="tab"
        />
      </div>
      <div className="hidden md:flex gap-3 items-center">
        <Button
          endDecorator={<FaEdit />}
          onClick={() => setProposalFormModal(true)}
          type="button"
          variant="outlined"
        >
          Editar
        </Button>
        <Button
          endDecorator={<IoDuplicate />}
          onClick={() => setDuplicateModal(true)}
          type="button"
          variant="outlined"
        >
          Duplicar
        </Button>
        <Button
          endDecorator={<FaExternalLinkAlt />}
          onClick={() => window.open(`/proposta/${proposal.id}`, "_blank")}
          type="button"
        >
          Ver Online
        </Button>
      </div>
      <ProposalFormModal
        open={proposalFormModal}
        onClose={() => setProposalFormModal(false)}
        initialData={proposal}
        handleUpdate={(p) => setProposal(p)}
      />
      <ProposalFormModal
        open={duplicateModal}
        onClose={() => setDuplicateModal(false)}
        duplicate
        initialData={proposal}
        handleUpdate={(p) => setProposal(p)}
      />
    </div>
  );
};

export default ProposalHeader;
