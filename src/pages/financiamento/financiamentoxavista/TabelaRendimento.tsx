/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHeadSticked,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImovelDataContext } from "@/imovelDataContext";
import { numeroParaReal } from "@/lib/formatter";
import { useContext, useEffect, useState } from "react";

interface TabelaRendimentoProps {
  context: "financiamento" | "avista";
}

export default function TabelaRendimento(props: TabelaRendimentoProps) {
  const { imovelData, setImovelData } = useContext(ImovelDataContext);

  const [rows, setRows] = useState<
    {
      lucroMensal: string;
      capital: string;
      valorFinal: string;
      mes: number;
      montanteAluguel: string;
    }[]
  >([]);

  useEffect(() => {
    const rows: {
      lucroMensal: string;
      capital: string;
      valorFinal: string;
      mes: number;
      montanteAluguel: string;
    }[] = [];

    let capitalAcumulado =
      props.context === "financiamento"
        ? imovelData.saldoPessoal -
          imovelData.taxasFincancimento -
          imovelData.valorEntrada
        : imovelData.saldoPessoal - imovelData.valorImovel;

    let patrimonioFinal = 0;
    let valorAluguel = imovelData.valorInicialAluguel;

    for (let mes = 1; mes <= imovelData.anoFinal * 12; mes++) {
      const indiceAno = Math.floor((mes - 1) / 12);

      if (mes % 12 === 1 || mes === 1) {
        valorAluguel = imovelData.valorAluguel![indiceAno];
      }

      const montanteAluguel =
        props.context === "financiamento"
          ? Number((valorAluguel - imovelData.valorParcela).toFixed(2))
          : Number(valorAluguel.toFixed(2));

      let lucroMensal = 0;
      if (capitalAcumulado >= 0 || props.context === "financiamento") {
        lucroMensal = Number(
          ((capitalAcumulado * imovelData.rendimentoMensal) / 100).toFixed(2)
        );
      }

      const valorFinal = Number(
        (capitalAcumulado + lucroMensal + montanteAluguel).toFixed(2)
      );

      if (mes === imovelData.anoFinal * 12) patrimonioFinal = valorFinal;

      rows.push({
        mes,
        capital: numeroParaReal(capitalAcumulado),
        lucroMensal: numeroParaReal(lucroMensal),
        montanteAluguel: numeroParaReal(montanteAluguel),
        valorFinal: numeroParaReal(valorFinal),
      });

      capitalAcumulado = valorFinal;
    }

    setImovelData("patrimonioInvestido", patrimonioFinal);
    setRows(rows);
  }, [
    imovelData.saldoPessoal,
    imovelData.taxasFincancimento,
    imovelData.valorEntrada,
    imovelData.valorParcela,
    imovelData.valorAluguel,
    imovelData.rendimentoMensal,
    imovelData.anoFinal,
    props.context,
  ]);

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardTitle className="mt-2">
        <h2 className="text-xl text-center ">Investimento</h2>
        <p className="text-xs mb-5 text-center">
          rendimento {imovelData.rendimentoMensal}% ao mês{" "}
        </p>
      </CardTitle>
      <CardContent>
        <Table className="text-left">
          <TableHeader className="flex">
            <TableHeadSticked className="w-12">Mês</TableHeadSticked>
            <TableHeadSticked className="w-[25%]">Capital</TableHeadSticked>
            <TableHeadSticked className="w-[25%]">Rendimento</TableHeadSticked>
            <TableHeadSticked className="w-[25%]">Aluguel</TableHeadSticked>
            <TableHeadSticked className="w-[25%]">Valor FInal</TableHeadSticked>
          </TableHeader>
          <ScrollArea className="h-[300px]">
            <TableBody>
              {rows.map((item) => (
                <TableRow className="flex" key={item.mes}>
                  <TableCell className="w-12">{item.mes}</TableCell>
                  <TableCell className="w-[25%]">{item.capital}</TableCell>
                  <TableCell className="w-[25%]">{item.lucroMensal}</TableCell>
                  <TableCell className="w-[25%]">
                    {item.montanteAluguel}
                  </TableCell>
                  <TableCell className="w-[25%]">{item.valorFinal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ScrollArea>
        </Table>
      </CardContent>
    </Card>
  );
}
