import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Option,
  Select,
  Sheet,
  Table,
} from "@mui/joy";
import { useContext, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { propertyDataContext } from "./PropertyDataContext";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import { useForm, Controller } from "react-hook-form";
import { toBRL } from "@/lib/formatter";
import { FaMagnifyingGlass } from "react-icons/fa6";
import BooleanInput from "@/components/inputs/BooleanInput";
import PercentageInput from "@/components/inputs/PercentageInput";
import DatePicker from "@/components/inputs/DatePickerInput";
import dayjs from "dayjs";
import { calculatePresentValue } from "@/lib/calcs";

export interface Discharge {
  initialMonth: number;
  month: number;
  value: number;
  type: string;
  isDownPayment: boolean;
  indexType?: string;
  indexValue?: number;
  originalValue: number;
}

export default function PropertyDataDischargesControl() {
  const [addDischargeModal, setAddDischargeModal] = useState(false);
  const [dischargesDetailModal, setDischargesDetailModal] = useState(false);

  const { propertyData, setpropertyData } = useContext(propertyDataContext);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      dischargeType: null,
      month: dayjs().add(1, "month").format("MM/YYYY"),
      amount: 0,
      installments: 1,
      isDownPayment: true,
      indexType: null,
      indexValue: null,
    },
  });

  const onSubmit = (data: {
    dischargeType: string | null;
    month: string;
    amount: number;
    installments: number | null;
    isDownPayment: boolean;
    indexType?: string | null;
    indexValue?: number | null;
  }) => {
    const typeMap: Record<string, string> = {
      monthly: "Mensal",
      bimonthly: "Bimestral",
      quarterly: "Trimestral",
      "semi-annual": "Semestral",
      annual: "Anual",
      "three-yearly": "Tri-Anual",
      personalized: "Aporte Único",
    };

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

    const finalMonth = propertyData.finalYear * 12;

    const startMonth =
      dayjs(data.month, "MM/YYYY").diff(
        dayjs(dayjs(propertyData.initialDate), "MM/YYYY"),
        "month"
      ) + 1;

    const maxInstallments = data.installments || Infinity;
    let installmentCount = 0;

    if (data.dischargeType && data.dischargeType !== "personalized") {
      const step = increment(data.dischargeType);
      for (
        let i = startMonth;
        i <= finalMonth && installmentCount < maxInstallments;
        i += step
      ) {
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
          indexType: data.indexType || undefined,
          indexValue: data.indexValue || undefined,
          originalValue: data.amount,
        });
        installmentCount++;
      }
    } else if (data.dischargeType === "personalized" && startMonth) {
      newDischarges.push({
        month: startMonth,
        value: data.amount,
        type: `${typeMap[data.dischargeType]} ${startMonth}`,
        initialMonth: startMonth,
        isDownPayment: data.isDownPayment,
        indexType: data.indexType || undefined,
        indexValue: data.indexValue || undefined,
        originalValue: data.amount,
      });
    }

    setpropertyData("discharges", [
      ...propertyData.discharges,
      ...newDischarges,
    ]);

    reset();
    setAddDischargeModal(false);
  };

  const handleRemoveDischarge = (indexToRemove: number) => {
    setpropertyData(
      "discharges",
      propertyData.discharges.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveDischargeGroup = (group: GroupedDischarge) => {
    const newDischarges = propertyData.discharges.filter((discharge) => {
      return (
        discharge.initialMonth !== group.initialMonth ||
        discharge.type !== group.type
      );
    });

    setpropertyData("discharges", newDischarges);
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

  return (
    <Sheet
      variant="outlined"
      color="neutral"
      className={"p-3 rounded border-card"}
    >
      <DialogTitle className="flex i items-center justify-between pb-3">
        <span className="text-sm">
          <p className="text-lg flex items-center gap-2">
            Aportes Adicionais{" "}
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
                propertyData.discharges.reduce((acc, val) => acc + val.value, 0)
              )}
            </span>
          </p>
        </span>

        <Button
          size="sm"
          onClick={() => setAddDischargeModal(true)}
          className="ms-2"
          color="primary"
        >
          <FaPlus />
        </Button>
      </DialogTitle>
      <Divider />
      {propertyData.discharges.length > 0 && (
        <div className="overflow-y-auto max-h-[120px]">
          <Table stickyHeader>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Índice</th>
                <th>Início</th>
                <th>Parcelas</th>
                <th>Valor</th>
                <th className="w-[40px]"></th>
              </tr>
            </thead>
            <tbody>
              {groupDischarges(propertyData.discharges || []).map(
                (item, index) => (
                  <tr key={index}>
                    <td>{item.type}</td>
                    <td>{item.indexType}</td>
                    <td>
                      {dayjs(propertyData.initialDate, "MM/YYYY")
                        .add(item.initialMonth, "month")
                        .format("MM/YYYY")}
                    </td>
                    <td>{item.count}x</td>
                    <td>{toBRL(item.value)}</td>
                    <td className="flex justify-end items-center w-[40px]">
                      <FaTrash
                        onClick={() => handleRemoveDischargeGroup(item)}
                        style={{ cursor: "pointer" }}
                        title="Remover Grupo"
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Modal
        onClose={() => {
          reset();
          setAddDischargeModal(false);
        }}
        open={addDischargeModal}
      >
        <ModalDialog
          variant="outlined"
          role="dialog"
          aria-labelledby="create-discharge-title"
          sx={{ width: { xs: "90%", sm: 500 } }}
        >
          <DialogTitle className="flex items-center">
            {"Novo Aporte Adicional"}
          </DialogTitle>
          <Divider />
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent className="grid grid-rows !gap-4">
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
                    </Select>
                  )}
                />
                {errors.dischargeType && (
                  <FormHelperText>
                    {errors.dischargeType.message}
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
                      label="Mês inicial"
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.month && (
                  <FormHelperText>{errors.month.message}</FormHelperText>
                )}
              </FormControl>

              {watch("dischargeType") &&
                watch("dischargeType") !== "personalized" && (
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
                      label="Valor do aporte"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                {errors.amount && (
                  <FormHelperText>{errors.amount.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl className={"my-2"}>
                <Controller
                  name="isDownPayment"
                  control={control}
                  render={({ field }) => (
                    <BooleanInput
                      label="Contar como parte da entrada"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FormControl>

              {watch("isDownPayment") && (
                <div className="grid grid-cols-2 gap-4">
                  <FormControl error={!!errors.indexType}>
                    <FormLabel>Tipo do Índice</FormLabel>
                    <Controller
                      name="indexType"
                      control={control}
                      rules={{ required: "Selecione o tipo do índice" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onChange={(_e, v) => field.onChange(v)}
                          value={field.value}
                        >
                          <Option value={"INCC - M"}>INCC - M</Option>
                          <Option value={"IGP - M"}>IGP - M</Option>
                          <Option value={"IPCA"}>IPCA</Option>
                          <Option value={"TR"}>TR</Option>
                          <Option value={"CDI"}>CDI</Option>
                        </Select>
                      )}
                    />
                    {errors.indexType && (
                      <FormHelperText>
                        {errors.indexType.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl error={!!errors.indexValue}>
                    <Controller
                      name="indexValue"
                      control={control}
                      rules={{ required: "Coloque o valor da taxa mensal" }}
                      render={({ field }) => (
                        <PercentageInput
                          required={false}
                          noHeight
                          onChange={field.onChange}
                          label="Taxa (mensal)"
                          value={field.value || ""}
                        />
                      )}
                    />
                    {errors.indexValue && (
                      <FormHelperText>
                        {errors.indexValue.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button type="submit" variant="solid" color="primary">
                Adicionar
              </Button>
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
            </DialogActions>
          </form>
        </ModalDialog>
      </Modal>

      <Modal
        open={dischargesDetailModal}
        onClose={() => setDischargesDetailModal(false)}
      >
        <ModalDialog
          variant="outlined"
          role="dialog"
          aria-labelledby="create-discharge-title"
          sx={{ width: { xs: "90%", sm: 600 } }}
        >
          <DialogTitle>Aportes adicionais</DialogTitle>
          <DialogContent className="overflow-y-auto">
            <Table>
              <thead>
                <tr>
                  <th className="w-[90px]">Mês</th>
                  <th>Índice Mês</th>
                  <th>Valor</th>
                  <th>Valor Presente</th>
                  <th className="w-[30px]"></th>
                </tr>
              </thead>
              <tbody>
                {propertyData.discharges
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
                        <td>{item.indexType + ` ${item.indexValue}%`}</td>
                        <td>{toBRL(item.value)}</td>
                        <td>{toBRL(presentValue)}</td>
                        <td className="flex justify-end items-center">
                          <FaTrash
                            onClick={() => handleRemoveDischarge(index)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
}
