import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  ModalDialog,
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

interface SimulationFormData {
  propertyValue: number;
  downPayment: number;
  interestRate: number;
  financingYears: number;
  amortizationType: "PRICE" | "SAC";
}

interface InstallmentSimulationModalProps {
  open: boolean;
  onClose: () => void;
  onSimulate: (installmentValue: number) => void;
}

const InstallmentSimulationModal: React.FC<InstallmentSimulationModalProps> = ({
  open,
  onClose,
  onSimulate,
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

  const propertyValue = watch("propertyValue");
  const downPayment = watch("downPayment");
  console.log(downPayment);

  const interestRate = watch("interestRate");
  const financingYears = watch("financingYears");
  const amortizationType = watch("amortizationType");

  useEffect(() => {
    if (
      propertyValue &&
      downPayment !== undefined &&
      interestRate !== undefined &&
      financingYears &&
      amortizationType
    ) {
      const simulatedValue =
        calcInstallmentValue(
          propertyValue - downPayment,
          interestRate,
          financingYears,
          amortizationType
        ) + 150;
      setInstallmentValue(simulatedValue);
    }
  }, [
    propertyValue,
    downPayment,
    interestRate,
    financingYears,
    amortizationType,
    totalDownDischarges,
  ]);

  useEffect(() => {
    if (!propertyData) return;
    setValue("propertyValue", propertyData.propertyValue || 0);
    setValue(
      "downPayment",
      propertyData.downPayment + totalDownDischarges || 0
    );
    setValue("interestRate", propertyData.interestRate || 0);
    setValue("financingYears", propertyData.financingYears || 0);
    setValue("amortizationType", propertyData.amortizationType || "PRICE");
  }, [propertyData, setValue, totalDownDischarges]);

  const handleApplySimulatedValue = () => {
    if (installmentValue !== null) {
      onSimulate(installmentValue);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        role="dialog"
        aria-labelledby="simulate-installment-title"
        sx={{ width: { xs: "90%", sm: 500 } }}
      >
        <DialogTitle id="simulate-installment-title">
          Simular Valor da Parcela
        </DialogTitle>
        <Divider />
        <DialogContent className="!p-2 !overflow-x-hidden">
          <form
            id="simulate-installment-form"
            className="flex flex-col gap-5 w-full"
          >
            <FormControl error={!!errors.propertyValue}>
              <CurrencyInput
                noHeight
                label="Valor do Imóvel"
                value={propertyValue}
                id="propertyValue"
                onChange={(e) =>
                  setValue("propertyValue", Number(e.target.value))
                }
              />
              {errors.propertyValue && (
                <FormHelperText>{errors.propertyValue.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!errors.downPayment}>
              <CurrencyInput
                noHeight
                label="Valor da Entrada"
                id="downPayment"
                value={downPayment}
                onChange={(e) =>
                  setValue("downPayment", Number(e.target.value))
                }
              />
              {errors.downPayment && (
                <FormHelperText>{errors.downPayment.message}</FormHelperText>
              )}
            </FormControl>

            <div className="grid grid-cols-2 gap-5">
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

              <FormControl error={!!errors.financingYears}>
                <FormLabel htmlFor="financingYears">
                  Tempo do financiamento:
                </FormLabel>
                <Input
                  id="financingYears"
                  value={financingYears}
                  {...register("financingYears", {
                    required: "O prazo é obrigatório",
                    min: { value: 1, message: "Deve ser ao menos 1 ano" },
                    max: { value: 35, message: "Máximo de 35 anos" },
                  })}
                  type="number"
                  endDecorator="Anos"
                  slotProps={{
                    input: {
                      min: 1,
                      max: 35,
                      step: 1,
                    },
                  }}
                />
                {errors.financingYears && (
                  <FormHelperText>
                    {errors.financingYears.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="relative">
              <Typography
                component="label"
                htmlFor="amortizationType"
                mb={1}
                className="block text-sm font-medium text-gray-700"
              >
                Modelo de amortização:
              </Typography>
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
        </DialogContent>
        <Divider />
        <DialogActions>
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
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default InstallmentSimulationModal;