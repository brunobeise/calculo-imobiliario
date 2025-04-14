import {
  Button,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Option,
  Select,
  Sheet,
  Table,
} from "@mui/joy";
import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { PropertyData } from "./PropertyDataContext";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import { useForm, Controller } from "react-hook-form";
import { toBRL } from "@/lib/formatter";
import { FaMagnifyingGlass, FaPen } from "react-icons/fa6";

import PercentageInput from "@/components/inputs/PercentageInput";
import DatePicker from "@/components/inputs/DatePickerInput";
import dayjs from "dayjs";
import { calculatePresentValue } from "@/lib/calcs";
import Dialog from "@/components/modals/Dialog";

export interface Discharge {
  initialMonth: number;
  month: number;
  value: number;
  type: string;
  isDownPayment: boolean;
  isConstructionInterest: boolean;
  isInstallmentPlan: boolean;
  indexType?: string;
  indexValue?: number;
  originalValue: number;
  description?: string;
}

const typeMap: Record<string, string> = {
  monthly: "Mensal",
  bimonthly: "Bimestral",
  quarterly: "Trimestral",
  "semi-annual": "Semestral",
  annual: "Anual",
  "three-yearly": "Tri-Anual",
  personalized: "Aporte Único",
  "payment-in-kind": "Dação em Pagamento",
  "key-handover": "Entrega das Chaves",
};

