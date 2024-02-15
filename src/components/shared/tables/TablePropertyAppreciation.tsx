import { Card, CardContent } from "@/components/ui/card";
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

export default function TablePropertyAppreciation() {
  const { propertyData } = useContext(propertyDataContext);
  const [rows, setRows] = useState<
    {
      propertyValue: string;
      ano: number;
    }[]
  >([]);

  useEffect(() => {
    const rows = [];

    let capitalAcumulado = propertyData.propertyValue;

    for (let linha = 1; linha <= propertyData.finalYear; linha++) {
      const lucroMensal = (capitalAcumulado * propertyData.interestRate) / 100;
      const valorFinal = capitalAcumulado + lucroMensal;

      rows.push({
        ano: linha,
        propertyValue: numeroParaReal(capitalAcumulado),
      });

      capitalAcumulado = valorFinal;
    }

    setRows(rows);
  }, [
    propertyData.finalYear,
    propertyData.interestRate,
    propertyData.propertyValue,
  ]);

  return (
    <Card className="w-full border-0">
      {/* <CardTitle className="mt-2">
        <h2 className="text-xl text-center ">Valorização do Imóvel</h2>
        <p className="text-xs mb-5 text-center">
          ({propertyData.propertyAppreciationRate}% ao ano)
        </p>
      </CardTitle> */}
      <CardContent>
        <Table className="w-full text-center">
          <TableHeader>
            <TableHead className="text-center">Ano</TableHead>
            <TableHead className="text-center">Valor do Imóvel</TableHead>
          </TableHeader>
          <TableBody>
            {rows?.map((item) => (
              <TableRow key={item.ano}>
                <TableCell>{item.ano}</TableCell>
                <TableCell>{item.propertyValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
