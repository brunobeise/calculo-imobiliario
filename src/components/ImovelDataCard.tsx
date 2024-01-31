/* eslint-disable react-hooks/exhaustive-deps */
import { formatterReal, numeroParaReal, realParaNumero } from "@/lib/formatter";
import { useState, useContext, useEffect } from "react";
import { ImovelData, ImovelDataContext } from "../imovelDataContext";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import {
  calcSaldoDevedor,
  calcValorParcela,
  calcValorizaçãoAluguel,
  calcValorizaçãoImóvel,
} from "@/lib/calcs";

export default function CardDadosImóvel() {
  const { imovelData, setImovelData } = useContext(ImovelDataContext);
  const {
    anoFinal,
    rendimentoMensal,
    saldoDevedor,
    saldoPessoal,
    taxaDeJuros,
    taxasFincancimento,
    valorEntrada,
    valorImovel,
    valorInicialAluguel,
    valorParcela,
    taxaValorizaçãoDoImovel,
  } = imovelData;

  // const [lockMap, setLockMap] = useState({ saldoDevedor: false });

  const [valorImovelField, setValorImovelField] = useState(
    numeroParaReal(valorImovel)
  );
  const [valorEntradaField, setvalorEntradaField] = useState(
    numeroParaReal(valorEntrada)
  );
  const [taxasFincancimentoField, settaxasFincancimentoField] = useState(
    numeroParaReal(taxasFincancimento)
  );
  const [saldoPessoalField, setSaldoPessoalField] = useState(
    numeroParaReal(saldoPessoal)
  );
  const [valorParcelaField, setValorParcelaField] = useState(
    numeroParaReal(valorParcela)
  );
  const [valorInicialALuguelField, setValorInicialALuguelField] = useState(
    numeroParaReal(valorInicialAluguel)
  );

  const [saldoDevedorField, setSaldoDevedorField] = useState(
    numeroParaReal(saldoDevedor)
  );

  const handleChangeReal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.value;
    const id = event.target.id;
    const valorFormatado = formatterReal(valor);

    setImovelData(id as keyof ImovelData, realParaNumero(valorFormatado));
    if (id === "valorImovel") setValorImovelField(valorFormatado);
    if (id === "valorEntrada") setvalorEntradaField(valorFormatado);
    if (id === "taxasFincancimento") settaxasFincancimentoField(valorFormatado);
    if (id === "saldoPessoal") setSaldoPessoalField(valorFormatado);
    if (id === "valorParcela") setValorParcelaField(valorFormatado);
    if (id === "valorInicialAluguel")
      setValorInicialALuguelField(valorFormatado);
    if (id === "saldoDevedor") setSaldoDevedorField(valorFormatado);
  };

  useEffect(() => {
    const aluguelValorizado = calcValorizaçãoAluguel(
      valorInicialAluguel,
      anoFinal
    );

    const valorImovelValorizado = calcValorizaçãoImóvel(
      valorImovel,
      taxaValorizaçãoDoImovel,
      anoFinal
    );

    const valorParcela = calcValorParcela(
      valorImovel - valorEntrada,
      taxaDeJuros
    );

    const saldoDevedor = calcSaldoDevedor(
      valorImovel - valorEntrada,
      taxaDeJuros,
      35,
      12 * anoFinal
    );

    setImovelData("valorAluguel", aluguelValorizado);
    setImovelData("valorImóvelValorizado", valorImovelValorizado);
    setImovelData("valorParcela", valorParcela);
    setImovelData("saldoDevedor", saldoDevedor);

    setValorParcelaField(numeroParaReal(valorParcela));
    setSaldoDevedorField(numeroParaReal(saldoDevedor));
  }, [
    anoFinal,
    valorInicialAluguel,
    valorImovel,
    valorEntrada,
    taxaDeJuros,
    taxaValorizaçãoDoImovel,
  ]);

  return (
    <>
      <Card className="col-span-12 mt-10 mx-2 p-5">
        <form className="grid grid-cols-3 gap-8">
          <div className="grid grid-flow-row gap-6">
            <div>
              <Label htmlFor="valorImovel">Saldo Disponível:</Label>
              <Input
                onChange={handleChangeReal}
                type="text"
                id="saldoPessoal"
                value={saldoPessoalField}
                required
              />
            </div>

            <div>
              <Label htmlFor="valorImovel">Valor do imóvel:</Label>
              <Input
                onChange={handleChangeReal}
                type="text"
                id="valorImovel"
                value={valorImovelField}
                required
              />
            </div>

            <div>
              <Label htmlFor="valorImovel">Valor Parcela:</Label>
              <Input
                onChange={handleChangeReal}
                type="text"
                id="valorParcela"
                value={valorParcelaField}
                required
              />
            </div>
          </div>

          <div className="grid grid-flow-cols gap-6">
            <div className="col-span-2">
              <Label htmlFor="valorImovel">Valor Inicial Aluguel:</Label>
              <Input
                className=""
                onChange={handleChangeReal}
                type="text"
                id="valorInicialAluguel"
                value={valorInicialALuguelField}
                required
              />
            </div>

            <div className="relative">
              <Label htmlFor="taxarendimento">% Rendimento mensal:</Label>
              <Input
                onChange={(e) =>
                  setImovelData("rendimentoMensal", Number(e.target.value))
                }
                type="number"
                step={0.1}
                id="taxarendimento"
                value={rendimentoMensal}
                required
              />
              <span className={`absolute top-[1.85rem] left-[2.1rem]`}>%</span>
            </div>

            <div className="relative">
              <Label htmlFor="valorizaçãoDoImóvel">
                % Valorização anual do imóvel:
              </Label>
              <Input
                onChange={(e) =>
                  setImovelData(
                    "taxaValorizaçãoDoImovel",
                    Number(e.target.value)
                  )
                }
                type="number"
                step={0.1}
                id="valorizaçãoDoImóvel"
                value={taxaValorizaçãoDoImovel}
                required
              />
              <span className={`absolute top-[1.85rem] left-[2.1rem]`}>%</span>
            </div>

            <div className="relative">
              <Label htmlFor="taxadejuros">
                Taxa de juros anual financimento
              </Label>
              <Input
                onChange={(e) => {
                  if (Number(e.target.value) > 0)
                    setImovelData("taxaDeJuros", Number(e.target.value));
                }}
                step={0.1}
                id="taxadejuros"
                type="number"
                value={taxaDeJuros}
              />
              <span className={`absolute top-[1.85rem] left-[2.1rem]`}>%</span>
            </div>

            <div>
              <Label htmlFor="anos">Calcular até ... anos:</Label>
              <Input
                onChange={(e) => {
                  if (Number(e.target.value) > 0)
                    setImovelData("anoFinal", Number(e.target.value));
                }}
                id="anos"
                type="number"
                value={anoFinal}
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Label htmlFor="valorImovel">Valor da Entrada:</Label>
              <Input
                onChange={handleChangeReal}
                type="text"
                id="valorEntrada"
                value={valorEntradaField}
                required
              />
              <span className="text-sm absolute top-[2.5rem] right-[1rem]">
                {((valorEntrada / valorImovel) * 100).toFixed(2) + "%"}
              </span>
              <div className="relative mb-5 mt-4">
                <Slider
                  onValueChange={(e) => {
                    setImovelData("valorEntrada", (valorImovel * e[0]) / 10);
                    setvalorEntradaField(
                      formatterReal((valorImovel * 100 * e[0]) / 10)
                    );
                  }}
                  id="labels-range-Input"
                  defaultValue={[5]}
                  min={0}
                  max={10}
                />

                <span className="text-xs text-gray-500 dark:text-gray-400 absolute start-0 ">
                  0%
                </span>

                <span className="text-xs text-gray-500 dark:text-gray-400 absolute start-[95%]">
                  100%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="taxasFincancimento">
                  taxas do Fincancimento:
                </Label>
                <Input
                  onChange={handleChangeReal}
                  type="text"
                  id="taxasFincancimento"
                  value={taxasFincancimentoField}
                  required
                />
              </div>

              <div>
                <Label htmlFor="taxasFincancimento">Total Investido:</Label>
                <Input
                  onChange={() => {}}
                  type="text"
                  id="taxasFincancimento"
                  value={numeroParaReal(valorEntrada + taxasFincancimento)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="saldoDevedor">
                  Saldo devedor em {anoFinal} anos:
                </Label>
                <Input
                  onChange={handleChangeReal}
                  id="saldoDevedor"
                  value={saldoDevedorField}
                />
              </div>

              <div>
                <Label htmlFor="taxasFincancimento">Total Financiado:</Label>
                <Input
                  onChange={() => {}}
                  type="text"
                  id="taxasFincancimento"
                  value={numeroParaReal(valorImovel - valorEntrada)}
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}
