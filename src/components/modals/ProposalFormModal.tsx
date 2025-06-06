import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  FormHelperText,
  FormControl,
  FormLabel,
} from "@mui/joy";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { caseService } from "@/service/caseService";
import { navigate } from "vike/client/router";
import { Proposal } from "@/types/proposalTypes";
import BooleanInput from "../inputs/BooleanInput";
import Dialog from "./Dialog";
import CaseSubTypeSelect from "../shared/CaseSubTypeSelect";

interface ProposalFormData {
  name: string;
  shared: boolean;
  subType: string;
}

interface ProposalFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Proposal;
  duplicate?: boolean;
  caseAdded?: (proposal: Proposal) => void;
  handleUpdate?: (proposal: Proposal) => void;
  displaySubType?: boolean;
  title?: string;
}

const ProposalFormModal: React.FC<ProposalFormModalProps> = ({
  open,
  onClose,
  initialData,
  duplicate,
  handleUpdate,
  displaySubType = true,
  title,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<ProposalFormData>({
    defaultValues: {
      name: "",
      shared: false,
      subType: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData && !duplicate;

  useEffect(() => {
    if (isEdit && initialData) {
      setValue("name", initialData.name);
      setValue("shared", initialData.shared);
      setValue("subType", initialData.subType || "");
    } else if (duplicate && initialData) {
      reset({ name: "", shared: false, subType: initialData.subType || "" });
    } else {
      reset({ name: "", shared: false, subType: "" });
    }
  }, [initialData, isEdit, duplicate, reset, setValue]);

  const onSubmit: SubmitHandler<ProposalFormData> = async (data) => {
    setLoading(true);
    try {
      if (duplicate && initialData) {
        const result = await caseService.duplicateCase({
          id: initialData.id,
          name: data.name,
          shared: data.shared,
        });

        navigate(`/propostas/${result.id}`);
      } else {
        handleUpdate && handleUpdate({ ...initialData, ...data });
        onClose();
      }
    } catch (error) {
      console.error("Erro no envio do formulário:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title={title ? title : isEdit ? "Editar proposta" : "Duplicar proposta"}
      open={open}
      onClose={onClose}
      actions={
        <>
          <Button
            type="submit"
            form="proposal-form"
            loading={loading}
            variant="solid"
            color="primary"
          >
            {isEdit ? "Salvar" : duplicate ? "Duplicar" : "Salvar"}
          </Button>
          <Button
            disabled={loading}
            variant="plain"
            color="neutral"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </>
      }
    >
      <form
        id="proposal-form"
        className="flex flex-col gap-5 w-full p-3 !w-[500px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl error={!!errors.name}>
          <FormLabel>Nome</FormLabel>
          <Input
            id="name"
            {...register("name", {
              required: "Nome da proposta é obrigatório",
            })}
            error={!!errors.name}
          />
          {errors.name && (
            <FormHelperText>{errors.name.message}</FormHelperText>
          )}
        </FormControl>

        {!duplicate && displaySubType && (
          <FormControl error={!!errors.subType}>
            <Controller
              name="subType"
              control={control}
              rules={{ required: "Subtipo é obrigatório" }}
              render={({ field }) => (
                <CaseSubTypeSelect
                  subType={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.subType && (
              <FormHelperText>{errors.subType.message}</FormHelperText>
            )}
          </FormControl>
        )}

        <FormControl>
          <Controller
            name="shared"
            control={control}
            render={({ field }) => (
              <BooleanInput
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                label="Compartilhar com colegas"
                infoTooltip="Corretores da mesma imobiliária poderão ver e criar propostas baseadas na sua."
              />
            )}
          />
        </FormControl>
      </form>
    </Dialog>
  );
};

export default ProposalFormModal;
