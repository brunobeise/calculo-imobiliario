/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { propertyDataContext } from "@/PropertyDataContext";
import TabelaRendimento from "./TabelaRendimento";
import TabelaValorizaçãoAluguel from "./TabelaValorizaçãoAluguel";
import Conclusão from "./Conclusão";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorAlert, propertyDataError } from "@/components/errorAlert";
import { Button } from "@/components/ui/button";
import { FileBarChart2 } from "lucide-react";

export default function FinanciamentoXAvista() {
  const { propertyData } = useContext(propertyDataContext);
  const [context, setContext] = useState<"financiamento" | "avista">(
    "financiamento"
  );
  const [errors, setErrors] = useState<propertyDataError[]>([]);

  useEffect(() => {
    const newErrors: propertyDataError[] = [];

    if (propertyData.personalBalance < propertyData.propertyValue) {
      newErrors.push({
        title: "Saldo Pessoal incorreto.",
        message:
          "Na modalidade financiamento x a vista, o saldo pessoal deve ser igual ou superior ao valor do imóvel",
      });
    }

    if (propertyData.finalYear > 35 || propertyData.financingYears > 35) {
      newErrors.push({
        title: "Ano final ou tempo de financiamento inválido.",
        message: "Prazo do financimaneto é de no máximo 35 anos",
      });
    }

    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      setErrors(newErrors);
    }
  }, [propertyData]);

  return (
    <>
      <Tabs defaultValue="Financiamento" className="w-full text-center">
        <TabsList>
          <TabsTrigger
            onClick={() => setContext("financiamento")}
            value="Financiamento"
          >
            Financiamento
          </TabsTrigger>
          <TabsTrigger onClick={() => setContext("avista")} value="A Vista">
            A Vista
          </TabsTrigger>
        </TabsList>

        {errors.length === 0 ? (
          <>
            <div className="grid grid-cols-12 px-2 gap-3 justify-center mt-5">
              <Conclusão context={context} />
              <TabelaValorizaçãoAluguel />
              <TabelaRendimento context={context} />
            </div>
            <Button
              href="/financiamentoxavista/relatorio"
              className="my-5"
              text="Gerar Relatório Completo"
              Icon={FileBarChart2}
            />
          </>
        ) : (
          <div
            className={
              "grid place-items-center gap-2 mt-5 lg:px-32" +
              (errors.length % 2 === 0 ? " md:grid-cols-2" : " grid-cols-1")
            }
          >
            {errors.map((e) => (
              <ErrorAlert message={e.message} title={e.title} />
            ))}
          </div>
        )}
      </Tabs>
    </>
  );
}
