import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImovelDataContext } from "@/imovelDataContext";
import { numeroParaReal } from "@/lib/formatter";

import { useEffect, useState } from "react";
import { useContext } from "react";

export default function TabelaValorizaçãoAluguel() {
  const { imovelData } = useContext(ImovelDataContext);
  const [rows, setRows] = useState<
    {
      valorAluguel: string;
      arrecadacaoAnual: string;
      ano: number;
    }[]
  >([]);

  useEffect(() => {
    const newRows = imovelData.valorAluguel.map((valorAluguel, index) => {
      const arrecadacaoAnual = valorAluguel * 12;
      return {
        valorAluguel: numeroParaReal(valorAluguel),
        arrecadacaoAnual: numeroParaReal(arrecadacaoAnual),
        ano: index + 1,
      };
    });

    setRows(newRows);
  }, [
    imovelData.anoFinal,
    imovelData.valorInicialAluguel,
    imovelData.valorAluguel,
  ]);

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardTitle className="mt-2">
        <h2 className="text-xl text-center ">Valorização Aluguel</h2>
        <p className="text-xs mb-5 text-center">(inflação 8% ao ano)</p>
      </CardTitle>
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableHead>Ano</TableHead>
            <TableHead>Valor do Aluguel</TableHead>
            <TableHead>Arrecadação Anual</TableHead>
          </TableHeader>
          <TableBody>
            {rows?.map((item) => (
              <TableRow key={item.ano}>
                <TableCell>{item.ano}</TableCell>
                <TableCell>{item.valorAluguel}</TableCell>
                <TableCell>{item.arrecadacaoAnual}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
