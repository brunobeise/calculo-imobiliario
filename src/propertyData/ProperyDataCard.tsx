/* eslint-disable react-hooks/exhaustive-deps */
import { formatterReal, numeroParaReal, realParaNumero } from "@/lib/formatter";
import { useState, useContext, useEffect } from "react";
import {
  PropertyData,
  propertyDataContext,
} from "../propertyData/PropertyDataContext";
import { calcOutstandingBalance, calcInstallmentValue } from "@/lib/calcs";
import { Checkbox, FormLabel, Input, Sheet, Slider } from "@mui/joy";

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

  const handleChangeBoolean = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    const id = event.target.id;

    setpropertyData(id as keyof PropertyData, value);
  };

  useEffect(() => {
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

    setpropertyData("installmentValue", installmentValue);
    setpropertyData("outstandingBalance", outstandingBalance);

    setpropertyValueField(numeroParaReal(propertyValue));
    setdownPaymentField(numeroParaReal(downPayment));
    settaxasFincancimentoField(numeroParaReal(financingFees));
    settaxasAVistaField(numeroParaReal(inCashFees));
    setSaldoPessoalField(numeroParaReal(personalBalance));
    setinstallmentValueField(numeroParaReal(installmentValue));
    setinitialRentValueField(numeroParaReal(initialRentValue));
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
              {excludeInputByRoute(["/planejamentofinanciamento"]) && (
                <div>
                  <FormLabel htmlFor="propertyValue">
                    Saldo Disponível:
                  </FormLabel>
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
                <FormLabel htmlFor="propertyValue">Valor do imóvel:</FormLabel>
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
                <FormLabel htmlFor="valorizaçãoDoImóvel">
                  Valorização anual do imóvel:
                </FormLabel>
                <Input
                  onChange={(v) =>
                    setpropertyData(
                      "propertyAppreciationRate",
                      Number(v.target.value)
                    )
                  }
                  endDecorator={"%"}
                  slotProps={{
                    input: {
                      min: 0.1,
                      step: 0.1,
                    },
                  }}
                  type="number"
                  id="valorizaçãoDoImóvel"
                  defaultValue={propertyAppreciationRate}
                  required
                />
              </div>
            </div>
          </Sheet>

          <Sheet>
            <h2 className="text-xl text-center my-3 font-bold ">
              Rendimento e Aluguel
            </h2>

            <div className="grid grid-cols-2 gap-6 items-center">
              <div>
                <FormLabel htmlFor="propertyValue">
                  Valor Inicial Aluguel:
                </FormLabel>
                <Input
                  disabled={propertyData.isHousing}
                  variant="outlined"
                  className=""
                  onChange={handleChangeReal}
                  type="text"
                  id="initialRentValue"
                  value={initialRentValueField}
                  required
                />
              </div>

              <div className="mt-6">
                <Checkbox
                  id="isHousing"
                  slotProps={{}}
                  onChange={handleChangeBoolean}
                  checked={propertyData.isHousing}
                  label="É Moradia"
                />
              </div>

              <div
                className={
                  !excludeInputByRoute(["/planejamentofinanciamento"])
                    ? "col-span-2"
                    : ""
                }
              >
                <FormLabel htmlFor="taxarendimento">
                  Rendimento aplicação no mercado financeiro:
                </FormLabel>

                <Input
                  onChange={(v) =>
                    setpropertyData("monthlyYieldRate", Number(v.target.value))
                  }
                  type="number"
                  endDecorator={"%"}
                  slotProps={{
                    input: {
                      min: 0.1,
                      step: 0.1,
                    },
                  }}
                  id="taxarendimento"
                  value={monthlyYieldRate}
                  required
                />
              </div>

              <div>
                {excludeInputByRoute(["/planejamentofinanciamento"]) && (
                  <>
                    <FormLabel className="text-xs" htmlFor="taxarendimento">
                      Rendimento montante do aluguel:
                    </FormLabel>

                    <Input
                      onChange={(v) =>
                        setpropertyData(
                          "rentMonthlyYieldRate",
                          Number(v.target.value)
                        )
                      }
                      type="number"
                      endDecorator={"%"}
                      slotProps={{
                        input: {
                          min: 0.1,
                          step: 0.1,
                        },
                      }}
                      id="taxarendimento"
                      value={rentMonthlyYieldRate}
                      required
                    />
                  </>
                )}
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
              <FormLabel htmlFor="propertyValue">Valor da Entrada:</FormLabel>
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
              <FormLabel htmlFor="financingFees">
                Taxas do financiamento:
              </FormLabel>
              <Input
                variant="outlined"
                onChange={handleChangeReal}
                type="text"
                id="financingFees"
                value={taxasFincancimentoField}
                required
              />
            </div>

            {excludeInputByRoute(["/planejamentofinanciamento"]) && (
              <div>
                <FormLabel htmlFor="inCashFees">Taxas á vista:</FormLabel>
                <Input
                  variant="outlined"
                  onChange={handleChangeReal}
                  type="text"
                  id="inCashFees"
                  value={taxasAVistaField}
                  required
                />
              </div>
            )}

            <div className="relative">
              <FormLabel htmlFor="interestRate">
                Juros nominal financiamento:
              </FormLabel>
              <Input
                onChange={(v) => {
                  setpropertyData("interestRate", Number(v.target.value));
                }}
                endDecorator={"%"}
                slotProps={{
                  input: {
                    min: 0.1,
                    step: 0.1,
                  },
                }}
                id="interestRate"
                type="number"
                value={interestRate}
              />
            </div>

            <div>
              <FormLabel htmlFor="financingFees">Total Investido:</FormLabel>
              <Input
                disabled
                variant="outlined"
                onChange={() => {}}
                type="text"
                id="financingFees"
                value={numeroParaReal(downPayment + financingFees + inCashFees)}
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
              <FormLabel htmlFor="anos">Calcular até:</FormLabel>

              <Input
                endDecorator={"Anos"}
                type="number"
                onChange={(v) => {
                  if (Number(v.target.value) > 0)
                    setpropertyData("finalYear", Number(v.target.value));
                }}
                defaultValue={finalYear}
                slotProps={{
                  input: {
                    min: 1,
                    max: 35,
                    step: 1,
                  },
                }}
              />
            </div>

            <div>
              <FormLabel htmlFor="propertyValue">Valor da Parcela:</FormLabel>
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
              <FormLabel htmlFor="outstandingBalance">
                Saldo devedor em {finalYear} anos:
              </FormLabel>
              <Input
                variant="outlined"
                onChange={handleChangeReal}
                id="outstandingBalance"
                value={saldoDevedorField}
              />
            </div>

            <div>
              <FormLabel htmlFor="anosfinanciamento">
                Tempo do financiamento:
              </FormLabel>
              <Input
                id="anosfinanciamento"
                endDecorator={"Anos"}
                type="number"
                onChange={(v) => {
                  if (Number(v.target.value) > 0)
                    setpropertyData("financingYears", Number(v.target.value));
                }}
                defaultValue={financingYears}
                slotProps={{
                  input: {
                    min: 1,
                    max: 35,
                    step: 1,
                  },
                }}
              />
            </div>

            <div>
              <FormLabel htmlFor="financingFees">Total Financiado:</FormLabel>
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
}
