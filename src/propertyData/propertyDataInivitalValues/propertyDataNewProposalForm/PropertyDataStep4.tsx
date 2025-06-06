/* eslint-disable @typescript-eslint/no-explicit-any */
import DatePicker from "@/components/inputs/DatePickerInput";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import PercentageInput from "@/components/inputs/PercentageInput";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import dayjs from "dayjs";
import { FormLabel, Input, Tooltip } from "@mui/joy";
import InstallmentSimulationModal from "@/components/modals/InstallmentSimulationModal";
import { useState } from "react";
import { FaCalculator } from "react-icons/fa6";

export default function PropertyDataStep4({
  form,
  setForm,
  simplificated,
  type,
}: {
  form: PropertyData;
  setForm: (key: string, value: any) => void;
  simplificated?: boolean;
  type: string;
}) {
  const [installmentSimulator, setInstallmentSimulator] = useState(false);

  return (
    <div className="p-5 !text-blackish">
      <h4 className="font-bold text-center">Detalhes do Financiamento</h4>

      {simplificated ? (
        <p className="my-4 text-sm">Preencha os detalhes do financiamento.</p>
      ) : (
        <p className="my-4 text-sm">
          Preencha os detalhes do financiamento, como os juros aplicados, o
          valor da parcela, e a data de início do pagamento das parcelas.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {!simplificated && type === "financingPlanning" && (
          <div className="grid grid-cols-2 gap-5">
            <PercentageInput
              infoTooltip="Percentual nominal dos juros aplicados ao financiamento."
              label="Juros nominal do financiamento:"
              id="interestRate"
              value={form.interestRate}
              onChange={(v) => setForm("interestRate", Number(v.target.value))}
            />
            <div>
              <FormLabel className="h-[40px]" htmlFor="financingMonths">
                Tempo do financiamento:
              </FormLabel>
              <Input
                id="financingMonths"
                value={form.financingMonths !== 0 ? form.financingMonths : ""}
                onChange={(v) => {
                  const value = Number(v.target.value);
                  setForm("financingMonths", value);
                }}
                type="number"
                endDecorator="Meses"
                slotProps={{
                  input: {
                    min: 1,
                    max: 420,
                    step: 1,
                  },
                }}
              />
            </div>
          </div>
        )}

        {type == "financingPlanning" && (
          <div className={`grid grid-cols-${simplificated ? "1" : "2"} gap-5`}>
            <CurrencyInput
              label="Valor da parcela:"
              id="installmentValue"
              value={form.installmentValue}
              onChange={(v) =>
                setForm("installmentValue", Number(v.target.value))
              }
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

            {!simplificated && (
              <DatePicker
                defaultValue={dayjs().add(1, "month").format("MM/YYYY")}
                label="Início das parcelas:"
                onChange={(v) => setForm("initialFinancingMonth", v)}
              />
            )}
          </div>
        )}

        <CurrencyInput
          label="Valor da documentação:"
          id="financingFees"
          value={form.financingFees}
          onChange={(v) => setForm("financingFees", Number(v.target.value))}
          infoTooltip="Valor total das taxas que devem ser pagas no momento da contratação do financiamento, como taxas de administração, seguro e avaliação do imóvel."
        />

        <DatePicker
          defaultValue={dayjs().format("MM/YYYY")}
          label="Data do pagamento da documentação"
          onChange={(v) => setForm("financingFeesDate", v)}
        />

        {type === "financingPlanning" && (
          <CurrencyInput
            label={`Total Financiado:`}
            disabled
            id="totalFinanced"
            infoTooltip="Valor corresponde ao saldo que será financiado. (Valor do imóvel - Valor do recurso próprio)"
            value={
              form.propertyValue -
              form.discharges.reduce((acc, val) => acc + val.originalValue, 0) -
              form.downPayment -
              (form.subsidy || 0)
            }
            onChange={() => {}}
          />
        )}
      </div>
      <InstallmentSimulationModal
        totalFinanced={
          form.propertyValue -
          form.discharges.reduce((acc, val) => acc + val.originalValue, 0) -
          form.downPayment -
          (form.subsidy || 0)
        }
        onClose={() => setInstallmentSimulator(false)}
        open={installmentSimulator}
        onSimulate={(v) => setForm("installmentValue", v)}
      />
    </div>
  );
}
