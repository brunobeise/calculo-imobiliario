import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { numeroParaReal } from "@/lib/formatter";
import { propertyDataContext } from "@/PropertyDataContext";

import { useEffect, useState } from "react";
import { useContext } from "react";

interface TableRentAppreciationProps {
  annualCollection?: boolean;
}

export default function TableRentAppreciation(
  props: TableRentAppreciationProps
) {
  const { propertyData } = useContext(propertyDataContext);
  const [rows, setRows] = useState<
    {
      valorAluguel: string;
      arrecadacaoAnual: string;
      ano: number;
    }[]
  >([]);

  useEffect(() => {
    const newRows = propertyData.valorAluguel.map((valorAluguel, index) => {
      const arrecadacaoAnual = valorAluguel * 12;
      return {
        valorAluguel: numeroParaReal(valorAluguel),
        arrecadacaoAnual: numeroParaReal(arrecadacaoAnual),
        ano: index + 1,
      };
    });

    setRows(newRows);
  }, [
    propertyData.anoFinal,
    propertyData.valorInicialAluguel,
    propertyData.valorAluguel,
  ]);

  return (
    <Card className="w-full border-0">
      <CardTitle className="mt-2">
        <h2 className="text-xl text-center ">Valorização Aluguel</h2>
        <p className="text-xs mb-5 text-center">(inflação 8% ao ano)</p>
      </CardTitle>
      <CardContent>
        <Table className="w-full text-left text-center">
          <TableHeader>
            <TableHead className="text-center">Ano</TableHead>
            <TableHead className="text-center">Valor do Aluguel</TableHead>
            {props.annualCollection && <TableHead>Arrecadação Anual</TableHead>}
          </TableHeader>
          <TableBody>
            {rows?.map((item) => (
              <TableRow key={item.ano}>
                <TableCell>{item.ano}</TableCell>
                <TableCell>{item.valorAluguel}</TableCell>
                {props.annualCollection && (
                  <TableCell>{item.arrecadacaoAnual}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
