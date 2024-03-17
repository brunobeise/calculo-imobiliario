/* eslint-disable react-hooks/exhaustive-deps */
import { formatterReal, numeroParaReal, realParaNumero } from "@/lib/formatter";
import { useState, useContext, useEffect } from "react";
import { PropertyData, propertyDataContext } from "../PropertyDataContext";
import { Label } from "./ui/label";
import {
  calcOutstandingBalance,
  calcInstallmentValue,
  calcPropertyValuation,
} from "@/lib/calcs";

import { useLocation } from "react-router-dom";
import InputPercent from "./ui/InputPercent";
import InputYears from "./ui/inputYears";
import { Input, Sheet, Slider } from "@mui/joy";

export default function PropertyDataCard() {
  const { propertyData, setpropertyData } = useContext(propertyDataContext);

  const {
    finalYear,
    monthlyYieldRate,
    outstandingBalance,
    personalBalance,
    interestRate,
    financingFees,
    inCashFees,
    downPayment,
    propertyValue,
    initialRentValue,
    installmentValue,
    propertyAppreciationRate,
    financingYears,
    rentMonthlyYieldRate,
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
  const [taxasAVistaField, settaxasAVistaField] = useState(
    numeroParaReal(inCashFees)
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
    if (id === "inCashFees") settaxasAVistaField(valorFormatado);
    if (id === "personalBalance") setSaldoPessoalField(valorFormatado);
    if (id === "installmentValue") setinstallmentValueField(valorFormatado);
    if (id === "initialRentValue") setinitialRentValueField(valorFormatado);
    if (id === "outstandingBalance") setSaldoDevedorField(valorFormatado);
  };

  useEffect(() => {


    const propertyValueValorizado = calcPropertyValuation(
      propertyValue,
      propertyAppreciationRate,
      finalYear
    );

    const installmentValue = calcInstallmentValue(
      propertyValue - downPayment,
      interestRate,
      financingYears
    );

    const outstandingBalance = calcOutstandingBalance(
      propertyValue - downPayment,
      interestRate,
      financingYears,
      12 * finalYear
    );

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

  const execptionRoutes = ["/juroscompostos", "/relatorio", "/user"];

  const isException = execptionRoutes.some((route) =>
    location.pathname.includes(route)
  );

  if (isException) return <></>;

  const excludeInputByRoute = (routes: string[]) => {
    return !location.pathname.includes(routes.join(" "));
  };

  return (
    <>
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:mb-[-1rem] mt-24 sm:mt-10 md:p-2 lg:p-5">
        <Sheet
          variant="outlined"
          color="neutral"
          className="grid grid-cols-1 gap-2 p-5"
        >
          <Sheet>
            <h2 className="text-xl text-center mb-3 font-bold">
              Informações do Imóvel
            </h2>

            <div className="grid grid-cols-1  gap-6">
              {excludeInputByRoute(["/financiamentoisoladoxavista"]) && (
                <div>
                  <Label htmlFor="propertyValue">Saldo Disponível:</Label>
                  <Input
                    variant="outlined"
                    onChange={handleChangeReal}
                    type="text"
                    id="personalBalance"
                    value={saldoPessoalField}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="propertyValue">Valor do imóvel:</Label>
                <Input
                  variant="outlined"
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
            </div>
          </Sheet>

          <Sheet>
            <h2 className="text-xl text-center my-3 font-bold ">
              Rendimento e Aluguel
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Label htmlFor="propertyValue">Valor Inicial Aluguel:</Label>
                <Input
                  variant="outlined"
                  className=""
                  onChange={handleChangeReal}
                  type="text"
                  id="initialRentValue"
                  value={initialRentValueField}
                  required
                />
              </div>

              <div>
                <Label htmlFor="taxarendimento">Rendimento aplicação:</Label>

                <InputPercent
                  onChangeValue={(v) => setpropertyData("monthlyYieldRate", v)}
                  type="number"
                  step={0.1}
                  id="taxarendimento"
                  value={monthlyYieldRate}
                  required
                />
              </div>

              <div>
                <Label className="text-xs" htmlFor="taxarendimento">
                  Rendimento montante do aluguel:
                </Label>

                <InputPercent
                  onChangeValue={(v) =>
                    setpropertyData("rentMonthlyYieldRate", v)
                  }
                  type="number"
                  step={0.1}
                  id="taxarendimento"
                  value={rentMonthlyYieldRate}
                  required
                />
              </div>
            </div>
          </Sheet>
        </Sheet>

        <Sheet variant="outlined" color="neutral" className="p-5">
          <h2 className="text-xl text-center mb-3 font-bold ">
            Informações do Financiamento
          </h2>

          <div className="grid grid-cols-1 h-[90%] justify-between gap-4">
            <div>
              <Label htmlFor="propertyValue">Valor da Entrada:</Label>
              <div className="relative">
                <Input
                  variant="outlined"
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

              <div className="relative mt-2">
                <Slider
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e: any) => {
                    const v = e.target?.value;
                    setpropertyData("downPayment", (propertyValue * v) / 10);
                    setdownPaymentField(
                      formatterReal((propertyValue * 100 * v) / 10)
                    );
                  }}
                  defaultValue={2}
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
              <Label htmlFor="financingFees">Taxas do fincancimento:</Label>
              <Input
                variant="outlined"
                onChange={handleChangeReal}
                type="text"
                id="financingFees"
                value={taxasFincancimentoField}
                required
              />
            </div>

            <div>
              <Label htmlFor="inCashFees">Taxas á vista:</Label>
              <Input
                variant="outlined"
                onChange={handleChangeReal}
                type="text"
                id="inCashFees"
                value={taxasAVistaField}
                required
              />
            </div>

            <div className="relative">
              <Label htmlFor="interestRate">Juros financiamento:</Label>
              <InputPercent
                onChangeValue={(v) => {
                  setpropertyData("interestRate", v);
                }}
                step={0.1}
                id="interestRate"
                type="number"
                value={interestRate}
              />
            </div>

            <div>
              <Label htmlFor="financingFees">Total Investido:</Label>
              <Input
                disabled
                variant="outlined"
                onChange={() => {}}
                type="text"
                id="financingFees"
                value={numeroParaReal(downPayment + financingFees)}
                required
              />
            </div>
          </div>
        </Sheet>

        <Sheet variant="outlined" color="neutral" className="p-5">
          <h2 className="text-xl text-center mb-3 font-bold ">
            Cálculo do Financiamento
          </h2>

          <div className="grid grid-cols-1 h-[90%] gap-6">
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
              <Label htmlFor="propertyValue">Valor da Parcela:</Label>
              <Input
                variant="outlined"
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
                variant="outlined"
                onChange={handleChangeReal}
                id="outstandingBalance"
                value={saldoDevedorField}
              />
            </div>

            <div>
              <Label htmlFor="anosfinanciamento">Tempo do financiamento:</Label>
              <InputYears
                onChangeValue={(value) => {
                  if (Number(value))
                    setpropertyData("financingYears", Number(value));
                }}
                id="anosfinanciamento"
                type="number"
                value={financingYears}
              />
            </div>

            <div>
              <Label htmlFor="financingFees">Total Financiado:</Label>
              <Input
                disabled
                variant="outlined"
                onChange={() => {}}
                type="text"
                id="financingFees"
                value={numeroParaReal(propertyValue - downPayment)}
                required
              />
            </div>
          </div>
        </Sheet>
      </form>
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
