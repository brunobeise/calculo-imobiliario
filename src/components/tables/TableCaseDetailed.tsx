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
import { useContext } from "react";
import { FinancingOrCashDetailedTable } from "@/pages/financiamento/financiamentoxavista/Context";

interface TabelaRendimentoProps {
  detailedTable: FinancingOrCashDetailedTable[];
}

export default function TableCaseDetailed(props: TabelaRendimentoProps) {
  const { propertyData } = useContext(propertyDataContext);

  const rows = props.detailedTable || [];

  return (
    <Card className="col-span-12">
      <CardTitle className="mt-5">
        <h2 className="text-xl text-center ">Investimento</h2>
        <p className="text-xs mb-5 text-center">
          rendimento {propertyData.monthlyYieldRate}% ao mês{" "}
        </p>
      </CardTitle>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table className="text-left">
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead>Capital Inicial</TableHead>
                <TableHead>Capital do Aluguel</TableHead>
                <TableHead>Valor do Aluguel</TableHead>
                <TableHead>Valor do Imóvel</TableHead>
                <TableHead>Rendimento do Capital</TableHead>
                <TableHead>Rendimento do Aluguel</TableHead>
                <TableHead>Saldo Devedor</TableHead>
                <TableHead>Patrimônio</TableHead>
                <TableHead>Lucro</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{numeroParaReal(item.initialCapital)}</TableCell>
                  <TableCell>
                    {numeroParaReal(item.rentalIncomeCapital)}
                  </TableCell>
                  <TableCell>{numeroParaReal(item.rentValue)}</TableCell>

                  <TableCell>{numeroParaReal(item.propertyValue)}</TableCell>
                  <TableCell>
                    {numeroParaReal(item.initialCapitalYield)}
                  </TableCell>
                  <TableCell>
                    {numeroParaReal(item.rentalIncomeYield)}
                  </TableCell>
                  <TableCell>
                    {numeroParaReal(item.outstandingBalance)}
                  </TableCell>
                  <TableCell>{numeroParaReal(item.finalValue)}</TableCell>

                  <TableCell>{numeroParaReal(item.monthlyProfit)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
