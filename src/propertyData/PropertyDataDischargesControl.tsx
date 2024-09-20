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

export interface Discharge {
  initialMonth: number;
  month: number;
  value: number;
  type: string;
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
      month: null,
      amount: 0,
      installments: 1,
    },
  });

  const onSubmit = (data: {
    dischargeType: string | null;
    month: number | null;
    amount: number;
    installments: number | null;
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

    const newDischarges: Discharge[] = [];
    const finalMonth = propertyData.finalYear * 12;
    const startMonth = Number(data.month) || 1;
    const maxInstallments = data.installments || Infinity;
    let installmentCount = 0;

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

    if (data.dischargeType && data.dischargeType !== "personalized") {
      const step = increment(data.dischargeType);
      for (
        let i = startMonth;
        i <= finalMonth && installmentCount < maxInstallments;
        i += step
      ) {
        newDischarges.push({
          month: i,
          value: data.amount,
          type: typeMap[data.dischargeType],
          initialMonth: startMonth,
        });
        installmentCount++;
      }
    } else if (data.dischargeType === "personalized" && startMonth) {
      newDischarges.push({
        month: startMonth,
        value: data.amount,
        type: `${typeMap[data.dischargeType]} ${startMonth}`,
        initialMonth: startMonth,
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
    setpropertyData(
      "discharges",
      propertyData.discharges.filter(
        (discharge) =>
          !(
            discharge.initialMonth === group.initialMonth &&
            discharge.value === group.value &&
            discharge.type === group.type
          )
      )
    );
  };

  interface GroupedDischarge extends Omit<Discharge, "month"> {
    finalMonth: number;
    count: number;
  }

  const groupDischarges = (discharges: Discharge[]): GroupedDischarge[] => {
    const grouped = discharges.reduce((acc, discharge) => {
      const key = `${discharge.initialMonth}-${discharge.value}-${discharge.type}`;
      if (!acc[key]) {
        acc[key] = {
          initialMonth: discharge.initialMonth,
          value: discharge.value,
          type: discharge.type,
          finalMonth: discharge.month,
          count: 1,
        };
      } else {
        acc[key].finalMonth = Math.max(acc[key].finalMonth, discharge.month);
        acc[key].count += 1;
      }
      return acc;
    }, {} as Record<string, GroupedDischarge>);

    return Object.values(grouped);
  };

  const selectedDischargeType = watch("dischargeType");

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
            <FaMagnifyingGlass
              onClick={() => setDischargesDetailModal(true)}
              className="text-sm text-[#a3a3a3] cursor-pointer"
            />
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
                <th>Mês Inicial</th>
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
                    <td>{item.initialMonth}</td>
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
                <FormLabel>
                  {selectedDischargeType === "personalized"
                    ? "Mês:"
                    : "Mês inicial"}
                </FormLabel>
                <Controller
                  name="month"
                  control={control}
                  rules={{
                    required: "Mês é obrigatório",
                    min: { value: 1, message: "Mês deve ser maior que 0" },
                    max: {
                      value: propertyData.finalYear * 12,
                      message: `Mês deve ser menor que ${
                        propertyData.finalYear * 12
                      }`,
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      slotProps={{
                        input: {
                          min: 1,
                          max: propertyData.finalYear * 12,
                          step: 1,
                        },
                      }}
                      value={field.value ?? undefined}
                      error={!!errors.month}
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
                      control={control}
                      rules={{
                        required: "Limite é obrigatório",
                        min: {
                          value: 1,
                          message: "Limite deve ser maior que 0",
                        },
                        max: {
                          value: propertyData.finalYear * 12,
                          message: `Mês deve ser menor que ${
                            propertyData.finalYear * 12
                          }`,
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          slotProps={{
                            input: {
                              min: 1,
                              max: propertyData.finalYear * 12,
                              step: 1,
                            },
                          }}
                          value={field.value ?? undefined}
                          error={!!errors.month}
                        />
                      )}
                    />
                    {errors.month && (
                      <FormHelperText>{errors.month.message}</FormHelperText>
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
                      label="Valor do aporte:"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                {errors.amount && (
                  <FormHelperText>{errors.amount.message}</FormHelperText>
                )}
              </FormControl>
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
          sx={{ width: { xs: "90%", sm: 500 } }}
        >
          <DialogTitle>Aportes adicionais</DialogTitle>
          <DialogContent className="overflow-y-auto">
            <Table>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {propertyData.discharges
                  ?.sort((a, b) => a.month - b.month)
                  .map((item, index) => (
                    <tr key={index}>
                      <td>{item.month}</td>
                      <td>{toBRL(item.value)}</td>
                      <td className="flex justify-end items-center">
                        <FaTrash
                          onClick={() => handleRemoveDischarge(index)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
}
