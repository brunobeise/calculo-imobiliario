import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { TbFileDownload, TbFilePlus } from "react-icons/tb";
import { NewCaseContext } from ".";

interface NewCaseOptionsProps {
  setContext: (v: NewCaseContext) => void;
}

export default function NewCaseOptions({ setContext }: NewCaseOptionsProps) {
  return (
    <Card className="w-[320px] md:w-[500px] shadow-lg ">
      <ContextSelectorButton
        onClick={() => setContext("new")}
        title="Novo"
        icon={<TbFilePlus />}
        desc="Começar um novo estudo"
      />
      <ContextSelectorButton
        icon={<TbFileDownload />}
        onClick={() => setContext("exists")}
        title="Existente"
        desc="Continuar um estudo ja iniciado"
      />
    </Card>
  );
}
