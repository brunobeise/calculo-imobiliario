import CurrencyInput from "@/components/inputs/CurrencyInput";
import DatePicker from "@/components/inputs/DatePickerInput";
import { Sheet, Slider } from "@mui/joy";
import { CiCalculator2 } from "react-icons/ci";
import dayjs from "dayjs";
import PropertyDataDischargesControl from "../PropertyDataDischargesControl";
import { PropertyDataCardsProps } from "./PropertyDataCards";

export default function PropertyDataCardsDirectFinancingSimple({
  propertyData,
  setPropertyData,
  handleChangeNumber,
  totalDischarges,
  setFinancingFeesDescriptionModal,
}: PropertyDataCardsProps) {
  return (
    <form className="grid grid-cols-1 lg:grid cols-1 md:grid-cols-2 gap-5">
      <Sheet variant="outlined" color="neutral">
        <h2 className="text-xl text-center my-3 font-bold mt-10">
          Imóvel e Entrada
        </h2>

        <div className="p-5 px-12 w-full grid grid-cols-1 gap-10">
          <CurrencyInput
            label="Valor do imóvel"
            id="propertyValue"
            value={propertyData.propertyValue}
            onChange={(v) =>
              handleChangeNumber("propertyValue", v.target.value)
            }
          />

          <CurrencyInput
            disabled
            label="Total do recurso próprio"
            id="ownResource"
            value={totalDischarges + propertyData.downPayment}
            onChange={() => {}}
          />

          <div className="mb-[-25px]">
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
      <Sheet variant="outlined" color="neutral">
        <h2 className="text-xl text-center my-3 font-bold mt-10">
          Fluxo de Pagamento
        </h2>

        <div className="grid grid cols-1 md:grid-cols-2 gap-6 mt-6 px-12 pb-10">
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
            disabled={propertyData.financingFees === 0}
            opacity={propertyData.financingFees === 0}
            onChange={(v) => setPropertyData("financingFeesDate", v)}
          />
          <div className="col-span-2">
            <PropertyDataDischargesControl
              title="Fluxo de Pagamento"
              propertyData={propertyData}
              setPropertyData={setPropertyData}
              height="320px"
            />
          </div>
        </div>
      </Sheet>
    </form>
  );
}
