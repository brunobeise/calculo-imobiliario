/* eslint-disable @typescript-eslint/no-explicit-any */
import { Slider } from "@mui/joy";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import PropertyDataDischargesControl from "@/propertyData/PropertyDataDischargesControl";

export default function PropertyDataStep3({
  form,
  setForm,
}: {
  form: PropertyData;
  setForm: (key: string, value: any) => void;
}) {
  return (
    <div className="p-5 !text-blackish">
      <h4 className="font-bold text-center">Entrada</h4>

      <div className="flex flex-col gap-5">
        <div className="mb-[-20px]">
          <div className="relative">
            <CurrencyInput
              label="Valor da entrada no ato:"
              id="downPayment"
              value={form.downPayment}
              onChange={(v) => setForm("downPayment", Number(v.target.value))}
            />
            {form.propertyValue && (
              <span className="text-sm absolute top-[50%] translate-y-[50%] right-[1rem]">
                {((form.downPayment / form.propertyValue) * 100).toFixed(2) +
                  "%"}
              </span>
            )}
          </div>

          <div className="relative mt-2">
            <Slider
              onChange={(_e, value) => {
                setForm(
                  "downPayment",
                  (form.propertyValue * (value as number)) / 10
                );
              }}
              value={(form.downPayment / form.propertyValue) * 10}
              defaultValue={0}
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

        <p className="text-sm">
          Adicione parcelamento da entrada, ou outros aportes adicionais ao
          longo do tempo:
        </p>

        <PropertyDataDischargesControl
          propertyData={form}
          setPropertyData={(field, value) => setForm(field, value)}
        />
      </div>
    </div>
  );
}
