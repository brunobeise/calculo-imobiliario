/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { ImovelDataContext } from "@/imovelDataContext";
import TabelaRendimento from "./TabelaRendimento";
import TabelaValorizaçãoAluguel from "./TabelaValorizaçãoAluguel";
import Conclusão from "./Conclusão";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./index.css";
import { ErrorAlert, imovelDataError } from "@/components/errorAlert";

export default function FinanciamentoXAvista() {
  const { imovelData } = useContext(ImovelDataContext);
  const [context, setContext] = useState<"financiamento" | "avista">(
    "financiamento"
  );
  const [errors, setErrors] = useState<imovelDataError[]>([]);

  useEffect(() => {
    const newErrors: imovelDataError[] = [];

    // if (imovelData.saldoPessoal < imovelData.valorImovel) {
    //   newErrors.push({
    //     title: "Saldo Pessoal incorreto.",
    //     message:
    //       "Na modalidade financiamento x a vista, o saldo pessoal deve ser igual ou superior ao valor do imóvel",
    //   });
    // }

    if (imovelData.anoFinal > 35 || imovelData.anosFinanciamento > 35) {
      newErrors.push({
        title: "Ano final ou tempo de financiamento inválido.",
        message: "Prazo do financimaneto é de no máximo 35 anos",
      });
    }

    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      setErrors(newErrors);
    }
  }, [imovelData]);

  return (
    <>
      <Tabs defaultValue="Financiamento" className="w-full text-center mt-5">
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
          <div className="grid grid-cols-12 px-2 gap-3 justify-center mt-5">
            <Conclusão context={context} />
            <TabelaValorizaçãoAluguel />
            <TabelaRendimento context={context} />
          </div>
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
