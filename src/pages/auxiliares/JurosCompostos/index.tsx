import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatterReal, numeroParaReal, realParaNumero } from "@/lib/formatter";
import { useState } from "react";
import TabelaJurosCompostos from "./TabelaJurosCompostos";

export default function JurosCompostos() {
  const [capitalInicial, setCapitalInicial] = useState(numeroParaReal(10000));
  const [aporteMensal, setAporteMensal] = useState(numeroParaReal(500));
  const [capitalFinal, setCapitalFinal] = useState("");

  const [data, setData] = useState<{
    capitalInicial: number;
    taxaDeJuros: number;
    aporteMensal: number;
    linhas: number;
  }>({
    capitalInicial: 10000,
    taxaDeJuros: 1,
    aporteMensal: 500,
    linhas: 60,
  });

  console.log(data);
  console.log(capitalInicial);

  return (
    <div className="grid grid-cols-12 mt-10 pt-10 px-10">
      <div className="col-span-3 max-h-[350px] grid grid-flow-rows justify-end pe-10">
        <div>
          <Label>Capital Inicial:</Label>
          <Input
            className="w-[200px]"
            onChange={(e) => {
              const value = e.target.value;
              const valorFormatado = formatterReal(value);
              setCapitalInicial(valorFormatado);
              setData({
                ...data,
                capitalInicial: realParaNumero(valorFormatado),
              });
            }}
            type="text"
            value={capitalInicial}
          />
        </div>
        <div>
          <Label>Taxa de Juros:</Label>
          <Input
            step={0.1}
            className="w-[200px]"
            onChange={(e) => {
              setData({
                ...data,
                taxaDeJuros: Number(e.target.value),
              });
            }}
            type="number"
            value={data.taxaDeJuros}
          />
        </div>
        <div>
          <Label>Aporte mensal:</Label>
          <Input
            className="w-[200px]"
            onChange={(e) => {
              const value = e.target.value;
              const valorFormatado = formatterReal(value);
              setAporteMensal(valorFormatado);
              setData({
                ...data,
                aporteMensal: realParaNumero(valorFormatado),
              });
            }}
            type="text"
            value={aporteMensal}
          />
        </div>
        <div>
          <Label>Linhas:</Label>
          <Input
            className="w-[200px]"
            onChange={(e) => {
              setData({
                ...data,
                linhas: Number(e.target.value),
              });
            }}
            type="number"
            value={data.linhas}
          />
        </div>
        <Label className="mt-5">Capital Final:</Label>
        {capitalFinal && <p className="font-bold">{capitalFinal}</p>}
      </div>
      <TabelaJurosCompostos
        setCapitalFinal={(value: string) => setCapitalFinal(value)}
        data={data}
      />
    </div>
  );
}