export default function PropertyDataDischargesControl({
  propertyData,
  setPropertyData,
  height = "200px",
  title,
}: {
  propertyData: PropertyData;
  setPropertyData: (
    field: keyof PropertyData,
    value: PropertyData[keyof PropertyData]
  ) => void;
  height?: string;
  title?: string;
}) {
  const [addDischargeModal, setAddDischargeModal] = useState(false);
  const [dischargesDetailModal, setDischargesDetailModal] = useState(false);
  const [editDischargeIndex, setEditDischargeIndex] = useState<number | null>(
    null
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      dischargeType: null,
      month: dayjs().add(1, "month").format("MM/YYYY"),
      amount: 0,
      installments: 1,
      isDownPayment: true,
      isConstructionInterest: false,
      isInstallmentPlan: false,
      indexType: null,
      indexValue: 0,
      description: "",
    },
  });

  const onSubmit = (data: {
    dischargeType: string | null;
    month: string;
    amount: number;
    installments: number | null;
    isDownPayment: boolean;
    isConstructionInterest: boolean;
    isInstallmentPlan: boolean;
    indexType?: string | null;
    indexValue?: number;
    description?: string;
  }) => {
    setAddDischargeModal(false);

    const increment = (type: string): number => {
      switch (type) {
        case "monthly":
          return 1;
        case "bimonthly":
          return 2;
        case "quarterly":
          return 3;
        case "semi-annual":
          return 6;
        case "annual":
          return 12;
        case "three-yearly":
          return 36;
        default:
          return 1;
      }
    };

    const calculateValueWithInterest = (
      initialValue: number,
      indexValue: number,
      installment: number,
      installmentType: string
    ) => {
      const step = increment(installmentType);
      const effectiveRate = Math.pow(1 + indexValue, step) - 1;

      return initialValue * Math.pow(1 + effectiveRate, installment - 1);
    };

    const newDischarges: Discharge[] = [];

    const startMonth = dayjs(data.month, "MM/YYYY").diff(
      dayjs(propertyData.initialDate, "MM/YYYY"),
      "month"
    );

    const maxInstallments = data.installments || Infinity;
    let installmentCount = 0;

    if (
      data.dischargeType &&
      data.dischargeType !== "personalized" &&
      data.dischargeType !== "payment-in-kind" &&
      data.dischargeType !== "key-handover"
    ) {
      const step = increment(data.dischargeType);
      for (let i = startMonth; installmentCount < maxInstallments; i += step) {
        const effectiveIndexValue = data.indexValue ? data.indexValue / 100 : 0;

        const valueWithInterest = data.indexValue
          ? calculateValueWithInterest(
              data.amount,
              effectiveIndexValue,
              installmentCount + 1,
              data.dischargeType
            )
          : data.amount;

        newDischarges.push({
          month: i,
          value: valueWithInterest,
          type: typeMap[data.dischargeType],
          initialMonth: startMonth,
          isDownPayment: data.isDownPayment,
          isConstructionInterest: data.isConstructionInterest,
          isInstallmentPlan: data.isInstallmentPlan,
          indexType: data.indexType || undefined,
          indexValue: data.indexValue || undefined,
          originalValue: data.amount,
        });
        installmentCount++;
      }
    } else if (
      ((data.dischargeType === "personalized" ||
        data.dischargeType === "payment-in-kind") &&
        startMonth) ||
      data.dischargeType === "key-handover"
    ) {
      const monthsUntilHandover = startMonth;
      const monthlyRate = data.indexValue ? data.indexValue / 100 : 0;

      const correctedValue =
        data.dischargeType === "key-handover" && data.indexValue
          ? data.amount * Math.pow(1 + monthlyRate, monthsUntilHandover)
          : data.amount;

      newDischarges.push({
        month: startMonth,
        value: correctedValue,
        type: `${typeMap[data.dischargeType]} ${startMonth}`,
        initialMonth: data.dischargeType === "payment-in-kind" ? 0 : startMonth,
        isConstructionInterest: false,
        isDownPayment:
          data.dischargeType === "payment-in-kind"
            ? true
            : data.dischargeType === "key-handover"
            ? false
            : data.isDownPayment,
        isInstallmentPlan: false,
        indexType: data.indexType || undefined,
        indexValue: data.indexValue || undefined,
        originalValue: data.amount,
        description: data.description,
      });
    }


    if (editDischargeIndex !== null) {
      const original = propertyData.discharges[editDischargeIndex];
      const filtered = propertyData.discharges.filter(
        (d) =>
          d.initialMonth !== original.initialMonth || d.type !== original.type
      );

      setPropertyData("discharges", [...filtered, ...newDischarges]);
      setEditDischargeIndex(null);
    } else {
      setPropertyData("discharges", [
        ...propertyData.discharges,
        ...newDischarges,
      ]);
    }

    setTimeout(() => {
      reset();
    }, 500);
  };

  const handleRemoveDischargeGroup = (group: GroupedDischarge) => {
    const newDischarges = propertyData.discharges.filter((discharge) => {
      return (
        discharge.initialMonth !== group.initialMonth ||
        discharge.type !== group.type
      );
    });

    setPropertyData("discharges", newDischarges);
  };

  interface GroupedDischarge extends Omit<Discharge, "month"> {
    finalMonth: number;
    count: number;
  }

  const groupDischarges = (discharges: Discharge[]): GroupedDischarge[] => {
    const grouped = discharges.reduce((acc, discharge) => {
      const key = `${discharge.initialMonth}-${discharge.type}-${discharge.isDownPayment}-${discharge.indexType}`;

      if (!acc[key]) {
        acc[key] = {
          initialMonth: discharge.initialMonth,
          value: 0,
          type: discharge.type,
          finalMonth: discharge.month,
          count: 0,
          isDownPayment: discharge.isDownPayment,
          isConstructionInterest: discharge.isConstructionInterest,
          isInstallmentPlan: discharge.isInstallmentPlan,
          indexType: discharge.indexType,
          originalValue: discharge.originalValue,
        };
      }

      acc[key].value += discharge.value;
      acc[key].finalMonth = Math.max(acc[key].finalMonth, discharge.month);
      acc[key].count += 1;

      return acc;
    }, {} as Record<string, GroupedDischarge>);

    return Object.values(grouped);
  };

  const dischargeType = watch("dischargeType");

  return (
    <Sheet
      variant="outlined"
      color="neutral"
      style={{ height }}
      className="p-3 rounded border-card flex flex-col"
    >
      <DialogTitle className="flex items-center justify-between pb-3">
        <span className="text-sm">
          <p className="text-lg flex items-center gap-2">
            {title || "Aportes Adicionais"}
            {propertyData.discharges.length > 0 && (
              <FaMagnifyingGlass
                onClick={() => setDischargesDetailModal(true)}
                className="text-sm text-[#a3a3a3] cursor-pointer"
              />
            )}
          </p>
          <p className="mt-2">
            Total:
            <span className="ms-1 ">
              {toBRL(
                propertyData.discharges.reduce(
                  (acc, val) => acc + val.originalValue,
                  0
                )
              )}
            </span>
          </p>
        </span>

        <Button
          size="sm"
          onClick={() => {
            reset({
              dischargeType: null,
              month: dayjs().add(1, "month").format("MM/YYYY"),
              amount: 0,
              installments: 1,
              isDownPayment: true,
              isConstructionInterest: false,
              isInstallmentPlan: false,
              indexType: null,
              indexValue: 0,
              description: "",
            });
            setEditDischargeIndex(null);
            setAddDischargeModal(true);
          }}
          className="ms-2"
          color="primary"
        >
          <FaPlus />
        </Button>
      </DialogTitle>
      <Divider />
      {propertyData.discharges.length > 0 && (
        <div className={`overflow-y-auto max-h-[100%]`}>
          <Table variant="outlined" stickyHeader>
            <thead>
              <tr>
                <th className="!bg-grayScale-100">Tipo</th>
                <th className="!bg-grayScale-100">Modelo</th>
                <th className="!bg-grayScale-100">Parcelas</th>
                <th className="!bg-grayScale-100">Valor</th>
                <th className="w-[80px] !bg-grayScale-100"></th>
              </tr>
            </thead>
            <tbody>
              {groupDischarges(propertyData.discharges || []).map(
                (item, index) => (
                  <tr key={index}>
                    <td>{item.type}</td>
                    <td>
                      {item.isConstructionInterest
                        ? "Evolução de Obra"
                        : item.isDownPayment
                        ? "Entrada"
                        : item.isInstallmentPlan
                        ? "Parcelamento"
                        : "Reforços"}
                    </td>

                    <td>{item.count}x</td>
                    <td>{toBRL(item.originalValue)}</td>
                    <td className="flex justify-end items-center gap-2 w-[80px]">
                      <FaPen
                        className="cursor-pointer text-grayScale-700 hover:opacity-90"
                        onClick={() => {
                          const dischargeToEdit = groupDischarges(
                            propertyData.discharges
                          )[index];

                          const dischargeIndex =
                            propertyData.discharges.findIndex(
                              (d) =>
                                d.initialMonth ===
                                  dischargeToEdit.initialMonth &&
                                d.type === dischargeToEdit.type
                            );

                          const d = propertyData.discharges[dischargeIndex];
                          reset({
                            dischargeType:
                              Object.keys(typeMap).find(
                                (k) => typeMap[k] === d.type
                              ) ?? null,
                            month: dayjs(propertyData.initialDate, "MM/YYYY")
                              .add(d.month, "month")
                              .format("MM/YYYY"),
                            amount: d.originalValue,
                            installments:
                              groupDischarges(propertyData.discharges).find(
                                (g) =>
                                  g.initialMonth === d.initialMonth &&
                                  g.type === d.type
                              )?.count ?? 1,
                            isDownPayment: d.isDownPayment,
                            isConstructionInterest: d.isConstructionInterest,
                            isInstallmentPlan: d.isInstallmentPlan,
                            indexType: d.indexType ?? null,
                            indexValue: d.indexValue ?? 0,
                            description: d.description ?? "",
                          });

                          setEditDischargeIndex(dischargeIndex);
                          setAddDischargeModal(true);
                        }}
                        title="Editar"
                      />
                      <FaTrash
                        className="cursor-pointer text-grayScale-700 hover:opacity-90"
                        onClick={() => handleRemoveDischargeGroup(item)}
                        title="Remover"
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Dialog
        title={
          editDischargeIndex !== null
            ? "Editar Aporte"
            : "Novo Aporte Adicional"
        }
        onClose={() => {
          reset();
          setAddDischargeModal(false);
        }}
        open={addDischargeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-[500px]">
          <div className="grid grid-rows !gap-4 p-1 py-3">
            <FormControl error={!!errors.dischargeType}>
              <FormLabel>Tipo:</FormLabel>
              <Controller
                name="dischargeType"
                control={control}
                rules={{ required: "Tipo é obrigatório" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(_e, v) => field.onChange(v)}
                    value={field.value}
                  >
                    <Option value={"monthly"}>Mensal</Option>
                    <Option value={"bimonthly"}>Bimestral</Option>
                    <Option value={"quarterly"}>Trimestral</Option>
                    <Option value={"semi-annual"}>Semestral</Option>
                    <Option value={"annual"}>Anual</Option>
                    <Option value={"three-yearly"}>Tri-Anual</Option>
                    <Option value={"personalized"}>Aporte Único</Option>
                    <Option value={"payment-in-kind"}>
                      Dação em Pagamento
                    </Option>
                    <Option value={"key-handover"}>Entrega das Chaves</Option>
                  </Select>
                )}
              />
              {errors.dischargeType && (
                <FormHelperText>
                  {errors.dischargeType.message.toString()}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!errors.month}>
              <Controller
                name="month"
                control={control}
                rules={{
                  required: "Mês é obrigatório",
                  validate: (value) => {
                    const selectedDate = dayjs(value, "MM/YYYY");
                    if (!selectedDate.isValid()) {
                      return "Data inválida";
                    }
                    if (
                      !selectedDate.isAfter(
                        dayjs(propertyData.initialDate, "MM/YYYY")
                      )
                    ) {
                      return `O mês selecionado deve ser superior a ${dayjs(
                        propertyData.initialDate,
                        "MM/YYYY"
                      ).format("MM/YYYY")}`;
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    defaultValue={field.value}
                    noHeight
                    label={
                      dischargeType !== "personalized" &&
                      dischargeType !== "payment-in-kind" &&
                      watch("dischargeType") !== "key-handover"
                        ? "Mês inicial"
                        : "Mês"
                    }
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.month && (
                <FormHelperText>{errors.month.message}</FormHelperText>
              )}
            </FormControl>

            {watch("dischargeType") &&
              watch("dischargeType") !== "personalized" &&
              watch("dischargeType") !== "payment-in-kind" &&
              watch("dischargeType") !== "key-handover" && (
                <FormControl error={!!errors.installments}>
                  <FormLabel>Número de parcelas</FormLabel>
                  <Controller
                    name="installments"
                    rules={{
                      required: "Número de parcelas é obrigatório",
                      min: {
                        value: 1,
                        message: "Valor deve ser maior que 0",
                      },
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        value={field.value}
                        error={!!errors.installments}
                      />
                    )}
                  />
                  {errors.installments && (
                    <FormHelperText>
                      {errors.installments?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            <FormControl error={!!errors.amount}>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Valor do aporte é obrigatório",
                  min: { value: 1, message: "Valor deve ser maior que 0" },
                }}
                render={({ field }) => (
                  <CurrencyInput
                    noHeight
                    label="Valor"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              {errors.amount && (
                <FormHelperText>{errors.amount.message}</FormHelperText>
              )}
            </FormControl>
            {watch("dischargeType") !== "payment-in-kind" &&
              watch("dischargeType") !== "key-handover" && (
                <FormControl className="my-2">
                  <FormLabel className="block text-sm mb-2">
                    Modelo de amortização:
                  </FormLabel>
                  <Select
                    value={
                      watch("isDownPayment")
                        ? "true"
                        : watch("isConstructionInterest")
                        ? "construction"
                        : watch("isInstallmentPlan")
                        ? "installment"
                        : "false"
                    }
                    onChange={(_event, newValue) => {
                      if (newValue === "construction") {
                        setValue("isConstructionInterest", true);
                        setValue("isDownPayment", false);
                        setValue("isInstallmentPlan", false);
                      } else if (newValue === "installment") {
                        setValue("isInstallmentPlan", true);
                        setValue("isDownPayment", false);
                        setValue("isConstructionInterest", false);
                      } else {
                        setValue("isConstructionInterest", false);
                        setValue("isInstallmentPlan", false);
                        setValue("isDownPayment", newValue === "true");
                      }
                    }}
                  >
                    <Option value="true">Entrada</Option>
                    <Option value="false">Reforços</Option>
                    <Option value="construction">Evolução de Obra</Option>
                    <Option value="installment">Parcelamento</Option>
                  </Select>
                  {watch("isConstructionInterest") && (
                    <FormHelperText>
                      * Pagamentos como Evolução de Obra não alteram o total
                      financiado
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            {dischargeType === "payment-in-kind" &&
              watch("dischargeType") !== "key-handover" && (
                <FormControl error={!!errors.description}>
                  <FormLabel>Descrição:</FormLabel>
                  <Controller
                    name="description"
                    control={control}
                    rules={{
                      required:
                        "Descrição é obrigatória para Dação em Pagamento",
                    }}
                    render={({ field }) => (
                      <Input {...field} error={!!errors.description} />
                    )}
                  />
                  {errors.description && (
                    <FormHelperText>
                      {errors.description.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            {watch("dischargeType") !== "payment-in-kind" && (
              <div className="grid grid-cols-2 gap-4">
                {watch("dischargeType") === "key-handover" && (
                  <small className="text-gray-500 text-grayText col-span-2">
                    Você pode corrigir o valor da entrega das chaves até a data
                    selecionada informando uma taxa. Deixe em branco para
                    usar o valor atual, sem correção:
                  </small>
                )}
                <FormControl error={!!errors.indexType}>
                  <FormLabel>Tipo do Índice</FormLabel>
                  <Controller
                    name="indexType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        onChange={(_e, v) => field.onChange(v)}
                        value={field.value}
                      >
                        <Option value={"INCC - M"}>INCC - M</Option>
                        <Option value={"CUB"}>CUB</Option>
                        <Option value={"IGP - M"}>IGP - M</Option>
                        <Option value={"IPCA"}>IPCA</Option>
                        <Option value={"TR"}>TR</Option>
                        <Option value={"CDI"}>CDI</Option>
                      </Select>
                    )}
                  />
                  {errors.indexType && (
                    <FormHelperText>
                      {errors.indexType.message?.toString()}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl error={!!errors.indexValue}>
                  <Controller
                    name="indexValue"
                    control={control}
                    render={({ field }) => (
                      <PercentageInput
                        required={false}
                        noHeight
                        min={0}
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(e || 0)}
                        label="Taxa (mensal)"
                      />
                    )}
                  />
                  {errors.indexValue && (
                    <FormHelperText>{errors.indexValue.message}</FormHelperText>
                  )}
                </FormControl>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-5 mb-2">
            <Button
              variant="plain"
              color="neutral"
              onClick={() => {
                setAddDischargeModal(false);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="solid" color="primary">
              {editDischargeIndex !== null ? "Adicionar" : "Salvar"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={dischargesDetailModal}
        onClose={() => setDischargesDetailModal(false)}
        title={"Visão Detalhada"}
      >
        <div className="overflow-y-auto max-h-[720px] w-[800px]">
          <Table stickyHeader>
            <thead>
              <tr>
                <th className="w-[90px]">Mês</th>
                <th>Índice</th>
                <th>Valor Original</th>
                <th>Valor real</th>
                {propertyData.PVDiscountRate && <th>Valor Presente</th>}
              </tr>
            </thead>
            <tbody>
              {[...propertyData.discharges]
                ?.sort((a, b) => a.month - b.month)
                .map((item, index) => {
                  const period = item.month;
                  const presentValue = calculatePresentValue(
                    [item.value],
                    propertyData.PVDiscountRate,
                    [period]
                  );

                  return (
                    <tr key={index}>
                      <td>
                        {dayjs(propertyData.initialDate, "MM/YYYY")
                          .add(item.month, "month")
                          .format("MM/YYYY")}
                      </td>
                      <td>
                        {(item.indexType || "Nenhum") +
                          ` ${item.indexValue ? item.indexValue + "%" : ""}`}
                      </td>
                      <td>{toBRL(item.originalValue)}</td>
                      <td>{toBRL(item.value)}</td>
                      {propertyData.PVDiscountRate && (
                        <td>{toBRL(presentValue)}</td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </Dialog>
    </Sheet>
  );
}
