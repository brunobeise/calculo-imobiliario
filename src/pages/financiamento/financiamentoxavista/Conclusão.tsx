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

interface ConclusãoProps {
  context: "financiamento" | "avista";
}

export default function Conclusão(props: ConclusãoProps) {
  const { propertyData } = useContext(propertyDataContext);

  const {
    finalYear,
    monthlyIncome,
    outstandingBalance,
    personalBalance,
    financingFees,
    downPayment,
    propertyValue,
    appreciatedPropertyValue,
    investedEquity,
    rentValue,
  } = propertyData;

  const calcCompraDoImovel = () => {
    if (props.context === "financiamento") return downPayment + financingFees;
    else return propertyValue;
  };

  const calcTotalInvestido = () => {
    if (props.context === "financiamento")
      return personalBalance - (downPayment + financingFees);
    else return personalBalance - propertyValue;
  };

  const calcSaldoDevedor = () => {
    if (props.context === "financiamento") return outstandingBalance;
    else return 0;
  };

  const calcPatrimônioTotal = () => {
    return appreciatedPropertyValue + investedEquity - calcSaldoDevedor();
  };

  const rendaMensal = () => {
    return (
      rentValue[rentValue.length - 1] * 1.08 +
      (investedEquity * monthlyIncome) / 100
    );
  };

  const lucroNaOperação = () => {
    return (
      (calcPatrimônioTotal() / (calcCompraDoImovel() + calcTotalInvestido())) *
        100 -
      100
    );
  };

  const lucroNaOperaçãoReais = () => {
    return numeroParaReal(
      calcPatrimônioTotal() - (calcCompraDoImovel()! + calcTotalInvestido()!)
    );
  };

  return (
    <Card
      id="conclusao"
      className="col-span-12 md:col-span-6 lg:col-span-4 order-last lg:order-none"
    >
      <CardTitle className="mt-2">
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
              <TableCell>{numeroParaReal(investedEquity)}</TableCell>
              <TableCell>{numeroParaReal(calcSaldoDevedor())}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table>
          <TableHeader>
            <TableHead>Patrimônio Total</TableHead>
            <TableHead>Renda Mensal</TableHead>
            <TableHead>Lucro na operação</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-black font-bold">
                {numeroParaReal(calcPatrimônioTotal())}
              </TableCell>
              <TableCell>{numeroParaReal(rendaMensal())}</TableCell>
              <TableCell>
                {lucroNaOperaçãoReais() +
                  "  (" +
                  lucroNaOperação().toFixed(2) +
                  "%)"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
