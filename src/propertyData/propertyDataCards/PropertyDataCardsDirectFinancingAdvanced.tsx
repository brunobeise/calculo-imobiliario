import CurrencyInput from "@/components/inputs/CurrencyInput";
import PercentageInput from "@/components/inputs/PercentageInput";
import DatePicker from "@/components/inputs/DatePickerInput";
import { Divider, FormLabel, Input, Sheet, Slider } from "@mui/joy";
import { CiCalculator2 } from "react-icons/ci";
import dayjs from "dayjs";
import PropertyDataDischargesControl from "../PropertyDataDischargesControl";
import { PropertyDataCardsProps } from "./PropertyDataCards";
import BooleanInput from "@/components/inputs/BooleanInput";
import { toBRL } from "@/lib/formatter";
import InfoTooltip from "@/components/ui/InfoTooltip";

export default function PropertyDataCardsDirectFinancingAdvanced({
  propertyData,
  setPropertyData,
  handleChangeNumber,
  totalDischarges,
  setFinancingFeesDescriptionModal,
  handleChangeBoolean,
}: PropertyDataCardsProps) {
  return (
    <form className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Sheet variant="outlined" color="neutral">
        <h2 className="text-xl text-center my-3 font-bold mt-8">
          Dados do Imóvel e Financiamento
        </h2>
        <div className="p-5 w-full grid grid cols-1 md:grid cols-1 md:grid-cols-2 gap-5">
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

          <DatePicker
            defaultValue={dayjs(propertyData.initialDate, "MM/YYYY").format(
              "MM/YYYY"
            )}
            label="Data de ínicio do estudo"
            onChange={(v) => setPropertyData("initialDate", v)}
          />

          <CurrencyInput
            label="Valor do imóvel"
            wrapperClassName="col-span-2"
            id="propertyValue"
            value={propertyData.propertyValue}
            onChange={(v) =>
              handleChangeNumber("propertyValue", v.target.value)
            }
          />

          <CurrencyInput
            disabled
            wrapperClassName="col-span-2"
            label="Total do recurso próprio"
            id="ownResource"
            value={totalDischarges + propertyData.downPayment}
            onChange={() => {}}
          />

          <div className="mb-[-25px] col-span-2">
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
        </div>
      </Sheet>

      {/* Coluna 2 - Detalhes do Financiamento */}
      <Sheet variant="outlined" color="neutral" className="p-5 w-full">
        <h2 className="text-xl text-center my-3 font-bold col-span-2">
          Detalhes do Financiamento
        </h2>

        <div className="grid grid cols-1 md:grid cols-1 md:grid-cols-2 gap-6 mt-6">
          <CurrencyInput
            label="Documentação Total"
            id="financingFees"
            value={propertyData.financingFees}
            onChange={(v) =>
              handleChangeNumber("financingFees", v.target.value)
            }
            extraButton={
              <CiCalculator2
                onClick={() => setFinancingFeesDescriptionModal(true)}
                className="cursor-pointer hover:opacity-90"
              />
            }
          />

          <DatePicker
            defaultValue={dayjs(
              propertyData.financingFeesDate,
              "MM/YYYY"
            ).format("MM/YYYY")}
            label="Data do pagamento da documentação"
            disabled={!propertyData.financingFees}
            opacity={!propertyData.financingFees}
            onChange={(v) => setPropertyData("financingFeesDate", v)}
          />
          <div className="col-span-2">
            <PropertyDataDischargesControl
              title="Fluxo de Pagamento"
              propertyData={propertyData}
              setPropertyData={setPropertyData}
              height="350px"
            />
          </div>
        </div>
      </Sheet>

      <Sheet variant="outlined" color="neutral" className="p-6 w-full">
        <h2 className="text-xl text-center my-3 font-bold ">
          Valorização e Rentabilidade
        </h2>

        <div className="grid grid-cols-3 gap-6 gap-x-3 mt-6">
          <div className="col-span-3 flex">
            <BooleanInput
              id="isHousing"
              checked={propertyData.isHousing}
              onChange={handleChangeBoolean}
              label="Considerar imóvel desocupado"
              infoTooltip="Marque esta opção se não quiser incluir o valor do aluguel nos cálculos."
            />
          </div>

          <CurrencyInput
            label="Valor Inicial do aluguel HOJE:"
            id="initialRentValue"
            value={propertyData.initialRentValue}
            onChange={(v) =>
              handleChangeNumber("initialRentValue", v.target.value)
            }
            disabled={propertyData.isHousing}
            opacity={propertyData.isHousing}
          />
          <DatePicker
            defaultValue={dayjs(
              propertyData.initialRentMonth,
              "MM/YYYY"
            ).format("MM/YYYY")}
            label="Início do aluguel"
            onChange={(v) => setPropertyData("initialRentMonth", v)}
            disabled={propertyData.isHousing}
            opacity={propertyData.isHousing}
          />

          <PercentageInput
            label="Valorização anual do aluguel:"
            id="rentAppreciationRate"
            value={propertyData.rentAppreciationRate}
            infoTooltip="Taxa percentual de aumento anual do valor do aluguel, baseada na valorização do imóvel e condições de mercado."
            onChange={(v) =>
              handleChangeNumber("rentAppreciationRate", v.target.value)
            }
            disabled={propertyData.isHousing}
            opacity={propertyData.isHousing}
          />

          <div />

          <Divider className="!col-span-3" />

          <div className="col-span-3 flex">
            <BooleanInput
              id="investTheRest"
              checked={propertyData.investTheRest}
              onChange={handleChangeBoolean}
              label="Investir a diferença entre o aluguel e a parcela"
              infoTooltip="Selecione esta opção para investir em renda fixa o valor restante do mês (diferença entre o aluguel e a parcela), caso esse saldo seja positivo."
            />
          </div>

          <PercentageInput
            label="Rendimento anual mercado financeiro:"
            id="annualYieldRate"
            value={propertyData.annualYieldRate}
            infoTooltip="Taxa de retorno anual estimada ao investir o dinheiro no mercado financeiro, como poupança, ações ou fundos de investimento."
            onChange={(v) => {
              handleChangeNumber("annualYieldRate", v.target.value);
              handleChangeNumber("PVDiscountRate", v.target.value);
            }}
            disabled={!propertyData.investTheRest}
            opacity={!propertyData.investTheRest}
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
            label="Valorização anual do imóvel:"
            id="propertyAppreciationRate"
            value={propertyData.propertyAppreciationRate}
            onChange={(v) =>
              handleChangeNumber("propertyAppreciationRate", v.target.value)
            }
            infoTooltip="Percentual de aumento no valor do imóvel a cada ano."
            wrapperClassName="relative"
          />

          <div className="col-span-3">
            <BooleanInput
              id="considerCapitalGainsTax"
              checked={propertyData.considerCapitalGainsTax}
              onChange={handleChangeBoolean}
              label="Calcular imposto de ganho de capital"
              infoTooltip="Selecione esta opção para calcular e incluir o imposto sobre o ganho de capital no valor total."
            />
          </div>
        </div>
      </Sheet>
    </form>
  );
}
