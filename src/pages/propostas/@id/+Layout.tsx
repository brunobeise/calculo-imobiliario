import { useEffect, useState, ReactNode } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { caseService } from "@/service/caseService";
import GlobalLoading from "@/components/Loading";
import { Proposal } from "@/types/proposalTypes";
import { ProposalContext } from "./ProposalContext";
import ProposalHeader from "./ProposalHeader";

export default function Layout({ children }: { children: ReactNode }) {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    caseService.getCaseById(id).then((response) => {
      if (response) {
        setProposal(response);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading || !proposal) return <GlobalLoading />;

  return (
    <ProposalContext.Provider value={{ proposal, setProposal }}>
      <div className="bg-background min-h-screen pb-10 md:pb-0">
        <ProposalHeader />
        {children}
      </div>
    </ProposalContext.Provider>
  );
}
