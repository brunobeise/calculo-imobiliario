import { Controller, useForm, useWatch } from "react-hook-form";
import Dialog from "./Dialog";
import {
  FormControl,
  Button,
  Select,
  Option,
  Textarea,
  FormLabel,
} from "@mui/joy";
import PercentageInput from "../inputs/PercentageInput";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import CurrencyInput from "../inputs/CurrencyInput";
import { FaArrowRight } from "react-icons/fa";

export interface FinancingCorrectionModalSubmit {
  monthlyRate: number;
  description: string;
}

interface FinancingCorrectionModalProps {
  startDate: string;
  studyDate: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (value: FinancingCorrectionModalSubmit) => void;
  value: number;
  totalfinanced: number;
  description: string;
}

interface FormData {
  correctionRate?: number;
  correctedTotal: number;
  description: string;
}

export default function FinancingCorrectionModal({
  open,
  onClose,
  onSubmit,
  totalfinanced,
  startDate,
  studyDate,
  value,
  description,
}: FinancingCorrectionModalProps) {
  const { handleSubmit, control, setValue, reset } = useForm<FormData>({
    defaultValues: {
      correctionRate: value,
      correctedTotal: totalfinanced,
      description: description,
    },
  });

  const [rateType, setRateType] = useState<"monthly" | "annual">("monthly");
  const watchRate = useWatch({ control, name: "correctionRate" });
  const watchDescription = useWatch({ control, name: "description" });

  useEffect(() => {
    if (!open) return;

    const formattedRate = value?.toString().replace(".", ",") ?? "0,00";

    reset({
      correctionRate: value,
      correctedTotal: totalfinanced,
      description:
        description ||
        `*Valor será corrigido com projeção de ${formattedRate}% a.m. (INCC-M) até o início.`,
    });
    setRateType("monthly");

    const rateDecimal = value ? value / 100 : 0;
    const months =
      dayjs(startDate, "MM/YYYY").diff(dayjs(studyDate, "MM/YYYY"), "month") -
      1;

    const correction =
      totalfinanced * Math.pow(1 + rateDecimal, months) - totalfinanced;

    setValue(
      "correctedTotal",
      parseFloat(totalfinanced + correction.toString())
    );
  }, [
    open,
    reset,
    setValue,
    totalfinanced,
    value,
    startDate,
    studyDate,
    description,
  ]);

  useEffect(() => {
    if (watchRate != null && !isNaN(watchRate)) {
      const rateDecimal =
        rateType === "annual"
          ? Math.pow(1 + watchRate / 100, 1 / 12) - 1
          : watchRate / 100;

      const start = dayjs(startDate, "MM/YYYY");
      const study = dayjs(studyDate, "MM/YYYY");

      const months = start.diff(study, "month") - 1;

      const correction =
        totalfinanced * Math.pow(1 + rateDecimal, months) - totalfinanced;

      setValue(
        "correctedTotal",
        parseFloat((totalfinanced + correction).toString())
      );

      const formattedRate = watchRate.toString().replace(".", ",");

      if (watchDescription && watchRate) {
        const newDesc = watchDescription.replace(
          /\d+([.,]\d+)?(?=% a\.m\.)/,
          formattedRate
        );

        setValue("description", newDesc);
      }
    }
  }, [
    watchRate,
    rateType,
    setValue,
    totalfinanced,
    startDate,
    studyDate,
    watchDescription,
  ]);

  const handleFormSubmit = (data: FormData) => {
    const rawRate = data.correctionRate ?? 0;
    const monthlyRate =
      rateType === "annual"
        ? (Math.pow(1 + rawRate / 100, 1 / 12) - 1) * 100
        : rawRate;

    onSubmit({ monthlyRate, description: data.description });
    onClose();
  };

  return (
    <Dialog title={"Corrigir Total Financiado"} open={open} onClose={onClose}>
      <form
        className="w-[670px] flex flex-col gap-6 p-4 justify-center"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="flex items-center gap-4 justify-center">
          <FormControl className="w-[200px]">
            <Controller
              name="correctionRate"
              control={control}
              render={({ field }) => (
                <PercentageInput
                  step={0.01}
                  required={false}
                  noHeight
                  label="Taxa de Correção"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormControl>

          <FormControl className="w-[160px] mt-6">
            <Select
              value={rateType}
              onChange={(_, val) => setRateType(val as "monthly" | "annual")}
            >
              <Option value="monthly">Mensal</Option>
              <Option value="annual">Anual</Option>
            </Select>
          </FormControl>
        </div>

        <span className="text-grayText text-xs ms-1">
          A taxa será aplicada com juros compostos do início do estudo{" "}
          {dayjs(studyDate, "MM/YYYY").format("MMM YYYY")} até o início do
          financiamento {dayjs(startDate, "MM/YYYY").format("MMM YYYY")}.
        </span>

        <FormControl>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  size="sm"
                  minRows={2}
                  maxRows={4}
                  value={watchRate ? field.value : ""}
                  onChange={field.onChange}
                />
              </FormControl>
            )}
          />
        </FormControl>

        <div className="flex gap-5 items-center justify-between">
          <FormControl>
            <CurrencyInput
              noHeight
              onChange={() => {}}
              label="Total Financiado"
              value={totalfinanced}
              disabled
            />
          </FormControl>

          <div className="flex items-center justify-center text-xl mt-6">
            <FaArrowRight />
          </div>

          <FormControl>
            <Controller
              name="correctedTotal"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  noHeight
                  label="Total Corrigido"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormControl>
        </div>

        <Button className="col-span-2" type="submit">
          Confirmar
        </Button>
      </form>
    </Dialog>
  );
}
