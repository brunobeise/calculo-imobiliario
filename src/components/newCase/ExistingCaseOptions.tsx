import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { FaHistory, FaUsers } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { NewCaseContext } from ".";

interface ExistingCaseOptionsProps {
  setContext: (v: NewCaseContext) => void;
  setMultiplePropertyData: (data: PropertyData) => void;
  setNewCase: (v: boolean) => void;
  hasLastCase: boolean;
}

export function ExistingCaseOptions({
  setContext,
  setMultiplePropertyData,
  setNewCase,
  hasLastCase,
}: ExistingCaseOptionsProps) {
  return (
    <Card className="w-[320px] md:w-[500px] shadow-lg ">
      <ContextSelectorButton
        icon={<FaFilePen />}
        onClick={() => setContext("myCases")}
        title="Meus Estudos"
        desc="Acesse e continue seus estudos salvos"
      />
      <ContextSelectorButton
        icon={<FaUsers />}
        onClick={() => setContext("realEstateCases")}
        title="Estudos Compartilhados"
        desc="Veja estudos que foram salvos e compartilhados por seus colegas"
      />
      {hasLastCase && (
        <ContextSelectorButton
          icon={<FaHistory />}
          onClick={() => {
            const storedData = localStorage.getItem(
              "financingPlanningPropertyData"
            );
            if (storedData) {
              try {
                const parsedData = JSON.parse(storedData);
                if (parsedData && typeof parsedData === "object") {
                  setMultiplePropertyData(parsedData);
                  setNewCase(false);
                }
              } catch (error) {
                console.error("Erro ao fazer o parsing dos dados:", error);
              }
            }
          }}
          title="Retomar Último Estudo"
          desc="Recupere o último estudo que você estava trabalhando"
        />
      )}
    </Card>
  );
}
