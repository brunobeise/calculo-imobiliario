import { propertyDataContext } from "@/PropertyDataContext";
import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

export default function DefaultValuesPropertyData() {
  const location = useLocation();
  const { setpropertyData } = useContext(propertyDataContext);

  useEffect(() => {
    // Aqui você pode definir a lógica para atualizar os valores com base na rota
    if (location.pathname === "/financiamentoisoladoxavista") {
      // Atualize os valores para esta rota específica
      // setpropertyData('propertyValue', novoValor); Substitua 'novoValor' pelo valor desejado
      // Repita para outros valores conforme necessário
    } else {
      // Defina valores padrão para outras rotas, se necessário
    }
  }, [location, setpropertyData]);

  return <></>;
}
