/* eslint-disable @typescript-eslint/no-explicit-any */
import DatePicker from "@/components/inputs/DatePickerInput";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import PercentageInput from "@/components/inputs/PercentageInput";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import dayjs from "dayjs";
import { FormLabel, Input } from "@mui/joy";

export default function PropertyDataStep4({
  form,
  setForm,
  simplificated,
}: {
  form: PropertyData;
  setForm: (key: string, value: any) => void;
  simplificated?: boolean;
}) {
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

      <div className="flex flex-col gap-5">
        {!simplificated && (
          <div className="grid grid-cols-2 gap-5">
            <PercentageInput
              infoTooltip="Percentual nominal dos juros aplicados ao financiamento."
              label="Juros nominal do financiamento:"
              id="interestRate"
              value={form.interestRate}
              onChange={(v) => setForm("interestRate", Number(v.target.value))}
            />
            <div>
              <FormLabel className="h-[40px]" htmlFor="financingYears">
                Tempo do financiamento:
              </FormLabel>
              <Input
                id="financingYears"
                value={form.financingYears !== 0 ? form.financingYears : ""}
                onChange={(v) => {
                  const value = Number(v.target.value);
                  setForm("financingYears", value);
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
        )}

        <div className={`grid grid-cols-${simplificated ? "1" : "2"} gap-5`}>
          <CurrencyInput
            label="Valor da parcela:"
            id="installmentValue"
            value={form.installmentValue}
            onChange={(v) =>
              setForm("installmentValue", Number(v.target.value))
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

        <CurrencyInput
          label="Taxas do financiamento:"
          id="financingFees"
          value={form.financingFees}
          onChange={(v) => setForm("financingFees", Number(v.target.value))}
          infoTooltip="Valor total das taxas que devem ser pagas no momento da contratação do financiamento, como taxas de administração, seguro e avaliação do imóvel."
        />

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
      </div>
    </div>
  );
}
