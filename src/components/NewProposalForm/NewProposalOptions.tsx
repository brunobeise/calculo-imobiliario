import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { TbFileDownload, TbFilePlus } from "react-icons/tb";
import { NewProposalContext } from "./NewProposalForm";

interface NewProposalOptionsProps {
  setContext: (v: NewProposalContext) => void;
}

export default function NewProposalOptions({ setContext }: NewProposalOptionsProps) {
  return (
    <Card className="w-[320px] md:w-[500px] shadow-lg ">
      <ContextSelectorButton
        onClick={() => setContext("new")}
        title="Nova"
        icon={<TbFilePlus />}
        desc="Começar uma nova proposta"
      />
      <ContextSelectorButton
        icon={<TbFileDownload />}
        onClick={() => setContext("exists")}
        title="Existente"
        desc="Continuar uma proposta ja iniciada"
      />
    </Card>
  );
}
