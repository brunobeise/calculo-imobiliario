import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { FaFilePen } from "react-icons/fa6";
import { getInitialValues } from "@/propertyData/propertyDataInivitalValues";
import { FaFileInvoice } from "react-icons/fa";
import { PropertyData } from "@/propertyData/PropertyDataContext";

interface NewCaseManualOptionsProps {
  setContext: (
    v: "new" | "exists" | "newCase" | "myCases" | "realEstateCases" | undefined
  ) => void;
  setMultiplePropertyData: (data: PropertyData) => void;
  setNewCase: (v: boolean) => void;
}

export default function NewCaseManualOptions({
  setContext,
  setMultiplePropertyData,
  setNewCase,
}: NewCaseManualOptionsProps) {
  return (
    <Card className="w-[500px] shadow-lg ">
      <ContextSelectorButton
        icon={<FaFilePen />}
        onClick={() => {
          setContext("newCase");
        }}
        title="Inserir dados manualmente"
        desc="Insira os dados manualmente para iniciar um novo cálculo personalizado, ajustando os parâmetros conforme suas necessidades."
      />
      <ContextSelectorButton
        icon={<FaFileInvoice />}
        onClick={() => {
          setMultiplePropertyData(getInitialValues(location.pathname));
          setNewCase(false);
        }}
        title="Começar com template"
        desc="Acesse diretamente a área de cálculo com dados de exemplo pré-preenchidos. Faça ajustes conforme necessário."
      />
    </Card>
  );
}
