/* eslint-disable @typescript-eslint/no-explicit-any */

import { PropertyData } from "@/propertyData/PropertyDataContext";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import PercentageInput from "@/components/inputs/PercentageInput";

export default function PropertyDataStep2({
  form,
  setForm,
}: {
  form: PropertyData;
  setForm: (key: string, value: any) => void;
}) {
  return (
    <div className="p-5 !text-blackish">
      <h4 className="font-bold text-center">Informações do Imóvel</h4>

      <p className="my-4 text-sm">
        Preencha os detalhes do imóvel, como o valor total, valor da entrada e o
        subsídio, se aplicável.
      </p>

      <div className="flex flex-col gap-5">
        {/* Campo: Valor do imóvel */}
        <CurrencyInput
          label="Valor do imóvel"
          value={form?.propertyValue}
          onChange={(v) => setForm("propertyValue", Number(v.target.value))}
        />

        <CurrencyInput
          label="Valor do subsídio:"
          id="subsidy"
          value={form.subsidy}
          onChange={(v) => setForm("subsidy", Number(v.target.value))}
          disabled={form.isHousing}
        />

        <PercentageInput
          label="Valorização anual do imóvel:"
          placeholder={10}
          id="propertyAppreciationRate"
          value={form.propertyAppreciationRate}
          onChange={(v) =>
            setForm("propertyAppreciationRate", Number(v.target.value))
          }
        />
      </div>
    </div>
  );
}
