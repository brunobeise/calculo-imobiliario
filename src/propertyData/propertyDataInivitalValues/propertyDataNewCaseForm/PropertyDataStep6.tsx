/* eslint-disable @typescript-eslint/no-explicit-any */
import BooleanInput from "@/components/inputs/BooleanInput";
import PercentageInput from "@/components/inputs/PercentageInput";
import { PropertyData } from "@/propertyData/PropertyDataContext";

export default function PropertyDataStep6({
  form,
  setForm,
}: {
  form: PropertyData;
  setForm: (key: string, value: any) => void;
}) {
  return (
    <div className="p-5 !text-blackish">
      <h4 className="font-bold text-center">Valorização e Rentabilidade</h4>

      <p className="my-4 text-sm">
        Preencha os detalhes sobre a valorização anual do imóvel e do aluguel,
        assim como a rentabilidade das aplicações financeiras e outras taxas
        importantes para o cálculo.
      </p>

      <BooleanInput
        label="Investir o restante"
        checked={form.investTheRest}
        onChange={(event) => setForm("investTheRest", event.target.checked)}
      />

      <div className="grid grid-cols-2 gap-5 mt-5">
        <PercentageInput
          label="Taxa de corretagem na venda:"
          placeholder={6}
          id="brokerageFee"
          value={form.brokerageFee}
          onChange={(v) => setForm("brokerageFee", Number(v.target.value))}
        />

        {form.investTheRest && (
          <PercentageInput
            label="Rendimento anual aplicação no mercado financeiro:"
            placeholder={"12"}
            id="annualYieldRate"
            value={form.annualYieldRate}
            onChange={(v) => {
              setForm("annualYieldRate", Number(v.target.value));
            }}
          />
        )}
      </div>
    </div>
  );
}
