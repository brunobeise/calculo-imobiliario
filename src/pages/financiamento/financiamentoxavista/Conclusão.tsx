import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
import { caseDataContext } from "./Context";

interface ConclusãoProps {
  context: "financing" | "inCash";
}

export default function Conclusão(props: ConclusãoProps) {
  const { propertyData } = useContext(propertyDataContext);
  const { caseData } = useContext(caseDataContext);

  const {
    finalYear,
    monthlyIncome,

    personalBalance,
    financingFees,
    downPayment,
    propertyValue,
    appreciatedPropertyValue,
    investedEquity,
    rentValue,
  } = propertyData;

  const calcCompraDoImovel = () => {
    if (props.context === "financing") return downPayment + financingFees;
    else return propertyValue;
  };

  const calcTotalInvestido = () => {
    if (props.context === "financing")
      return personalBalance - (downPayment + financingFees);
    else return personalBalance - propertyValue;
  };

  const rendaMensal = () => {
    return (
      rentValue[rentValue.length - 1] * 1.08 +
      (investedEquity * monthlyIncome) / 100
    );
  };

  return (
    <Card
      id="conclusao"
      className="col-span-12 md:col-span-6 lg:col-span-4 order-last lg:order-none"
    >
      <CardTitle className="mt-5">
        <h2 className="text-xl text-center mb-2">Conclusão</h2>
      </CardTitle>
      <CardContent className="grid grid-rows gap-5">
        <Table>
          <TableHeader>
            <TableHead>Compra do imóvel</TableHead>
            <TableHead>Aplicação</TableHead>
            <TableHead>Total</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{numeroParaReal(calcCompraDoImovel()!)}</TableCell>
              <TableCell>{numeroParaReal(calcTotalInvestido()!)}</TableCell>
              <TableCell>
                {numeroParaReal(calcCompraDoImovel()! + calcTotalInvestido()!)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <p className="text-md my-2 text-center">
          Resultado após {finalYear} anos:
        </p>

        <Table>
          <TableHeader>
            <TableHead>Valor do imóvel</TableHead>
            <TableHead>Total Aplicação</TableHead>
            <TableHead>Saldo Devedor</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{numeroParaReal(appreciatedPropertyValue)}</TableCell>
              <TableCell>
                {props.context === "financing"
                  ? numeroParaReal(caseData.financing.investedEquityFinal)
                  : numeroParaReal(caseData.inCash.investedEquityFinal)}
              </TableCell>
              <TableCell>
                {props.context === "financing"
                  ? numeroParaReal(propertyData.outstandingBalance)
                  : numeroParaReal(0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table>
          <TableHeader>
            <TableHead>Patrimônio Final</TableHead>
            <TableHead>Renda Mensal</TableHead>
            <TableHead>Lucro na operação</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-black font-bold">
                {props.context === "financing"
                  ? numeroParaReal(caseData.financing.totalFinalEquity)
                  : numeroParaReal(caseData.inCash.totalFinalEquity)}
              </TableCell>
              <TableCell>{numeroParaReal(rendaMensal())}</TableCell>
              <TableCell>
                {props.context === "financing"
                  ? numeroParaReal(caseData.financing.totalProfit)
                  : numeroParaReal(caseData.inCash.totalProfit)}
                <p>
                  {props.context === "financing"
                    ? "(" +
                      caseData.financing.totalProfitPercent.toFixed(2) +
                      "%)"
                    : "(" +
                      caseData.inCash.totalProfitPercent.toFixed(2) +
                      "%)"}
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
