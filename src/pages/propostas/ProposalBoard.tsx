import { useDrag, useDrop } from "react-dnd";
import { useEffect, useState } from "react";
import { Proposal } from "@/types/proposalTypes";
import { IoHomeOutline } from "react-icons/io5";
import { FaExclamationCircle } from "react-icons/fa";
import ProposalDropdownMenu from "./ProposalDropdownMenu";
import { useMenu } from "@/components/menu/MenuContext";
import { navigate } from "vike/client/router";
import { Tooltip } from "@mui/joy";
import { FaRegEye } from "react-icons/fa";
import CaseSessionsModal from "@/components/session/SessionsModal";
import { caseService } from "@/service/caseService";

const STATUS_ORDER = [
  "Rascunho",
  "Em Análise",
  "Enviada",
  "Aceita",
  "Recusada",
];

function DraggableCard({
  proposal,
  handleDelete,
}: {
  proposal: Proposal;
  handleDelete: (id: string) => void;
}) {
  const [, drag] = useDrag({
    type: "CARD",
    item: { id: proposal.id },
  });

  const { toggleBackdrop, toggleMenu } = useMenu();

  const [sessionsModal, setSessionsModal] = useState(false);
  const [hasNewSession, setHasNewSession] = useState(proposal.hasNewSession);

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => {
          toggleMenu(false);
          toggleBackdrop(false);
          navigate(`/propostas/${proposal.id}`);
        }}
        ref={drag}
      >
        <div className="bg-whitefull shadow-sm p-4 text-sm flex gap-2 relative">
          {proposal.mainPhoto ? (
            <img
              src={proposal.mainPhoto}
              alt={proposal.name}
              className="w-16 h-16 rounded object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded bg-grayScale-100 flex items-center justify-center">
              <IoHomeOutline className="text-grayScale-600" />
            </div>
          )}
          <div>
            <div className="font-bold">{proposal.name}</div>
            <div className="text-xs text-grayScale-500">
              {proposal.propertyName}
            </div>
          </div>
          <ProposalDropdownMenu
            onDelete={handleDelete}
            size="small"
            proposal={proposal}
          />

          <Tooltip title={proposal.hasNewSession ? "Novas vizualizações!" : ""}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
                setHasNewSession(false);
                setSessionsModal(true);
              }}
              className={`relative text-primary !absolute bottom-1 !right-0 rounded  flex gap-1 items-center justify-center h-6 w-10 hover:opacity-70`}
            >
              <span className="text-xs">{proposal._count?.sessions}</span>
              <FaRegEye className="text-xs mt-1" />
            </div>
          </Tooltip>

          {hasNewSession && (
            <FaExclamationCircle className="absolute bottom-[15px] !right-[-2px] text-primary bg-white rounded-full border-[1px] border-white text-xs" />
          )}
        </div>
      </div>
      <CaseSessionsModal
        open={sessionsModal}
        onClose={() => setSessionsModal(false)}
        caseId={proposal.id}
      />
    </>
  );
}

export default function ProposalBoard({
  data,
  statuses,
}: {
  data: Proposal[];
  statuses: string[];
  realEstateCase?: boolean;
  adminCase?: boolean;
}) {
  const [proposals, setProposals] = useState(data);

  useEffect(() => {
    setProposals(data);
  }, [data]);

  const handleStatusChange = async (id: string, newStatus: string | null) => {
    if (!newStatus) return;
    try {
      await caseService.updateCase(
        id,
        {
          status: newStatus,
        },
        "disabled"
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setProposals(proposals.filter((p) => p.id !== id));
      await caseService.updateCase(id, {
        isArchived: true,
      });
    } catch (error) {
      console.error("Erro ao excluir proposta:", error);
    }
  };

  const moveProposal = (id: string, newStatus: string) => {
    const updated = proposals.map((p) =>
      p.id === id ? { ...p, status: newStatus } : p
    );
    setProposals(updated);
    handleStatusChange(id, newStatus);
  };

  return (
    <div className="grid auto-cols-fr grid-flow-col h-full gap-5">
      {STATUS_ORDER.map((status) => {
        if (!statuses.includes(status)) return null;
        return (
          <Column
            handleDelete={handleDelete}
            key={status}
            status={status}
            proposals={proposals.filter((p) => p.status === status)}
            onDropCard={moveProposal}
          />
        );
      })}
    </div>
  );
}

function Column({
  status,
  proposals,
  onDropCard,
  handleDelete,
}: {
  status: string;
  proposals: Proposal[];
  onDropCard: (id: string, newStatus: string) => void;
  handleDelete: (id: string) => void;
}) {
  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item: Proposal) => {
      onDropCard(item.id, status);
    },
  });

  return (
    <div
      ref={drop}
      className="bg-white p-2 bg-grayScale-100 h-full shadow rounded overflow-y-auto max-h-full"
    >
      <h3 className="text-center font-bold mb-5 mt-2">{status}</h3>
      <div className="flex flex-col gap-2">
        {proposals.map((proposal) => (
          <DraggableCard
            handleDelete={handleDelete}
            key={proposal.id}
            proposal={proposal}
          />
        ))}
      </div>
    </div>
  );
}
