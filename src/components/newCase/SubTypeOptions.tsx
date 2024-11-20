import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { LuBox } from "react-icons/lu";
import { FaCalculator } from "react-icons/fa";

interface SubTypeOptionsProps {
  onSelect: (v: string) => void;
}

export default function SubTypeOptions({ onSelect }: SubTypeOptionsProps) {
  return (
    <Card className="w-[500px] shadow-lg ">
      <ContextSelectorButton
        onClick={() => onSelect("Simplificado")}
        title="Simplificado"
        icon={<LuBox />}
        desc="Elabora uma proposta simles com descrição do imóvel e condições de pagemento."
      />
      <ContextSelectorButton
        icon={<FaCalculator />}
        onClick={() => onSelect("Avançado")}
        title="Avançado"
        desc="Elabora uma proposta detalhada, abrangendo a análise de viabilidade financeira, projeção de lucros e estimativa de valorização futura."
      />
    </Card>
  );
}
