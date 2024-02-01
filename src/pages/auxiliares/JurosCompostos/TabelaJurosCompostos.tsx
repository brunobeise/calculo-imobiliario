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

import { useEffect, useState } from "react";

export default function TabelaJurosCompostos({
  data,
  setCapitalFinal,
}: {
  data: {
    capitalInicial: number;
    taxaDeJuros: number;
    aporteMensal: number;
    linhas: number;
  };
  setCapitalFinal: (value: string) => void;
}) {
  interface Row {
    linha: number;
    capital: string;
    lucroMensal: string;
    aporteMensal: string;
    valorFinal: string;
  }

  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const rows = [];

    let capitalAcumulado = data.capitalInicial;

    for (let linha = 1; linha <= data.linhas; linha++) {
      const lucroMensal = (capitalAcumulado * data.taxaDeJuros) / 100;
      const valorFinal = capitalAcumulado + lucroMensal + data.aporteMensal;
      if (linha === data.linhas) setCapitalFinal(numeroParaReal(valorFinal));
      rows.push({
        linha,
        capital: numeroParaReal(capitalAcumulado),
        lucroMensal: numeroParaReal(lucroMensal),
        aporteMensal: numeroParaReal(data.aporteMensal),
        valorFinal: numeroParaReal(valorFinal),
      });

      capitalAcumulado = valorFinal;
    }

    setRows(rows);
  }, [data.capitalInicial, data.taxaDeJuros, data.aporteMensal, data.linhas]);

  return (
    <Card className="col-span-9">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="w-full">
            <TableHead>#</TableHead>
            <TableHead>Capital</TableHead>
            <TableHead>Rendimento</TableHead>
            <TableHead>Aporte</TableHead>
            <TableHead>Valor FInal</TableHead>
          </TableHeader>

          <TableBody>
            {rows.map((item) => (
              <TableRow key={item.linha}>
                <TableCell>{item.linha}</TableCell>
                <TableCell>{item.capital}</TableCell>
                <TableCell>{item.lucroMensal}</TableCell>
                <TableCell>{item.aporteMensal}</TableCell>
                <TableCell>{item.valorFinal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
