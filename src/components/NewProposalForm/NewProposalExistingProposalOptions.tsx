import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { FaUsers } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";

import { NewProposalContext } from "./NewProposalForm";
import { useAuth } from "@/auth";

interface ExistingProposalOptionsProps {
  setContext: (v: NewProposalContext) => void;
}

export function ExistingProposalOptions({
  setContext,
}: ExistingProposalOptionsProps) {
  const { user } = useAuth();

  return (
    <Card className="w-[320px] md:w-[500px] shadow-lg ">
      <ContextSelectorButton
        icon={<FaFilePen />}
        onClick={() => setContext("myProposals")}
        title="Minhas Propostas"
        desc="Acesse e continue suas propostas salvas"
      />
      {!user.isAutonomous && (
        <ContextSelectorButton
          icon={<FaUsers />}
          onClick={() => setContext("realEstateProposals")}
          title="Propostas Compartilhadas"
          desc="Veja propostas que foram salvas e compartilhadas por seus colegas"
        />
      )}
    </Card>
  );
}
