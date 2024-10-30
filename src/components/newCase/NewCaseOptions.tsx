import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { TbFileDownload, TbFilePlus } from "react-icons/tb";

interface NewCaseOptionsProps {
  setContext: (
    v: "new" | "exists" | "newCase" | "myCases" | "realEstateCases" | undefined
  ) => void;
}

export default function NewCaseOptions({ setContext }: NewCaseOptionsProps) {
  return (
    <Card className="w-[500px] shadow-lg ">
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
