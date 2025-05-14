import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  FormHelperText,
  FormControl,
  Typography,
  RadioGroup,
  Radio,
  FormLabel,
  Input,
} from "@mui/joy";
import { useForm } from "react-hook-form";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import CurrencyInput from "../inputs/CurrencyInput";
import { calcInstallmentValue } from "@/lib/calcs";
import PercentageInput from "../inputs/PercentageInput";
import Dialog from "./Dialog";

interface SimulationFormData {
  totalFinancedValue: number;
  interestRate: number;
  financingMonths: number;
  amortizationType: "PRICE" | "SAC";
}

interface InstallmentSimulationModalProps {
  open: boolean;
  onClose: () => void;
  onSimulate: (installmentValue: number) => void;
  totalFinanced: number;
}

const InstallmentSimulationModal: React.FC<InstallmentSimulationModalProps> = ({
  open,
  onClose,
  onSimulate,
  totalFinanced,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SimulationFormData>();

  const [installmentValue, setInstallmentValue] = useState<number | null>(null);
  const { propertyData } = useContext(propertyDataContext);

  const totalDownDischarges = (propertyData?.discharges || []).reduce(
    (acc, val) => (val.isDownPayment ? val.originalValue + acc : acc),
    0
  );

  const interestRate = watch("interestRate");
  const financingMonths = watch("financingMonths");
  const amortizationType = watch("amortizationType");
  const totalFinancedValue = watch("totalFinancedValue");

  useEffect(() => {
    if (interestRate !== undefined && financingMonths && amortizationType) {
      const simulatedValue =
        calcInstallmentValue(
          totalFinancedValue,
          interestRate,
          financingMonths,
          amortizationType
        ) + 150;
      setInstallmentValue(simulatedValue);
    }
  }, [
    interestRate,
    financingMonths,
    amortizationType,
    totalDownDischarges,
    totalFinancedValue,
  ]);

  useEffect(() => {
    if (!propertyData) return;
    setValue("totalFinancedValue", totalFinanced);

    setValue("interestRate", propertyData.interestRate || 0);
    setValue("financingMonths", propertyData.financingMonths || 0);
    setValue("amortizationType", propertyData.amortizationType || "PRICE");
  }, [propertyData, setValue, totalDownDischarges, totalFinanced]);

  const handleApplySimulatedValue = () => {
    if (installmentValue !== null) {
      onSimulate(installmentValue);
      onClose();
    }
  };

  return (
    <Dialog
      actions={
        <>
          {" "}
          <Button
            onClick={handleApplySimulatedValue}
            variant="solid"
            color="primary"
            disabled={installmentValue === null || installmentValue < 0}
          >
            Mudar valor da parcela para R$ {installmentValue?.toFixed(2)}
          </Button>
          <Button variant="plain" color="neutral" onClick={onClose}>
            Cancelar
          </Button>
        </>
      }
      title=" Simular Valor da Parcela"
      open={open}
      onClose={onClose}
    >
      <div className="!p-2 !overflow-x-hidden">
        <form
          id="simulate-installment-form"
          className="flex flex-col gap-5 w-full"
        >
          <FormControl error={!!errors.totalFinancedValue}>
            <CurrencyInput
              noHeight
              label="Valor Financiado"
              id="totalFinancedValue"
              value={totalFinancedValue}
              onChange={(e) =>
                setValue("totalFinancedValue", Number(e.target.value))
              }
            />
            {errors.totalFinancedValue && (
              <FormHelperText>
                {errors.totalFinancedValue.message}
              </FormHelperText>
            )}
          </FormControl>

          <div className="grid grid-cols-2 gap-3">
            <FormControl error={!!errors.interestRate}>
              <PercentageInput
                noHeight
                label="Juros nominal do financiamento"
                value={interestRate}
                id="interestRate"
                onChange={(v) =>
                  setValue("interestRate", Number(v.target.value))
                }
                min={0}
              />
              {errors.interestRate && (
                <FormHelperText>{errors.interestRate.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!errors.financingMonths}>
              <FormLabel htmlFor="financingMonths">
                Tempo do financiamento:
              </FormLabel>
              <Input
                id="financingMonths"
                value={financingMonths}
                {...register("financingMonths", {
                  required: "O prazo é obrigatório",
                  min: { value: 1, message: "Deve ser ao menos 1 ano" },
                  max: { value: 420, message: "Máximo de 35 anos" },
                })}
                type="number"
                endDecorator="Meses"
                slotProps={{
                  input: {
                    min: 1,
                    max: 420,
                    step: 1,
                  },
                }}
              />
              {errors.financingMonths && (
                <FormHelperText>
                  {errors.financingMonths.message}
                </FormHelperText>
              )}
            </FormControl>
          </div>

          <div className="relative">
            <FormLabel className="!mb-2">Modelo de amortização:</FormLabel>
            <RadioGroup
              name="amortizationType"
              value={amortizationType}
              onChange={(event) =>
                setValue(
                  "amortizationType",
                  event.target.value as "PRICE" | "SAC"
                )
              }
            >
              <div className="flex gap-10">
                <Radio value="PRICE" label="PRICE" />
                <Radio value="SAC" label="SAC" />
              </div>
            </RadioGroup>
          </div>

          {installmentValue !== null && (
            <div className="bg-neutral-100 p-4 rounded-lg">
              <Typography
                fontSize="lg"
                fontWeight="bold"
                textAlign="center"
                mb={1}
              >
                Valor Simulado da Parcela
              </Typography>
              <Typography
                className="!text-2xl"
                fontWeight="bold"
                color={installmentValue > 0 ? "primary" : "danger"}
                textAlign="center"
              >
                R$ {installmentValue.toFixed(2)}
              </Typography>
              <Typography fontSize="sm" textAlign="center" mt={1}>
                Inclui taxa fixa de R$ 150.
              </Typography>
            </div>
          )}
        </form>
      </div>
    </Dialog>
  );
};

export default InstallmentSimulationModal;
