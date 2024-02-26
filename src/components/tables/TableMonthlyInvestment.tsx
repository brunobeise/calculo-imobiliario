/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { propertyDataContext } from "@/PropertyDataContext";
import { numeroParaReal } from "@/lib/formatter";
import { ScrollArea } from "../ui/scroll-area";

interface TableMonthlyInvestmentProps {
  colspan?: number;
  border?: boolean;
  context: "inCash" | "financing";
}

export default function TableMonthlyInvestment(
  props: TableMonthlyInvestmentProps
) {
  const { propertyData } = useContext(propertyDataContext);

  const [rows, setRows] = useState<
    {
      finalValue: string;
      month: number;
      rentalValue: string;
    }[]
  >([]);

  useEffect(() => {
    const rows: {
      finalValue: string;
      month: number;
      rentalValue: string;
    }[] = [];

    let rentValue = propertyData.initialRentValue;

    for (let month = 1; month <= propertyData.finalYear * 12; month++) {
      const indiceAno = Math.floor((month - 1) / 12);

      // Atualiza o valor do rentalValue com base no índice do ano
      if (month % 12 === 1 || month === 1) {
        rentValue = propertyData.rentValue[indiceAno];
      }

      // Calcula o montante final com base no contexto
      const montanteFinal =
        props.context === "financing"
          ? rentValue - propertyData.installmentValue
          : rentValue;

      // Adiciona a nova linha com o mês, valor do rentalValue formatado e o valor final formatado
      rows.push({
        month,
        rentalValue: numeroParaReal(rentValue), // Supondo que numeroParaReal formata o valor
        finalValue: numeroParaReal(montanteFinal), // Supondo que numeroParaReal formata o valor
      });
    }

    setRows(rows); // Atualiza o estado com as novas rows
  }, [
    propertyData.initialRentValue,
    propertyData.rentValue,
    propertyData.installmentValue,
    propertyData.finalYear,
    props.context,
  ]);

  return (
    <Card
      className={
        `w-full ${
          props.colspan
            ? ` col-span-${props.colspan} md:col-span-${
                props.colspan / 2
              } lg:col-span-${Math.ceil(props.colspan / 3)} 
           `
            : ""
        }` + ` ${props.border ? `` : ` border-0 `}`
      }
    >
      <CardTitle className="mt-5">
        <h2 className="text-xl text-center ">Montante por mês</h2>
        <p className="text-xs mb-5 text-center">(Aluguel - Parcela)</p>
      </CardTitle>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table className="w-full text-left">
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead>Aluguel</TableHead>
                <TableHead>Parcela</TableHead>
                <TableHead>Valor Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows?.map((item) => (
                <TableRow key={item.month}>
                  <TableCell>{item.month}</TableCell>

                  <TableCell>{item.rentalValue}</TableCell>
                  <TableCell>
                    {numeroParaReal(propertyData.installmentValue)}
                  </TableCell>
                  <TableCell>{item.finalValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
