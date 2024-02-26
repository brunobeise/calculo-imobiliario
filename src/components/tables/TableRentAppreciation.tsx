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
import { numeroParaReal } from "@/lib/formatter";
import { propertyDataContext } from "@/PropertyDataContext";

import { useEffect, useState } from "react";
import { useContext } from "react";

interface TableRentAppreciationProps {
  annualCollection?: boolean;
  title?: boolean;
  colspan?: number;
  text: "left" | "right" | "center";
  border?: boolean;
  maxHeight?: number;
}

export default function TableRentAppreciation(
  props: TableRentAppreciationProps
) {
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
      {props.title && (
        <CardTitle className="mt-5">
          <h2 className="text-xl text-center ">Valorização Aluguel</h2>
          <p className="text-xs mb-5 text-center">(inflação 8% ao ano)</p>
        </CardTitle>
      )}
      <CardContent>
        <ScrollArea className={`h-[${props.maxHeight}px]`}>
          <Table className={`w-full text-${props.text}`}>
            <TableHeader>
              <TableHead>Ano</TableHead>
              <TableHead>Valor do Aluguel</TableHead>
              {props.annualCollection && (
                <TableHead>Arrecadação Anual</TableHead>
              )}
            </TableHeader>

            <TableBody>
              {rows?.map((item) => (
                <TableRow key={item.ano}>
                  <TableCell>{item.ano}</TableCell>
                  <TableCell>{item.rentValue}</TableCell>
                  {props.annualCollection && (
                    <TableCell>{item.arrecadacaoAnual}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
