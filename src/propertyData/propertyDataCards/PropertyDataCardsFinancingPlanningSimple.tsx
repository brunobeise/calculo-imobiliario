import CurrencyInput from "@/components/inputs/CurrencyInput";
import PercentageInput from "@/components/inputs/PercentageInput";
import DatePicker from "@/components/inputs/DatePickerInput";
import {
  Button,
  FormHelperText,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Sheet,
  Slider,
  Tooltip,
} from "@mui/joy";
import { CiCalculator2 } from "react-icons/ci";
import dayjs from "dayjs";
import PropertyDataDischargesControl from "../PropertyDataDischargesControl";
import { FaCalculator } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";
import { PropertyDataCardsProps } from "./PropertyDataCards";
import { toBRL } from "@/lib/formatter";

export default function PropertyDataCardsFinancingPlanningSimple({
  propertyData,
  setPropertyData,
  handleChangeNumber,
  totalDischarges,
  totalFinanced,
  installmentValueCalculatorLock,
  setInstallmentValueCalculatorLock,
  setInstallmentSimulator,
  setFinancingFeesDescriptionModal,
  taxValue,
}: PropertyDataCardsProps) {
  return (
    <form className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Sheet
        variant="outlined"
        color="neutral"
        className="p-5 w-full grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <h2 className="text-xl text-center my-3 font-bold md:col-span-2">
          Dados do Imóvel e Financiamento
        </h2>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-10 gap-6">
          <CurrencyInput
            wrapperClassName="md:col-span-4"
            label="Valor compra e venda"
            id="propertyValue"
            value={propertyData.propertyValue}
            onChange={(v) =>
              handleChangeNumber("propertyValue", v.target.value)
            }
          />

          <div className="md:col-span-2">
            <FormLabel className={"h-[40px]"}>Cota do financiamento</FormLabel>
            <Input
              id="financingMonths"
              value={propertyData.financingQuota || ""}
              onChange={(v) =>
                handleChangeNumber("financingQuota", v.target.value)
              }
              type="number"
              endDecorator="%"
            />
          </div>

          <CurrencyInput
            wrapperClassName="md:col-span-4"
            label="Valor de avaliação BANCO"
            id="bankAppraisalValue"
            value={propertyData.appraisalValue || ""}
            onChange={(v) =>
              handleChangeNumber("appraisalValue", v.target.value)
            }
          />
        </div>

        <div className="mb-[-25px] md:col-span-2">
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

        <CurrencyInput
          label="Valor do subsídio"
          id="subsidy"
          value={propertyData.subsidy}
          onChange={(v) => handleChangeNumber("subsidy", v.target.value)}
        />

        <CurrencyInput
          disabled
          label="Total do recurso próprio"
          id="ownResource"
          value={totalDischarges + propertyData.downPayment}
          onChange={() => {}}
        />
        <div className="md:col-span-2">
          <PropertyDataDischargesControl
            title="Fluxo de Pagamento"
            propertyData={propertyData}
            setPropertyData={setPropertyData}
            height="260px"
          />
        </div>
      </Sheet>

      {/* Coluna 2 - Detalhes do Financiamento */}
      <Sheet variant="outlined" color="neutral" className="p-5 w-full">
        <h2 className="text-xl text-center my-3 font-bold md:col-span-2">
          Detalhes do Financiamento
        </h2>
        <div className="md:col-span-2 flex justify-center mt-6">
          <Button
            variant="outlined"
            endDecorator={<FaExternalLinkAlt />}
            onClick={() =>
              window.open(
                "https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso&isVoltar=true",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Simulador CAIXA
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <PercentageInput
            label="Juros nominal do financiamento"
            id="interestRate"
            value={propertyData.interestRate}
            onChange={(v) => handleChangeNumber("interestRate", v.target.value)}
          />
          <div className="flex flex-col gap-4 mt-3">
            <FormLabel>Modelo de amortização:</FormLabel>
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
            extraButton={
              <Tooltip
                sx={{ maxWidth: "280px" }}
                size="md"
                arrow
                direction="rtl"
                title="Simular valor da parcela"
              >
                <div>
                  <FaCalculator
                    onClick={() => setInstallmentSimulator(true)}
                    className="cursor-pointer text-grayText"
                  />
                </div>
              </Tooltip>
            }
          />

          <CurrencyInput
            disabled
            label="Taxa da parcela"
            id="installmentValueTax"
            value={taxValue || 0}
            onChange={() => {}}
            infoTooltip="Essa é a parte do valor total da parcela que será usada para cobrir taxas. Valores adicionais ao mínimo necessário para o financiamento serão automaticamente direcionados para este campo."
          />

          <div className="md:col-span-2">
            <CurrencyInput
              disabled
              label="Total Financiado"
              id="totalFinanced"
              value={totalFinanced}
              onChange={() => {}}
              error={
                (propertyData.financingQuota > 0 &&
                  propertyData.appraisalValue > 0 &&
                  (propertyData.appraisalValue * propertyData.financingQuota) /
                    100 <
                    totalFinanced) ||
                totalFinanced < 0
              }
            />
          </div>

          {propertyData.financingQuota > 0 &&
            propertyData.appraisalValue > 0 &&
            (propertyData.appraisalValue * propertyData.financingQuota) / 100 <
              totalFinanced && (
              <FormHelperText className="!text-red md:col-span-2">
                O valor máximo a ser financiado é de{" "}
                {toBRL(
                  (propertyData.appraisalValue * propertyData.financingQuota) /
                    100
                )}
                <br />
                Aumente o recurso próprio em pelo menos{" "}
                {toBRL(
                  totalFinanced -
                    (propertyData.appraisalValue *
                      propertyData.financingQuota) /
                      100
                )}
              </FormHelperText>
            )}

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
            onChange={(v) => setPropertyData("financingFeesDate", v)}
          />

          <DatePicker
            defaultValue={dayjs(
              propertyData.initialFinancingMonth,
              "MM/YYYY"
            ).format("MM/YYYY")}
            label="Data de início das parcelas"
            onChange={(v) => setPropertyData("initialFinancingMonth", v)}
          />

          <div>
            <FormLabel className={"h-[40px]"}>Tempo do financiamento</FormLabel>
            <Input
              id="financingMonths"
              value={propertyData.financingMonths}
              onChange={(v) =>
                handleChangeNumber("financingMonths", v.target.value)
              }
              type="number"
              endDecorator="Meses"
            />
          </div>
        </div>
      </Sheet>
    </form>
  );
}
