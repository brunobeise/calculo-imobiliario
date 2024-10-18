/* eslint-disable @typescript-eslint/no-explicit-any */
import DatePicker from "@/components/inputs/DatePickerInput";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import BooleanInput from "@/components/inputs/BooleanInput";
import PercentageInput from "@/components/inputs/PercentageInput";
import dayjs from "dayjs";

export default function PropertyDataStep5({
  form,
  setForm,
}: {
  form: PropertyData;
  setForm: (key: string, value: any) => void;
}) {
  return (
    <div className="p-5 !text-blackish">
      <h4 className="font-bold text-center">Aluguel</h4>

      <p className="my-3 text-sm">
        Preencha os detalhes do aluguel inicial, a data de início, ou desative o
        aluguel se ele não for considerado no cálculo.
      </p>

      <div className="flex flex-col gap-5">
        <BooleanInput
          label="Não considerar aluguel"
          checked={form.isHousing}
          onChange={(event) => setForm("isHousing", event.target.checked)}
          infoTooltip="Marque se o valor do aluguel não deve ser considerado no cálculo."
        />
        {!form.isHousing && (
          <>
            <CurrencyInput
              label="Valor inicial do aluguel:"
              id="initialRentValue"
              value={form.initialRentValue}
              onChange={(v) => setForm("initialRentValue", Number(v.target.value))}
              disabled={form.isHousing}
            />

            <DatePicker
              label="Início do aluguel:"
              defaultValue={dayjs().add(1, "month").format("MM/YYYY")}
              onChange={(v) => setForm("initialRentMonth", v)}
            />

            <PercentageInput
              label="Valorização anual do aluguel:"
              id="rentAppreciationRate"
              value={form.rentAppreciationRate}
              infoTooltip="Taxa percentual de aumento anual do valor do aluguel, baseada na valorização do imóvel e condições de mercado."
              onChange={(v) => setForm("rentAppreciationRate", Number(v.target.value))}
            />
          </>
        )}
      </div>
    </div>
  );
}
