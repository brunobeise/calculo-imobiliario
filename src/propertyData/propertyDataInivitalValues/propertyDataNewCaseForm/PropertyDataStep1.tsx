/* eslint-disable @typescript-eslint/no-explicit-any */
import DatePicker from "@/components/inputs/DatePickerInput"; // Supondo que você tenha um DatePicker já implementado
import { FormLabel, Input } from "@mui/joy";
import InfoTooltip from "@/components/ui/InfoTooltip";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import dayjs from "dayjs";

export default function PropertyDataStep1({
  form,
  setForm,
}: {
  form: PropertyData;
  setForm: (key: string, value: any) => void;
}) {
  return (
    <div className="p-5 !text-blackish">
      <h4 className="font-bold text-center">Início do Estudo</h4>

      <p className="my-4 text-sm">
        Para começar, defina a data de início do estudo, bem como o período para
        o qual deseja calcular os valores.
      </p>

      <div className="flex flex-col gap-5">
        <DatePicker
          defaultValue={dayjs().format("MM/YYYY")}
          label="Data de ínicio do estudo"
          onChange={(v) => setForm("initialDate", v)}
        />

        <div>
          <div className="flex items-center h-[40px]">
            <FormLabel htmlFor="finalYear">Calcular até:</FormLabel>
            <InfoTooltip text="Define o período de tempo em anos que o cálculo é feito." />
          </div>

          <Input
            id="finalYear"
            value={form?.finalYear}
            onChange={(v) => {
              const value = Number(v.target.value);
              if (value > 0 && value <= 35) setForm("finalYear", value);
            }}
            type="number"
            endDecorator="Anos"
            slotProps={{
              input: {
                step: 1,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
