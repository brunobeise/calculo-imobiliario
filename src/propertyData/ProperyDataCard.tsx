/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo, useState } from "react";
import { PropertyData, propertyDataContext } from "./PropertyDataContext";
import { calcOutstandingBalance, calcInstallmentValue } from "@/lib/calcs";
import { FormLabel, Input, Radio, RadioGroup, Sheet, Slider } from "@mui/joy";
import React from "react";
import PercentageInput from "@/components/inputs/PercentageInput";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import BooleanInput from "@/components/inputs/BooleanInput";
import { toBRL } from "@/lib/formatter";
import InfoTooltip from "@/components/ui/InfoTooltip";
import PropertyDataDischargesControl from "./PropertyDataDischargesControl";
import DatePicker from "@/components/inputs/DatePickerInput";
import dayjs from "dayjs";

interface PropertyDataCardProps {
  hideFields?: string[];
  hideSheets?: string[];
}

export default function PropertyDataCard({
  hideFields = [],
  hideSheets = [],
}: PropertyDataCardProps) {
  const { propertyData, setPropertyData } = useContext(propertyDataContext);

  const [installmentValueCalculatorLock, setInstallmentValueCalculatorLock] =
    useState(true);

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

  const totalDischarges = useMemo(() => {
    if (!propertyData) return 0;
    return propertyData?.discharges.reduce((acc, val) => {
      return acc + val.originalValue;
    }, 0);
  }, [propertyData]);

  useEffect(() => {
    if (!propertyData) return;

    const installmentValue =
      calcInstallmentValue(
        propertyData.propertyValue - propertyData.downPayment,
        propertyData.interestRate,
        propertyData.financingYears,
        propertyData.amortizationType
      ) + 150;

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
      12 * propertyData.finalYear,
      propertyData.amortizationType
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
    propertyData?.amortizationType,
    installmentValueCalculatorLock,
  ]);

  const taxValue = useMemo(() => {
    if (!propertyData) return 0;
    const result =
      propertyData.installmentValue -
      calcInstallmentValue(
        propertyData.propertyValue - propertyData.downPayment,
        propertyData.interestRate,
        propertyData.financingYears,
        propertyData.amortizationType
      );

    return Math.abs(result) < 0.01 ? 0 : result;
  }, [propertyData?.installmentValue]);

  if (!propertyData) return null;

  const isFieldHidden = (fieldName: string) => {
    return hideFields.includes(fieldName);
  };

  const isSheetHidden = (sheetName: string) => {
    return hideSheets.includes(sheetName);
  };

  return (
    <form
      className={` lg:mb-[-1rem] md:p-2 lg:p-5 justify-items-center gap-5 ${
        hideSheets.length === 0
          ? "grid grid-cols-1 lg:grid-cols-3"
          : "flex justify-center !px-32"
      }`}
    >
      {!isSheetHidden("propertyData") && (
        <Sheet variant="outlined" color="neutral" className="p-5 w-full">
          <h2 className="text-xl text-center mb-3 font-bold ">
            Dados do Imóvel e Financiamento
          </h2>

          <div className="grid grid-cols-1 gap-5 h-[90%]  gap-5">
            {!isFieldHidden("propertyValue") && (
              <CurrencyInput
                label="Valor do imóvel:"
                id="propertyValue"
                value={propertyData.propertyValue}
                onChange={(v) =>
                  handleChangeNumber("propertyValue", v.target.value)
                }
              />
            )}

            <div className="grid grid-cols-2 gap-5">
              {!isFieldHidden("initialRentValue") && (
                <CurrencyInput
                  label="Valor Inicial do aluguel:"
                  id="initialRentValue"
                  value={propertyData.initialRentValue}
                  onChange={(v) =>
                    handleChangeNumber("initialRentValue", v.target.value)
                  }
                  disabled={propertyData.isHousing}
                />
              )}
              {!isFieldHidden("initialRentMonth") && (
                <DatePicker
                  defaultValue={dayjs(
                    propertyData.initialRentMonth,
                    "MM/YYYY"
                  ).format("MM/YYYY")}
                  label="Início do aluguel"
                  onChange={(v) => setPropertyData("initialRentMonth", v)}
                />
              )}
            </div>

            <div className="mb-[-20px]">
              <div className="relative">
                {!isFieldHidden("downPayment") && (
                  <CurrencyInput
                    label="Valor da entrada no ato:"
                    id="downPayment"
                    value={propertyData.downPayment}
                    onChange={(v) =>
                      handleChangeNumber("downPayment", v.target.value)
                    }
                  />
                )}
                {!isFieldHidden("downPaymentPercentage") && (
                  <span className="text-sm absolute top-[50%] translate-y-[50%] right-[1rem]">
                    {(
                      (propertyData.downPayment / propertyData.propertyValue) *
                      100
                    ).toFixed(2) + "%"}
                  </span>
                )}
              </div>

              {!isFieldHidden("downPaymentSlider") && (
                <div className="relative mt-2">
                  <Slider
                    onChange={(_e, value) => {
                      setPropertyData(
                        "downPayment",
                        (propertyData.propertyValue * (value as number)) / 10
                      );
                    }}
                    value={
                      (propertyData.downPayment / propertyData.propertyValue) *
                      10
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
              )}
            </div>

            <div className={"grid grid-cols-2 gap-5"}>
              {!isFieldHidden("subsidy") && (
                <CurrencyInput
                  label="Valor do subsídio:"
                  id="subsidy"
                  value={propertyData.subsidy}
                  onChange={(v) =>
                    handleChangeNumber("subsidy", v.target.value)
                  }
                  disabled={propertyData.isHousing}
                />
              )}

              {!isFieldHidden("ownResource") && (
                <CurrencyInput
                  disabled
                  label="Total do recurso próprio:"
                  id="ownResource"
                  value={totalDischarges + propertyData.downPayment}
                  onChange={() => {}}
                />
              )}
            </div>

            {!isFieldHidden("dischargesControl") && (
              <PropertyDataDischargesControl
                propertyData={propertyData}
                setPropertyData={setPropertyData}
              />
            )}
          </div>
        </Sheet>
      )}

      {!isSheetHidden("financingDetails") && (
        <Sheet variant="outlined" color="neutral" className="p-5 w-full">
          <h2 className="text-xl text-center mb-3 font-bold ">
            Detalhes do Financiamento
          </h2>

          <div className="grid grid-cols-1 gap-5 h-[90%]  gap-5">
            {!isFieldHidden("interestRate") && (
              <PercentageInput
                label="Juros nominal do financiamento:"
                id="interestRate"
                value={propertyData.interestRate}
                onChange={(v) =>
                  handleChangeNumber("interestRate", v.target.value)
                }
                wrapperClassName="relative"
                infoTooltip="Percentual nominal dos juros aplicados ao financiamento, que representa a taxa base acordada com a instituição financeira, sem considerar a inflação ou outros ajustes."
              />
            )}

            {!isFieldHidden("amortizationType") && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo de amortização:
                </label>
                <RadioGroup
                  name="amortizationType"
                  value={propertyData.amortizationType}
                  onChange={(event) =>
                    setPropertyData("amortizationType", event.target.value)
                  }
                >
                  <div className="flex gap-10">
                    <Radio value="PRICE" label="PRICE" />
                    <Radio value="SAC" label="SAC" />
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="grid grid-cols-2 gap-5">
              {!isFieldHidden("installmentValue") && (
                <CurrencyInput
                  lock={installmentValueCalculatorLock}
                  setLock={(value) => setInstallmentValueCalculatorLock(value)}
                  label="Valor da Parcela:"
                  id="installmentValue"
                  value={propertyData.installmentValue}
                  onChange={(v) =>
                    handleChangeNumber("installmentValue", v.target.value)
                  }
                  infoTooltip="Valor total que será pago mensalmente. O saldo devedor será reduzido com base no valor da parcela calculada pelo sistema, e qualquer valor excedente será automaticamente destinado ao pagamento de taxas."
                />
              )}

              {!isFieldHidden("installmentValueTax") && (
                <CurrencyInput
                  disabled
                  label="Taxa da parcela"
                  id="installmentValueTax"
                  value={taxValue || 0}
                  onChange={() => {}}
                  infoTooltip="Essa é a parte do valor total da parcela que será usada para cobrir taxas. Valores adicionais ao mínimo necessário para o financiamento serão automaticamente direcionados para este campo."
                />
              )}
            </div>

            <div
              className={`${
                !isFieldHidden("totalFinanced") &&
                !isFieldHidden("outstandingBalance")
                  ? "grid grid-cols-2 gap-5"
                  : ""
              }`}
            >
              {!isFieldHidden("totalFinanced") && (
                <CurrencyInput
                  label={`Total Financiado:`}
                  disabled
                  id="totalFinanced"
                  infoTooltip="Valor corresponde ao saldo que será financiado. (Valor do imóvel - Valor do recurso próprio)"
                  value={
                    propertyData.propertyValue -
                    totalDischarges -
                    propertyData.downPayment -
                    propertyData.subsidy
                  }
                  onChange={() => {}}
                />
              )}

              {!isFieldHidden("outstandingBalance") && (
                <CurrencyInput
                  label={`Saldo devedor em ${propertyData.finalYear} anos. (${
                    propertyData.finalYear * 12
                  }) meses`}
                  disabled
                  id="outstandingBalance"
                  infoTooltip="Valor restante do financiamento que ainda precisa ser pago após 7 anos, considerando os pagamentos já realizados e os juros acumulados."
                  value={propertyData.outstandingBalance}
                  onChange={(v) =>
                    handleChangeNumber("outstandingBalance", v.target.value)
                  }
                />
              )}
            </div>

            <div
              className={`${
                !isFieldHidden("inCashFees")
                  ? "grid grid-cols-2 items-end gap-5"
                  : ""
              }`}
            >
              {!isFieldHidden("financingFees") && (
                <CurrencyInput
                  label="Taxas do financiamento:"
                  id="financingFees"
                  value={propertyData.financingFees}
                  onChange={(v) =>
                    handleChangeNumber("financingFees", v.target.value)
                  }
                  infoTooltip="Valor total das taxas que devem ser pagas no momento da contratação do financiamento, como taxas de administração, seguro e avaliação do imóvel."
                />
              )}

              {!isFieldHidden("inCashFees") && (
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

            {isFieldHidden("initialDate") && !isFieldHidden("initialDate2") && (
              <div>
                <DatePicker
                  defaultValue={dayjs(
                    propertyData.initialDate,
                    "MM/YYYY"
                  ).format("MM/YYYY")}
                  label="Data de ínicio do estudo"
                  onChange={(v) => setPropertyData("initialDate", v)}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-5">
              {!isFieldHidden("financingYears") && (
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
              )}

              {!isFieldHidden("initialFinancingMonth") && (
                <DatePicker
                  defaultValue={dayjs(
                    propertyData.initialFinancingMonth,
                    "MM/YYYY"
                  ).format("MM/YYYY")}
                  label="Data de ínicio das parcelas"
                  onChange={(v) => setPropertyData("initialFinancingMonth", v)}
                />
              )}
            </div>
          </div>
        </Sheet>
      )}

      {!isSheetHidden("appreciation") && (
        <Sheet variant="outlined" color="neutral" className="p-5 w-full">
          <h2 className="text-xl text-center mb-3 font-bold ">
            Valorização e Rentabilidade
          </h2>

          <div className="grid grid-cols-2 gap-5 h-[90%]  gap-5 justify-between pt-8">
            {!isFieldHidden("isHousing") && (
              <BooleanInput
                id="isHousing"
                checked={propertyData.isHousing}
                onChange={handleChangeBoolean}
                label=" Não considerar aluguel"
                infoTooltip="Marque esta opção se não quiser incluir o valor do aluguel nos cálculos."
              />
            )}
            {!isFieldHidden("investTheRest") && (
              <BooleanInput
                id="investTheRest"
                checked={propertyData.investTheRest}
                onChange={handleChangeBoolean}
                label="Investir o restante"
                infoTooltip="Selecione esta opção para investir em renda fixa o valor restante do mês (diferença entre o aluguel e a parcela), caso esse saldo seja positivo."
              />
            )}

            {!isFieldHidden("personalBalance") && (
              <CurrencyInput
                label="Saldo Disponível:"
                id="personalBalance"
                value={propertyData.personalBalance}
                onChange={(v) =>
                  handleChangeNumber("personalBalance", v.target.value)
                }
              />
            )}

            {!isFieldHidden("monthlyYieldRate") && (
              <PercentageInput
                label="Rendimento aplicação no mercado financeiro:"
                id="monthlyYieldRate"
                value={propertyData.monthlyYieldRate}
                infoTooltip="Taxa de retorno anual estimada ao investir o dinheiro no mercado financeiro, como poupança, ações ou fundos de investimento."
                onChange={(v) =>
                  handleChangeNumber("monthlyYieldRate", v.target.value)
                }
              />
            )}

            {!isFieldHidden("PVDiscountRate") && (
              <PercentageInput
                label="Taxa de desconto anual para valor presente:"
                id="PVDiscountRate"
                value={propertyData.PVDiscountRate}
                infoTooltip="Percentual usado para ajustar o valor de um dinheiro que você vai receber no futuro, trazendo-o para o valor que ele teria hoje."
                onChange={(v) =>
                  handleChangeNumber("PVDiscountRate", v.target.value)
                }
              />
            )}

            {!isFieldHidden("brokerageFee") && (
              <PercentageInput
                label="Taxa de corretagem na venda:"
                id="brokerageFee"
                value={propertyData.brokerageFee}
                infoTooltip={`Percentual cobrado por uma imobiliária pela intermediação da venda de um imóvel. ${
                  propertyData.brokerageFee / 100
                } * ${toBRL(propertyData.propertyValue)} = ${toBRL(
                  (propertyData.brokerageFee / 100) * propertyData.propertyValue
                )}`}
                onChange={(v) =>
                  handleChangeNumber("brokerageFee", v.target.value)
                }
              />
            )}

            {!isFieldHidden("cdi") && (
              <PercentageInput
                label="CDI"
                id="cdi"
                value={propertyData.cdi}
                infoTooltip="Taxa média de juros dos empréstimos entre bancos no Brasil, utilizada para comparar o investimento imobiliário."
                onChange={(v) => handleChangeNumber("cdi", v.target.value)}
              />
            )}

            {!isFieldHidden("rentAppreciationRate") && (
              <PercentageInput
                label="Valorização anual do aluguel:"
                id="rentAppreciationRate"
                value={propertyData.rentAppreciationRate}
                infoTooltip="Taxa percentual de aumento anual do valor do aluguel, baseada na valorização do imóvel e condições de mercado."
                onChange={(v) =>
                  handleChangeNumber("rentAppreciationRate", v.target.value)
                }
              />
            )}

            {!isFieldHidden("propertyAppreciationRate") && (
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
            )}

            {!isFieldHidden("rentMonthlyYieldRate") && (
              <PercentageInput
                label="Rendimento montante do aluguel:"
                id="rentMonthlyYieldRate"
                value={propertyData.rentMonthlyYieldRate}
                onChange={(v) =>
                  handleChangeNumber("rentMonthlyYieldRate", v.target.value)
                }
              />
            )}

            {!isFieldHidden("initialDate") && (
              <div>
                <DatePicker
                  defaultValue={dayjs(
                    propertyData.initialDate,
                    "MM/YYYY"
                  ).format("MM/YYYY")}
                  label="Data de ínicio do estudo"
                  onChange={(v) => setPropertyData("initialDate", v)}
                />
              </div>
            )}

            {!isFieldHidden("finalYear") && (
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
            )}
          </div>
        </Sheet>
      )}
    </form>
  );
}
