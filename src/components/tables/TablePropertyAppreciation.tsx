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

    for (let mes = 1; mes <= propertyData.finalYear * 12; mes++) {
      const lucroMensal =
        (capitalAcumulado * (propertyData.interestRate / 12)) / 100;
      capitalAcumulado += lucroMensal;

      if (mes % 12 === 0) {
        rows.push({
          ano: mes / 12,
          propertyValue: numeroParaReal(capitalAcumulado),
        });
      }
    }

    setRows(rows);
  }, [
    propertyData.finalYear,
    propertyData.interestRate,
    propertyData.propertyValue,
  ]);

  console.log(rows);

  return (
    <Card className="w-full border-0">
      {/* <CardTitle className="mt-2">
        <h2 className="text-xl text-center ">Valorização do Imóvel</h2>
        <p className="text-xs mb-5 text-center">
          ({propertyData.propertyAppreciationRate}% ao ano)
        </p>
      </CardTitle> */}
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Ano</TableHead>
              <TableHead>Valor do Imóvel</TableHead>
            </TableRow>
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
