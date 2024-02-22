/* eslint-disable react-hooks/exhaustive-deps */
import { formatterReal, numeroParaReal, realParaNumero } from "@/lib/formatter";
import { useState, useContext, useEffect } from "react";
import { PropertyData, propertyDataContext } from "../PropertyDataContext";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import {
  calcOutsadingBalance,
  calcinstallmentValue,
  calcValorizaçãoAluguel,
  calcPropertyValuation,
} from "@/lib/calcs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardTitle } from "./ui/card";
import InputPercent from "./ui/InputPercent";
import InputYears from "./ui/inputYears";

export default function PropertyDataCard() {
  const { propertyData, setpropertyData } = useContext(propertyDataContext);

  const {
    finalYear,
    monthlyIncome,
    outstandingBalance,
    personalBalance,
    interestRate,
    financingFees,
    downPayment,
    propertyValue,
    initialRentValue,
    installmentValue,
    propertyAppreciationRate,
    financingYears,
  } = propertyData;

  const [propertyValueField, setpropertyValueField] = useState(
    numeroParaReal(propertyValue)
  );
  const [downPaymentField, setdownPaymentField] = useState(
    numeroParaReal(downPayment)
  );
  const [taxasFincancimentoField, settaxasFincancimentoField] = useState(
    numeroParaReal(financingFees)
  );
  const [saldoPessoalField, setSaldoPessoalField] = useState(
    numeroParaReal(personalBalance)
  );
  const [installmentValueField, setinstallmentValueField] = useState(
    numeroParaReal(installmentValue)
  );
  const [initialRentValueField, setinitialRentValueField] = useState(
    numeroParaReal(initialRentValue)
  );

  const [saldoDevedorField, setSaldoDevedorField] = useState(
    numeroParaReal(outstandingBalance)
  );

  const handleChangeReal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.value;
    const id = event.target.id;
    const valorFormatado = formatterReal(valor);

    setpropertyData(id as keyof PropertyData, realParaNumero(valorFormatado));
    if (id === "propertyValue") setpropertyValueField(valorFormatado);
    if (id === "downPayment") setdownPaymentField(valorFormatado);
    if (id === "financingFees") settaxasFincancimentoField(valorFormatado);
    if (id === "personalBalance") setSaldoPessoalField(valorFormatado);
    if (id === "installmentValue") setinstallmentValueField(valorFormatado);
    if (id === "initialRentValue") setinitialRentValueField(valorFormatado);
    if (id === "outstandingBalance") setSaldoDevedorField(valorFormatado);
  };

  useEffect(() => {
    const aluguelValorizado = calcValorizaçãoAluguel(
      initialRentValue,
      finalYear
    );

    const propertyValueValorizado = calcPropertyValuation(
      propertyValue,
      propertyAppreciationRate,
      finalYear
    );

    const installmentValue = calcinstallmentValue(
      propertyValue - downPayment,
      interestRate,
      financingYears
    );

    const outstandingBalance = calcOutsadingBalance(
      propertyValue - downPayment,
      interestRate,
      financingYears,
      12 * finalYear
    );

    setpropertyData("rentValue", aluguelValorizado);
    setpropertyData("appreciatedPropertyValue", propertyValueValorizado);
    setpropertyData("installmentValue", installmentValue);
    setpropertyData("outstandingBalance", outstandingBalance);

    setinstallmentValueField(numeroParaReal(installmentValue));
    setSaldoDevedorField(numeroParaReal(outstandingBalance));
  }, [
    finalYear,
    initialRentValue,
    propertyValue,
    downPayment,
    interestRate,
    propertyAppreciationRate,
    financingYears,
  ]);

  const location = useLocation();
  if (location.pathname === "/") return <BemVindo />;

  const execptionRoutes = ["/juroscompostos", "/relatorio"];

  const isException = execptionRoutes.some((route) =>
    location.pathname.includes(route)
  );

  if (isException) return <></>;

  return (
    <>
      <Accordion
        className="mt-24 sm:mt-10 md:p-2 lg:p-5"
        type="single"
        collapsible
        defaultValue="item-1"
      >
        <AccordionItem className="" value="item-1">
          <AccordionTrigger>Dados do imóvel e financiamento</AccordionTrigger>
          <AccordionContent className="!p-0">
            <form className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:mb-[-1rem]">
              <div className="grid grid-cols-1 gap-2">
                <Card>
                  <CardTitle>
                    <h2 className="text-xl text-center my-3 ">
                      Informações do Imóvel
                    </h2>
                  </CardTitle>

                  <CardContent className="grid grid-cols-1  gap-6">
                    <div>
                      <Label htmlFor="propertyValue">Saldo Disponível:</Label>
                      <Input
                        onChange={handleChangeReal}
                        type="text"
                        id="personalBalance"
                        value={saldoPessoalField}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="propertyValue">Valor do imóvel:</Label>
                      <Input
                        onChange={handleChangeReal}
                        type="text"
                        id="propertyValue"
                        value={propertyValueField}
                        required
                      />
                    </div>
                    <div className="relative">
                      <Label htmlFor="valorizaçãoDoImóvel">
                        Valorização anual do imóvel:
                      </Label>
                      <InputPercent
                        onChangeValue={(v) =>
                          setpropertyData("propertyAppreciationRate", v)
                        }
                        type="number"
                        step={0.1}
                        id="valorizaçãoDoImóvel"
                        value={propertyAppreciationRate}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardTitle>
                    <h2 className="text-xl text-center my-3 ">
                      Rendimento e Aluguel
                    </h2>
                  </CardTitle>

                  <CardContent className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="propertyValue">
                        Valor Inicial Aluguel:
                      </Label>
                      <Input
                        className=""
                        onChange={handleChangeReal}
                        type="text"
                        id="initialRentValue"
                        value={initialRentValueField}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="taxarendimento">Rendimento mensal:</Label>

                      <InputPercent
                        onChangeValue={(v) =>
                          setpropertyData("monthlyIncome", v)
                        }
                        type="number"
                        step={0.1}
                        id="taxarendimento"
                        value={monthlyIncome}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardTitle>
                  <h2 className="text-xl text-center my-3 ">
                    Informações do Financiamento
                  </h2>
                </CardTitle>

                <CardContent className="grid grid-cols-1 h-[90%] justify-between gap-6">
                  <div>
                    <Label htmlFor="propertyValue">Valor da Entrada:</Label>
                    <div className="relative">
                      <Input
                        onChange={handleChangeReal}
                        type="text"
                        id="downPayment"
                        value={downPaymentField}
                        required
                      />
                      <span className="text-sm absolute top-[50%] translate-y-[-50%] right-[1rem]">
                        {((downPayment / propertyValue) * 100).toFixed(2) + "%"}
                      </span>
                    </div>

                    <div className="relative mt-4">
                      <Slider
                        onValueChange={(e) => {
                          setpropertyData(
                            "downPayment",
                            (propertyValue * e[0]) / 10
                          );
                          setdownPaymentField(
                            formatterReal((propertyValue * 100 * e[0]) / 10)
                          );
                        }}
                        id="labels-range-Input"
                        defaultValue={[2]}
                        value={[(downPayment / propertyValue) * 10]}
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
                    <Label htmlFor="financingFees">
                      Taxas do fincancimento:
                    </Label>
                    <Input
                      onChange={handleChangeReal}
                      type="text"
                      id="financingFees"
                      value={taxasFincancimentoField}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor="interestRate">CET financiamento</Label>
                    <InputPercent
                      onChangeValue={(v) => {
                        if (v > 0) setpropertyData("interestRate", v);
                      }}
                      step={0.1}
                      id="interestRate"
                      type="number"
                      value={interestRate}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="financingFees">Total Investido:</Label>
                      <Input
                        onChange={() => {}}
                        type="text"
                        id="financingFees"
                        value={numeroParaReal(downPayment + financingFees)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="financingFees">Total Financiado:</Label>
                      <Input
                        onChange={() => {}}
                        type="text"
                        id="financingFees"
                        value={numeroParaReal(propertyValue - downPayment)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardTitle>
                  <h2 className="text-xl text-center my-3 ">
                    Cálculo do Financiamento
                  </h2>
                </CardTitle>
                <CardContent className="grid grid-cols-1 h-[90%] gap-6">
                  <div>
                    <Label htmlFor="anos">Calcular até:</Label>
                    <InputYears
                      onChangeValue={(v) => {
                        if (v > 0) setpropertyData("finalYear", v);
                      }}
                      step={1}
                      id="anos"
                      type="number"
                      value={finalYear}
                    />
                  </div>

                  <div>
                    <Label htmlFor="propertyValue">Valor Parcela:</Label>
                    <Input
                      onChange={handleChangeReal}
                      type="text"
                      id="installmentValue"
                      value={installmentValueField}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="outstandingBalance">
                      Saldo devedor em {finalYear} anos:
                    </Label>
                    <Input
                      onChange={handleChangeReal}
                      id="outstandingBalance"
                      value={saldoDevedorField}
                    />
                  </div>

                  <div>
                    <Label htmlFor="anosfinanciamento">
                      Tempo do financiamento (anos)
                    </Label>
                    <Input
                      onChange={(e) => {
                        if (Number(e.target.value))
                          setpropertyData(
                            "financingYears",
                            Number(e.target.value)
                          );
                      }}
                      id="anosfinanciamento"
                      type="number"
                      value={financingYears}
                    />
                  </div>
                </CardContent>
              </Card>
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
