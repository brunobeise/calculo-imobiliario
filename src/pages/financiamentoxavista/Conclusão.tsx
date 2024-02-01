import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImovelDataContext } from "@/imovelDataContext";
import { numeroParaReal } from "@/lib/formatter";

import { useContext } from "react";

interface ConclusãoProps {
  context: "financiamento" | "avista";
}

export default function Conclusão(props: ConclusãoProps) {
  const { imovelData } = useContext(ImovelDataContext);

  const {
    anoFinal,
    rendimentoMensal,
    saldoDevedor,
    saldoPessoal,
    taxasFincancimento,
    valorEntrada,
    valorImovel,
    valorImóvelValorizado,
    patrimonioInvestido,
    valorAluguel,
  } = imovelData;

  const calcCompraDoImovel = () => {
    if (props.context === "financiamento")
      return valorEntrada + taxasFincancimento;
    else return valorImovel;
  };

  const calcTotalInvestido = () => {
    if (props.context === "financiamento")
      return saldoPessoal - (valorEntrada + taxasFincancimento);
    else return saldoPessoal - valorImovel;
  };

  const calcSaldoDevedor = () => {
    if (props.context === "financiamento") return saldoDevedor;
    else return 0;
  };

  const calcPatrimônioTotal = () => {
    return valorImóvelValorizado + patrimonioInvestido - calcSaldoDevedor();
  };

  const rendaMensal = () => {
    return (
      valorAluguel[valorAluguel.length - 1] * 1.08 +
      (patrimonioInvestido * rendimentoMensal) / 100
    );
  };

  const lucroNaOperação = () => {
    return (
      (calcPatrimônioTotal() / (calcCompraDoImovel() + calcTotalInvestido())) *
        100 -
      100
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
            <TableHead>Investido</TableHead>
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
          Resultado após {anoFinal} anos:
        </p>

        <Table>
          <TableHeader>
            <TableHead>Valor do imóvel</TableHead>
            <TableHead>Valor investido</TableHead>
            <TableHead>Saldo Devedor</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{numeroParaReal(valorImóvelValorizado)}</TableCell>
              <TableCell>{numeroParaReal(patrimonioInvestido)}</TableCell>
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
              <TableCell>{lucroNaOperação().toFixed(2) + "%"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
