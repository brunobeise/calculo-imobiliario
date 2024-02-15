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

export default function TabelaValorizaçãoAluguel() {
  const { propertyData } = useContext(propertyDataContext);
  const [rows, setRows] = useState<
    {
      rentValue: string;
      arrecadacaoAnual: string;
      ano: number;
    }[]
  >([]);

  useEffect(() => {
    const newRows = propertyData.rentValue.map((rentValue, index) => {
      const arrecadacaoAnual = rentValue * 12;
      return {
        rentValue: numeroParaReal(rentValue),
        arrecadacaoAnual: numeroParaReal(arrecadacaoAnual),
        ano: index + 1,
      };
    });

    setRows(newRows);
  }, [
    propertyData.finalYear,
    propertyData.initialRentValue,
    propertyData.rentValue,
  ]);

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardTitle className="mt-2">
        <h2 className="text-xl text-center ">Valorização Aluguel</h2>
        <p className="text-xs mb-5 text-center">(inflação 8% ao ano)</p>
      </CardTitle>
      <CardContent>
        <Table className="w-full text-left">
          <TableHeader>
            <TableHead>Ano</TableHead>
            <TableHead>Valor do Aluguel</TableHead>
            <TableHead>Arrecadação Anual</TableHead>
          </TableHeader>
          <TableBody>
            {rows?.map((item) => (
              <TableRow key={item.ano}>
                <TableCell>{item.ano}</TableCell>
                <TableCell>{item.rentValue}</TableCell>
                <TableCell>{item.arrecadacaoAnual}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
