import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import Dialog from "@/components/modals/Dialog";
import BooleanInputSwitch from "@/components/inputs/SwitchInput";
import { useEffect } from "react";

interface DuplicateModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    clientName: string;
    requestName: boolean;
  }) => void;
  defaultValues: { name: string; clientName: string; requestName: boolean };
}

export function DuplicatePortfolioModal({
  open,
  onClose,
  onConfirm,
  defaultValues,
}: DuplicateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Dialog
      actions={
        <div className="flex justify-center w-full mt-4">
          <Button onClick={handleSubmit(onConfirm)} type="submit">
            Confirmar
          </Button>
        </div>
      }
      open={open}
      onClose={onClose}
      title="Duplicar Portfólio"
    >
      <form className="flex flex-col gap-4 w-[400px]">
        <FormControl error={!!errors.name}>
          <FormLabel>Nome</FormLabel>
          <Input {...register("name", { required: "Campo obrigatório" })} />

          {errors.name && (
            <FormHelperText>{errors.name.message as string}</FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <FormLabel>Cliente</FormLabel>
          <Input {...register("clientName")} />
        </FormControl>
        <div className="mt-2">
          <BooleanInputSwitch
            label="Solicitar Nome"
            checked={watch("requestName")}
            onChange={(v) => setValue("requestName", v)}
          />
        </div>
      </form>
    </Dialog>
  );
}
