/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo, useState } from "react";
import { PropertyData, propertyDataContext } from "./PropertyDataContext";
import { calcOutstandingBalance, calcInstallmentValue } from "@/lib/calcs";
import { FormLabel, Input, Sheet, Slider } from "@mui/joy";
import React from "react";
import PercentageInput from "@/components/inputs/PercentageInput";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import BooleanInput from "@/components/inputs/BooleanInput";
import { toBRL } from "@/lib/formatter";
import InfoTooltip from "@/components/ui/InfoTooltip";
import PropertyDataDischargesControl from "./PropertyDataDischargesControl";
import DatePicker from "@/components/inputs/DatePickerInput";
import dayjs from "dayjs";

export default function PropertyDataCard() {
  const { propertyData, setPropertyData } = useContext(propertyDataContext);

  const [installmentValueCalculatorLock, setInstallmentValueCalculatorLock] =
    useState(false);

  const handleChangeBoolean = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    const id = event.target.id as keyof PropertyData;

    setPropertyData(id, value);
  };

  const handleChangeNumber = (
    id: keyof PropertyData,
    value: string | number
  ) => {
    setPropertyData(id, Number(value));
  };

  const totalDischargesDownPayment = useMemo(() => {
    if (!propertyData) return 0;
    return propertyData?.discharges.reduce((acc, val) => {
      return val.isDownPayment ? acc + val.originalValue : acc;
    }, 0);
  }, [propertyData]);

  useEffect(() => {
    if (!propertyData) return;

    const installmentValue = calcInstallmentValue(
      propertyData.propertyValue - propertyData.downPayment,
      propertyData.interestRate,
      propertyData.financingYears
    );

    const totalInvestmentDischarges = propertyData.discharges.reduce(
      (acc, val) => (val.isDownPayment ? val.originalValue + acc : acc),
      0
    );

    const outstandingBalance = calcOutstandingBalance(
      propertyData.propertyValue -
        propertyData.downPayment -
        totalInvestmentDischarges,
      propertyData.interestRate,
      propertyData.financingYears,
      12 * propertyData.finalYear
    );

    if (installmentValueCalculatorLock)
      setPropertyData("installmentValue", installmentValue);

    setPropertyData("outstandingBalance", outstandingBalance);
  }, [
    propertyData?.finalYear,
    propertyData?.initialRentValue,
    propertyData?.propertyValue,
    propertyData?.downPayment,
    propertyData?.interestRate,
    propertyData?.propertyAppreciationRate,
    propertyData?.financingYears,
    propertyData?.discharges,
    installmentValueCalculatorLock,
  ]);

  if (!propertyData) return null;

  const excludeInputByRoute = (routes: string[]) => {
    return !routes.some((route) => location.pathname.includes(route));
  };

  return (
    <form className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:mb-[-1rem] md:p-2 lg:p-5">
      <Sheet variant="outlined" color="neutral" className="p-5 ">
        <h2 className="text-xl text-center mb-3 font-bold ">
          Dados do Imóvel e Financiamento
        </h2>

        <div className="grid grid-cols-1 gap-5 h-[90%]  gap-5 justify-between">
          <CurrencyInput
            label="Valor do imóvel:"
            id="propertyValue"
            value={propertyData.propertyValue}
            onChange={(v) =>
              handleChangeNumber("propertyValue", v.target.value)
            }
          />

          <div className="grid grid-cols-2 gap-5">
            <CurrencyInput
              label="Valor Inicial do aluguel:"
              id="initialRentValue"
              value={propertyData.initialRentValue}
              onChange={(v) =>
                handleChangeNumber("initialRentValue", v.target.value)
              }
              disabled={propertyData.isHousing}
            />
            <DatePicker
              defaultValue={dayjs(
                propertyData.initialRentMonth,
                "MM/YYYY"
              ).format("MM/YYYY")}
              label="Início do aluguel"
              onChange={(v) => setPropertyData("initialRentMonth", v)}
            />
          </div>

          <div className="mb-[-20px]">
            <div className="relative">
              <CurrencyInput
                label="Valor da entrada no ato:"
                id="downPayment"
                value={propertyData.downPayment}
                onChange={(v) =>
                  handleChangeNumber("downPayment", v.target.value)
                }
              />
              <span className="text-sm absolute top-[50%] translate-y-[50%] right-[1rem]">
                {(
                  (propertyData.downPayment / propertyData.propertyValue) *
                  100
                ).toFixed(2) + "%"}
              </span>
            </div>

            <div className="relative mt-2">
              <Slider
                onChange={(_e, value) => {
                  setPropertyData(
                    "downPayment",
                    (propertyData.propertyValue * (value as number)) / 10
                  );
                }}
                value={
                  (propertyData.downPayment / propertyData.propertyValue) * 10
                }
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

          <div className={"grid grid-cols-2 gap-5"}>
            <CurrencyInput
              label="Valor do subsídio:"
              id="subsidy"
              value={propertyData.subsidy}
              onChange={(v) => handleChangeNumber("subsidy", v.target.value)}
              disabled={propertyData.isHousing}
            />

            <CurrencyInput
              disabled
              label="Total do recurso próprio:"
              id="ownresource"
              value={
                totalDischargesDownPayment +
                propertyData.downPayment +
                propertyData.subsidy
              }
              onChange={() => {}}
            />
          </div>

          <PropertyDataDischargesControl
            propertyData={propertyData}
            setPropertyData={setPropertyData}
          />
        </div>
      </Sheet>

      <Sheet variant="outlined" color="neutral" className="p-5 ">
        <h2 className="text-xl text-center mb-3 font-bold ">
          Detalhes do Financiamento
        </h2>

        <div className="grid grid-cols-1 gap-5 h-[90%]  gap-5 justify-between">
          <PercentageInput
            label="Juros nominal do financiamento:"
            id="interestRate"
            value={propertyData.interestRate}
            onChange={(v) => handleChangeNumber("interestRate", v.target.value)}
            wrapperClassName="relative"
            infoTooltip="Percentual nominal dos juros aplicados ao financiamento, que representa a taxa base acordada com a instituição financeira, sem considerar a inflação ou outros ajustes."
          />

          <div className="grid grid-cols-2 gap-5">
            <CurrencyInput
              lock={installmentValueCalculatorLock}
              setLock={(value) => setInstallmentValueCalculatorLock(value)}
              label="Valor da Parcela:"
              id="installmentValue"
              value={propertyData.installmentValue}
              onChange={(v) =>
                handleChangeNumber("installmentValue", v.target.value)
              }
              infoTooltip="R$ 150,00 em taxas de administração e seguro foram adicionados automaticamente. Você pode ajustar esse valor manualmente ao realizar uma simulação."
            />

            <DatePicker
              defaultValue={dayjs(
                propertyData.initialFinancingMonth,
                "MM/YYYY"
              ).format("MM/YYYY")}
              label="Data de ínicio das parcelas"
              onChange={(v) => setPropertyData("initialFinancingMonth", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <CurrencyInput
              label={`Total Financiado:`}
              disabled
              id="outstandingBalance"
              infoTooltip="Valor corresponde ao saldo que será financiado. (Valor do imóvel - Valor do recurso próprio)"
              value={
                propertyData.propertyValue -
                totalDischargesDownPayment -
                propertyData.downPayment
              }
              onChange={(v) =>
                handleChangeNumber("outstandingBalance", v.target.value)
              }
            />

            <CurrencyInput
              label={`Saldo devedor em ${propertyData.finalYear} anos:`}
              disabled
              id="outstandingBalance"
              infoTooltip="Valor restante do financiamento que ainda precisa ser pago após 7 anos, considerando os pagamentos já realizados e os juros acumulados."
              value={propertyData.outstandingBalance}
              onChange={(v) =>
                handleChangeNumber("outstandingBalance", v.target.value)
              }
            />
          </div>

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
              value={propertyData.financingFees}
              onChange={(v) =>
                handleChangeNumber("financingFees", v.target.value)
              }
              infoTooltip="Valor total das taxas que devem ser pagas no momento da contratação do financiamento, como taxas de administração, seguro e avaliação do imóvel."
            />

            {excludeInputByRoute(["/planejamentofinanciamento"]) && (
              <CurrencyInput
                label="Taxas à vista:"
                id="inCashFees"
                value={propertyData.inCashFees}
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
              value={propertyData.financingYears}
              onChange={(v) => {
                const value = Number(v.target.value);
                if (value > 0) setPropertyData("financingYears", value);
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
          Valorização e Rentabilidade
        </h2>

        <div className="grid grid-cols-2 gap-5 h-[90%]  gap-5 justify-between pt-8">
          <BooleanInput
            id="isHousing"
            checked={propertyData.isHousing}
            onChange={handleChangeBoolean}
            label=" Não considerar aluguel"
            infoTooltip="Marque esta opção se não quiser incluir o valor do aluguel nos cálculos."
          />
          <BooleanInput
            id="investTheRest"
            checked={propertyData.investTheRest}
            onChange={handleChangeBoolean}
            label="Investir o restante"
            infoTooltip="Selecione esta opção para investir em renda fixa o valor restante do mês (diferença entre o aluguel e a parcela), caso esse saldo seja positivo."
          />

          {excludeInputByRoute(["/planejamentofinanciamento"]) && (
            <CurrencyInput
              label="Saldo Disponível:"
              id="personalBalance"
              value={propertyData.personalBalance}
              onChange={(v) =>
                handleChangeNumber("personalBalance", v.target.value)
              }
            />
          )}

          <PercentageInput
            label="Rendimento aplicação no mercado financeiro:"
            id="monthlyYieldRate"
            value={propertyData.monthlyYieldRate}
            infoTooltip="Taxa de retorno anual estimada ao investir o dinheiro no mercado financeiro, como poupança, ações ou fundos de investimento."
            onChange={(v) =>
              handleChangeNumber("monthlyYieldRate", v.target.value)
            }
          />

          <PercentageInput
            label="Taxa de desconto anual para valor presente:"
            id="PVDiscountRate"
            value={propertyData.PVDiscountRate}
            infoTooltip="Percentual usado para ajustar o valor de um dinheiro que você vai receber no futuro, trazendo-o para o valor que ele teria hoje."
            onChange={(v) =>
              handleChangeNumber("PVDiscountRate", v.target.value)
            }
          />

          <PercentageInput
            label="Taxa de corretagem na venda:"
            id="brokerageFee"
            value={propertyData.brokerageFee}
            infoTooltip={`Percentual cobrado por uma imobiliária pela intermediação da venda de um imóvel. ${
              propertyData.brokerageFee / 100
            } * ${toBRL(propertyData.propertyValue)} = ${toBRL(
              (propertyData.brokerageFee / 100) * propertyData.propertyValue
            )}`}
            onChange={(v) => handleChangeNumber("brokerageFee", v.target.value)}
          />

          <PercentageInput
            label="CDI"
            id="cdi"
            value={propertyData.cdi}
            infoTooltip="Taxa média de juros dos empréstimos entre bancos no Brasil, utilizada para comparar o investimento imobiliário."
            onChange={(v) => handleChangeNumber("cdi", v.target.value)}
          />

          <PercentageInput
            label="Valorização anual do aluguel:"
            id="rentAppreciationRate"
            value={propertyData.rentAppreciationRate}
            infoTooltip="Taxa percentual de aumento anual do valor do aluguel, baseada na valorização do imóvel e condições de mercado."
            onChange={(v) =>
              handleChangeNumber("rentAppreciationRate", v.target.value)
            }
          />

          <PercentageInput
            label="Valorização anual do imóvel:"
            id="propertyAppreciationRate"
            value={propertyData.propertyAppreciationRate}
            onChange={(v) =>
              handleChangeNumber("propertyAppreciationRate", v.target.value)
            }
            infoTooltip="Percentual de aumento no valor do imóvel a cada ano."
            wrapperClassName="relative"
          />

          {excludeInputByRoute(["/planejamentofinanciamento"]) && (
            <PercentageInput
              label="Rendimento montante do aluguel:"
              id="rentMonthlyYieldRate"
              value={propertyData.rentMonthlyYieldRate}
              onChange={(v) =>
                handleChangeNumber("rentMonthlyYieldRate", v.target.value)
              }
            />
          )}

          <div>
            <DatePicker
              defaultValue={dayjs(propertyData.initialDate, "MM/YYYY").format(
                "MM/YYYY"
              )}
              label="Data de ínicio do estudo"
              onChange={(v) => setPropertyData("initialDate", v)}
            />
          </div>

          <div>
            <div className="flex items-center h-[40px]">
              <FormLabel htmlFor="finalYear">Calcular até:</FormLabel>
              <InfoTooltip text="Define o período de tempo em anos que o cálculo é feito." />
            </div>

            <Input
              id="finalYear"
              value={propertyData.finalYear}
              onChange={(v) => {
                const value = Number(v.target.value);
                if (value > 0) setPropertyData("finalYear", value);
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
  );
}
