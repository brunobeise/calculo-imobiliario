import { createContext, useContext } from "react";
import { Proposal } from "@/types/proposalTypes";

export type ProposalContextType = {
  proposal: Proposal;
  setProposal: (proposal: Proposal | null) => void;
};

export const ProposalContext = createContext<ProposalContextType | null>(null);

export const useProposal = () => {
  const context = useContext(ProposalContext);
  if (!context) {
    throw new Error("useProposal deve ser usado dentro de ProposalContext");
  }
  return context;
};
