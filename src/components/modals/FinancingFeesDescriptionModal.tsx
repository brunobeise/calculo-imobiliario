import { Controller, useForm } from "react-hook-form";
import Dialog from "./Dialog";
import { FormControl, FormLabel, Input, Button } from "@mui/joy";
import CurrencyInput from "../inputs/CurrencyInput";
import { useEffect } from "react";

interface FinancingFeesDescriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (result: string) => void;
  value?: string; // novo prop opcional
}

interface FormData {
  installments: number;
  amount: number;
  description?: string;
}

export default function FinancingFeesDescriptionModal({
  open,
  onClose,
  onSubmit,
  value,
}: FinancingFeesDescriptionModalProps) {
  const { register, handleSubmit, reset, control, setValue } =
    useForm<FormData>();

  useEffect(() => {
    if (!open) return;

    if (value) {
      const match = value.match(/^(\d+)x de R\$ ([\d.,]+)(?: - (.*))?$/);
      if (match) {
        const installments = parseInt(match[1], 10);
        const amountStr = match[2];
        let amount: number;

        if (amountStr.includes(",")) {
          amount = parseFloat(amountStr.replace(/\./g, "").replace(",", "."));
        } else {
          amount = parseFloat(amountStr);
        }

        const description = match[3] || "";

        setValue("installments", installments);
        setValue("amount", amount);
        setValue("description", description);
      }
    } else {
      reset();
    }
  }, [value, setValue, reset, open]);

  const handleFormSubmit = (data: FormData) => {
    const result = `${data.installments}x de R$ ${Number(data.amount).toFixed(
      2
    )}${data.description ? ` - ${data.description}` : ""}`;
    onSubmit(result);

    onClose();
  };

  return (
    <Dialog title={"Parcelar documentação"} open={open} onClose={onClose}>
      <form
        className="w-[620px] grid grid-cols-2 gap-6 p-4 flex justify-center"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <FormControl>
          <FormLabel>Número de parcelas</FormLabel>
          <Input type="number" {...register("installments", { min: 1 })} />
        </FormControl>

        <FormControl>
          <FormLabel>Valor da parcela</FormLabel>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                noHeight
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormControl>

        <FormControl className="col-span-2">
          <FormLabel>Descrição (opcional)</FormLabel>
          <Input type="text" {...register("description")} />
        </FormControl>

        <Button className="col-span-2" type="submit">
          Confirmar
        </Button>
      </form>
    </Dialog>
  );
}
