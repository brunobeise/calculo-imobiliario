/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { propertyDataContext } from "@/PropertyDataContext";
import { numeroParaReal } from "@/lib/formatter";
import { useContext, useEffect, useState } from "react";

interface TabelaRendimentoProps {
  context: "financing" | "inCash";
}

export default function TabelaRendimento(props: TabelaRendimentoProps) {
  const { propertyData, setpropertyData } = useContext(propertyDataContext);

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
      props.context === "financing"
        ? propertyData.personalBalance -
          propertyData.financingFees -
          propertyData.downPayment
        : propertyData.personalBalance - propertyData.propertyValue;

    let patrimonioFinal = 0;
    let rentValue = propertyData.initialRentValue;

    for (let mes = 1; mes <= propertyData.finalYear * 12; mes++) {
      const indiceAno = Math.floor((mes - 1) / 12);

      if (mes % 12 === 1 || mes === 1) {
        rentValue = propertyData.rentValue![indiceAno];
      }

      const montanteAluguel =
        props.context === "financing"
          ? Number((rentValue - propertyData.installmentValue).toFixed(2))
          : Number(rentValue.toFixed(2));

      let lucroMensal = 0;
      if (capitalAcumulado >= 0 || props.context === "financing") {
        lucroMensal = Number(
          ((capitalAcumulado * propertyData.monthlyIncome) / 100).toFixed(2)
        );
      }

      const valorFinal = Number(
        (capitalAcumulado + lucroMensal + montanteAluguel).toFixed(2)
      );

      if (mes === propertyData.finalYear * 12) patrimonioFinal = valorFinal;

      rows.push({
        mes,
        capital: numeroParaReal(capitalAcumulado),
        lucroMensal: numeroParaReal(lucroMensal),
        montanteAluguel: numeroParaReal(montanteAluguel),
        valorFinal: numeroParaReal(valorFinal),
      });

      capitalAcumulado = valorFinal;
    }

    setpropertyData("investedEquity", patrimonioFinal);
    setRows(rows);
  }, [
    propertyData.personalBalance,
    propertyData.financingFees,
    propertyData.downPayment,
    propertyData.installmentValue,
    propertyData.rentValue,
    propertyData.monthlyIncome,
    propertyData.finalYear,
    props.context,
  ]);

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardTitle className="mt-5">
        <h2 className="text-xl text-center ">Investimento</h2>
        <p className="text-xs mb-5 text-center">
          rendimento {propertyData.monthlyIncome}% ao mês{" "}
        </p>
      </CardTitle>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table className="text-left">
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead>Capital</TableHead>
                <TableHead>Rendimento</TableHead>
                <TableHead>Aporte</TableHead>
                <TableHead>Valor FInal</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.mes}>
                  <TableCell>{item.mes}</TableCell>
                  <TableCell>{item.capital}</TableCell>
                  <TableCell>{item.lucroMensal}</TableCell>
                  <TableCell>{item.montanteAluguel}</TableCell>
                  <TableCell>{item.valorFinal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
