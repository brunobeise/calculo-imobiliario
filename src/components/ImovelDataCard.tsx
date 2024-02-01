/* eslint-disable react-hooks/exhaustive-deps */
import { formatterReal, numeroParaReal, realParaNumero } from "@/lib/formatter";
import { useState, useContext, useEffect } from "react";
import { ImovelData, ImovelDataContext } from "../imovelDataContext";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import {
  calcSaldoDevedor,
  calcValorParcela,
  calcValorizaçãoAluguel,
  calcValorizaçãoImóvel,
} from "@/lib/calcs";
import TypographyH3 from "./ui/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useLocation } from "react-router-dom";

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
    anosFinanciamento,
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
      taxaDeJuros,
      anosFinanciamento
    );

    const saldoDevedor = calcSaldoDevedor(
      valorImovel - valorEntrada,
      taxaDeJuros,
      anosFinanciamento,
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
    anosFinanciamento,
  ]);

  const location = useLocation();
  if (location.pathname === "/") return <BemVindo />;

  return (
    <>
      <Accordion
        className="mt-24 sm:mt-10 md:p-2 lg:p-5"
        type="single"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Dados do imóvel e financiamento</AccordionTrigger>
          <AccordionContent className="mt-2">
            <form className="grid grid-cols-1 gap-8">
              <TypographyH3 text={"Informações do Imóvel"} />
              <div className="grid grid-cols-1 lg:grid-cols-3  gap-6">
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
                <div className="relative">
                  <Label htmlFor="valorizaçãoDoImóvel">
                    Valorização anual do imóvel:
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
                  <span className={`absolute top-[1.85rem] left-[2.5rem]`}>
                    %
                  </span>
                </div>
              </div>

              <TypographyH3 text={"Informações do Financiamento"} />

              <div className="grid grid-cols-1 lg:grid-cols-3  gap-6">
                <div>
                  <Label htmlFor="valorImovel">Valor da Entrada:</Label>
                  <div className="relative">
                    <Input
                      onChange={handleChangeReal}
                      type="text"
                      id="valorEntrada"
                      value={valorEntradaField}
                      required
                    />
                    <span className="text-sm absolute top-[50%] translate-y-[-50%] right-[1rem]">
                      {((valorEntrada / valorImovel) * 100).toFixed(2) + "%"}
                    </span>
                  </div>

                  <div className="relative mb-5 mt-4">
                    <Slider
                      onValueChange={(e) => {
                        setImovelData(
                          "valorEntrada",
                          (valorImovel * e[0]) / 10
                        );
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

                <div>
                  <Label htmlFor="taxasFincancimento">
                    Taxas do fincancimento:
                  </Label>
                  <Input
                    onChange={handleChangeReal}
                    type="text"
                    id="taxasFincancimento"
                    value={taxasFincancimentoField}
                    required
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="taxadejuros">CET financiamento</Label>
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
                  <span className={`absolute top-[1.85rem] left-[2.5rem]`}>
                    %
                  </span>
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

              <TypographyH3 text={"Cálculo do Financiamento"} />
              <div className="grid grid-cols-1 lg:grid-cols-3  gap-6">
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

                <div>
                  <Label htmlFor="anosfinanciamento">
                    Tempo do financiamento
                  </Label>
                  <Input
                    onChange={(e) => {
                      if (Number(e.target.value))
                        setImovelData(
                          "anosFinanciamento",
                          Number(e.target.value)
                        );
                    }}
                    id="anosfinanciamento"
                    type="number"
                    value={anosFinanciamento}
                  />
                </div>
              </div>

              <TypographyH3 text={"Rendimento e Aluguel"} />

              <div className="grid grid-cols-2 gap-6">
                <div>
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
                  <Label htmlFor="taxarendimento">Rendimento mensal:</Label>
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
                  <span className={`absolute top-[1.85rem] left-[2.5rem]`}>
                    %
                  </span>
                </div>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );

  function BemVindo() {
    return (
      <div className="absolute top-[50%] w-full left-[50%] text-center translate-y-[-50%] translate-x-[-50%]">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Bem vindo ao sistema Cálculo imobiliário!
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Selecione um contexto no canto superior esquerdo para continuar
        </p>
      </div>
    );
  }
}
