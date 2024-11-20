import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { FaFilePen } from "react-icons/fa6";
import { FaFileInvoice } from "react-icons/fa";
import { NewCaseContext } from ".";

interface NewCaseManualOptionsProps {
  setContext: (v: NewCaseContext) => void;
}

export default function NewCaseManualOptions({
  setContext,
}: NewCaseManualOptionsProps) {
  return (
    <Card className="w-[500px] shadow-lg ">
      <ContextSelectorButton
        icon={<FaFilePen />}
        onClick={() => {
          setContext("manual");
        }}
        title="Inserir dados manualmente"
        desc="Insira os dados manualmente para iniciar um novo cálculo personalizado, ajustando os parâmetros conforme suas necessidades."
      />
      <ContextSelectorButton
        icon={<FaFileInvoice />}
        onClick={() => {
          setContext("template");
        }}
        title="Começar com template"
        desc="Acesse diretamente a área de cálculo com dados de exemplo pré-preenchidos. Faça ajustes conforme necessário."
      />
    </Card>
  );
}
