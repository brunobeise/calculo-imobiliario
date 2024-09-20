/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import {
  PropertyData,
  propertyDataContext,
} from "../propertyData/PropertyDataContext";
import { calcOutstandingBalance, calcInstallmentValue } from "@/lib/calcs";
import { FormLabel, Input, Sheet, Slider } from "@mui/joy";
import React from "react";
import PercentageInput from "@/components/inputs/PercentageInput";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import BooleanInput from "@/components/inputs/BooleanInput";
import { toBRL } from "@/lib/formatter";
import InfoTooltip from "@/components/ui/InfoTooltip";
import PropertyDataDischargesControl from "./PropertyDataDischargesControl";
import { useSearchParams } from "react-router-dom";

export default function PropertyDataCard() {
  const { propertyData, setpropertyData } = useContext(propertyDataContext);
  const [installmentValueCalculatorLock, setInstallmentValueCalculatorLock] =
    useState(false);
  const afterInitialRender = useRef(false);

  const [searchParams] = useSearchParams();
  const useSaveData = searchParams.get("useSaveData") === "true";

  useEffect(() => {
    if (useSaveData && !afterInitialRender.current) {
      setInstallmentValueCalculatorLock(true);
    } else {
      setInstallmentValueCalculatorLock(false);
    }
    afterInitialRender.current = true;
  }, []);

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
    rentAppreciationRate,
    financingYears,
    rentMonthlyYieldRate,
    PVDiscountRate,
    brokerageFee,
    isHousing,
    investTheRest,
  } = propertyData;

  const handleChangeBoolean = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    const id = event.target.id as keyof PropertyData;

    setpropertyData(id, value);
  };

  const handleChangeNumber = (
    id: keyof PropertyData,
    value: string | number
  ) => {
    setpropertyData(id, Number(value));
  };

  useEffect(() => {
    if (!afterInitialRender.current) return;

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

    if (installmentValueCalculatorLock)
      setpropertyData("installmentValue", installmentValue);

    setpropertyData("outstandingBalance", outstandingBalance);
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
    return !routes.some((route) => location.pathname.includes(route));
  };

  return (
    <>
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:mb-[-1rem] mt-24 sm:mt-10 md:p-2 lg:p-5">
        <Sheet variant="outlined" color="neutral" className="p-5 ">
          <h2 className="text-xl text-center mb-3 font-bold ">
            Informações do Financiamento
          </h2>

          <div className="grid grid-cols-1 gap-5 h-[90%]  gap-5 justify-between">
            <CurrencyInput
              label="Valor do imóvel:"
              id="propertyValue"
              value={propertyValue}
              onChange={(v) =>
                handleChangeNumber("propertyValue", v.target.value)
              }
            />

            <CurrencyInput
              label="Valor Inicial do aluguel:"
              id="initialRentValue"
              value={initialRentValue}
              onChange={(v) =>
                handleChangeNumber("initialRentValue", v.target.value)
              }
              disabled={isHousing}
            />

            <div className="mb-[-20px]">
              <div className="relative">
                <CurrencyInput
                  label="Valor da entrada:"
                  id="downPayment"
                  value={downPayment}
                  onChange={(v) =>
                    handleChangeNumber("downPayment", v.target.value)
                  }
                />
                <span className="text-sm absolute top-[50%] translate-y-[50%] right-[1rem]">
                  {((downPayment / propertyValue) * 100).toFixed(2) + "%"}
                </span>
              </div>

              <div className="relative mt-2">
                <Slider
                  onChange={(_e, value) => {
                    setpropertyData(
                      "downPayment",
                      (propertyValue * (value as number)) / 10
                    );
                  }}
                  defaultValue={2}
                  min={0}
                  max={10}
                  step={0.1}
                />

                <span className="text-xs text-gray-500 dark:text-gray-400 absolute start-0 ">
                  0%
                </span>

                <span className="text-xs text-gray-500 dark:text-gray-400 absolute start-[95%]">
                  100%
                </span>
              </div>
            </div>

            <PropertyDataDischargesControl />
          </div>
        </Sheet>

        <Sheet variant="outlined" color="neutral" className="p-5 ">
          <h2 className="text-xl text-center mb-3 font-bold ">
            Cálculo do Financiamento
          </h2>

          <div className="grid grid-cols-1 gap-5 h-[90%]  gap-5 justify-between">
            <PercentageInput
              label="Juros nominal do financiamento:"
              id="interestRate"
              value={interestRate}
              onChange={(v) =>
                handleChangeNumber("interestRate", v.target.value)
              }
              wrapperClassName="relative"
              infoTooltip="Percentual nominal dos juros aplicados ao financiamento, que representa a taxa base acordada com a instituição financeira, sem considerar a inflação ou outros ajustes."
            />

            <CurrencyInput
              lock={installmentValueCalculatorLock}
              setLock={(value) => setInstallmentValueCalculatorLock(value)}
              label="Valor da Parcela:"
              id="installmentValue"
              value={installmentValue}
              onChange={(v) =>
                handleChangeNumber("installmentValue", v.target.value)
              }
              infoTooltip="R$ 150,00 em taxas de administração e seguro foram adicionados automaticamente. Você pode ajustar esse valor manualmente ao realizar uma simulação."
            />

            <CurrencyInput
              label={`Saldo devedor em ${finalYear} anos:`}
              id="outstandingBalance"
              infoTooltip="Valor restante do financiamento que ainda precisa ser pago após 7 anos, considerando os pagamentos já realizados e os juros acumulados."
              value={outstandingBalance}
              onChange={(v) =>
                handleChangeNumber("outstandingBalance", v.target.value)
              }
            />

            <div
              className={`${
                excludeInputByRoute(["/planejamentofinanciamento"])
                  ? "grid grid-cols-2 items-end gap-5"
                  : ""
              }`}
            >
              <CurrencyInput
                label="Taxas do financiamento:"
                id="financingFees"
                value={financingFees}
                onChange={(v) =>
                  handleChangeNumber("financingFees", v.target.value)
                }
                infoTooltip="Valor total das taxas que devem ser pagas no momento da contratação do financiamento, como taxas de administração, seguro e avaliação do imóvel."
              />

              {excludeInputByRoute(["/planejamentofinanciamento"]) && (
                <CurrencyInput
                  label="Taxas à vista:"
                  id="inCashFees"
                  value={inCashFees}
                  onChange={(v) =>
                    handleChangeNumber("inCashFees", v.target.value)
                  }
                />
              )}
            </div>

            <div>
              <FormLabel className="h-[40px]" htmlFor="financingYears">
                Tempo do financiamento:
              </FormLabel>
              <Input
                id="financingYears"
                value={financingYears}
                onChange={(v) => {
                  const value = Number(v.target.value);
                  if (value > 0) setpropertyData("financingYears", value);
                }}
                type="number"
                endDecorator="Anos"
                slotProps={{
                  input: {
                    min: 1,
                    max: 35,
                    step: 1,
                  },
                }}
              />
            </div>
          </div>
        </Sheet>

        <Sheet variant="outlined" color="neutral" className="p-5 ">
          <h2 className="text-xl text-center mb-3 font-bold ">
            Rendimento e Aluguel
          </h2>

          <div className="grid grid-cols-2 gap-5 h-[90%]  gap-5 justify-between pt-8">
            <BooleanInput
              id="isHousing"
              checked={isHousing}
              onChange={handleChangeBoolean}
              label=" Não considerar aluguel"
              infoTooltip="Marque esta opção se não quiser incluir o valor do aluguel nos cálculos."
            />
            <BooleanInput
              id="investTheRest"
              checked={investTheRest}
              onChange={handleChangeBoolean}
              label="Investir o restante"
              infoTooltip="Selecione esta opção para investir em renda fixa o valor restante do mês (diferença entre o aluguel e a parcela), caso esse saldo seja positivo."
            />

            {excludeInputByRoute(["/planejamentofinanciamento"]) && (
              <CurrencyInput
                label="Saldo Disponível:"
                id="personalBalance"
                value={personalBalance}
                onChange={(v) =>
                  handleChangeNumber("personalBalance", v.target.value)
                }
              />
            )}

            <PercentageInput
              label="Valorização anual do imóvel:"
              id="propertyAppreciationRate"
              value={propertyAppreciationRate}
              onChange={(v) =>
                handleChangeNumber("propertyAppreciationRate", v.target.value)
              }
              infoTooltip="Percentual de aumento no valor do imóvel a cada ano."
              wrapperClassName="relative"
            />

            <PercentageInput
              label="Rendimento aplicação no mercado financeiro:"
              id="monthlyYieldRate"
              value={monthlyYieldRate}
              infoTooltip="Taxa de retorno anual estimada ao investir o dinheiro no mercado financeiro, como poupança, ações ou fundos de investimento."
              onChange={(v) =>
                handleChangeNumber("monthlyYieldRate", v.target.value)
              }
            />

            <PercentageInput
              label="Taxa de desconto anual para valor presente:"
              id="PVDiscountRate"
              value={PVDiscountRate}
              infoTooltip="Percentual usado para ajustar o valor de um dinheiro que você vai receber no futuro, trazendo-o para o valor que ele teria hoje."
              onChange={(v) =>
                handleChangeNumber("PVDiscountRate", v.target.value)
              }
            />

            <PercentageInput
              label="Taxa de corretagem na venda:"
              id="brokerageFee"
              value={brokerageFee}
              infoTooltip={`Percentual cobrado por uma imobiliária pela intermediação da venda de um imóvel. ${
                brokerageFee / 100
              } * ${toBRL(propertyValue)} = ${toBRL(
                (brokerageFee / 100) * propertyValue
              )}`}
              onChange={(v) =>
                handleChangeNumber("brokerageFee", v.target.value)
              }
            />

            <div
              className={`${
                !excludeInputByRoute(["/planejamentofinanciamento"])
                  ? "col-span-2"
                  : ""
              }`}
            >
              <PercentageInput
                label="Valorização anual do aluguel:"
                id="rentAppreciationRate"
                value={rentAppreciationRate}
                infoTooltip="Taxa percentual de aumento anual do valor do aluguel, baseada na valorização do imóvel e condições de mercado."
                onChange={(v) =>
                  handleChangeNumber("rentAppreciationRate", v.target.value)
                }
              />

              {excludeInputByRoute(["/planejamentofinanciamento"]) && (
                <PercentageInput
                  label="Rendimento montante do aluguel:"
                  id="rentMonthlyYieldRate"
                  value={rentMonthlyYieldRate}
                  onChange={(v) =>
                    handleChangeNumber("rentMonthlyYieldRate", v.target.value)
                  }
                />
              )}
            </div>

            <div className="col-span-2">
              <div className="flex items-center h-[40px]">
                <FormLabel htmlFor="finalYear">Calcular até:</FormLabel>
                <InfoTooltip text="Define o período de tempo em anos que o cálculo é feito." />
              </div>

              <Input
                id="finalYear"
                value={finalYear}
                onChange={(v) => {
                  const value = Number(v.target.value);
                  if (value > 0) setpropertyData("finalYear", value);
                }}
                type="number"
                endDecorator="Anos"
                slotProps={{
                  input: {
                    min: 1,
                    max: 35,
                    step: 1,
                  },
                }}
              />
            </div>
          </div>
        </Sheet>
      </form>
    </>
  );
}
