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

        <PercentageInput
          label="CDI:"
          id="cdi"
          value={form.cdi}
          onChange={(v) => setForm("cdi", Number(v.target.value))}
        />

        <PercentageInput
          placeholder={8}
          label="Taxa de desconto anual para valor presente:"
          id="PVDiscountRate"
          value={form.PVDiscountRate}
          onChange={(v) => setForm("PVDiscountRate", Number(v.target.value))}
        />

        {form.investTheRest && (
          <PercentageInput
            label="Rendimento mensal aplicação no mercado financeiro:"
            placeholder={"0,9"}
            id="monthlyYieldRate"
            value={form.monthlyYieldRate}
            onChange={(v) => setForm("monthlyYieldRate", Number(v.target.value))}
          />
        )}
      </div>
    </div>
  );
}
