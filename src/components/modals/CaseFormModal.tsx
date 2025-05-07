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
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { navigate } from "vike/client/router";
import { Proposal } from "@/types/proposalTypes";
import BooleanInput from "../inputs/BooleanInput";
import { CaseStudyTypeLinkMap, getCaseLink } from "@/lib/maps";
import Dialog from "./Dialog";

interface CaseFormModalProps {
  open: boolean;
  onClose: () => void;
  caseType: string;
  subType: string;
  propertyData: PropertyData;
  editChoose: boolean;
  actualCase?: Proposal;
  caseAdded?: (newCase: Proposal) => void;
  duplicate?: boolean;
}

interface CaseFormData {
  name: string;
  shared: boolean;
  propertyName: string;
}

const CaseFormModal: React.FC<CaseFormModalProps> = ({
  open,
  onClose,
  caseType,
  caseAdded,
  propertyData,
  editChoose,
  actualCase,
  duplicate,
  subType,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    control,
  } = useForm<CaseFormData>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editChoose && actualCase) {
      setValue("name", actualCase?.name);
      setValue("shared", actualCase?.shared);
      setValue("propertyName", actualCase?.propertyName || "");
    } else reset();
  }, [editChoose, reset, actualCase, setValue]);

  useEffect(() => {
    if (actualCase && duplicate) {
      setValue("propertyName", actualCase?.propertyName || "");
    } else reset();
  }, [editChoose, duplicate, actualCase, setValue, reset]);

  const handleCreate: SubmitHandler<CaseFormData> = async (data) => {
    setLoading(true);
    try {
      const newCase = await caseService.createCase({
        ...data,
        propertyData: propertyData,
        type: caseType,
        subType,
      });

      reset();
      onClose();

      caseAdded && caseAdded(newCase);
      navigate(
        CaseStudyTypeLinkMap[
          newCase.type as keyof typeof CaseStudyTypeLinkMap
        ] +
          "/" +
          newCase.id
      );
    } catch (error) {
      console.error("Erro ao criar case:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit: SubmitHandler<CaseFormData> = async (data) => {
    setLoading(true);
    if (!actualCase?.id) return;
    try {
      await caseService.updateCase(actualCase.id, {
        ...data,
        propertyData: propertyData,
        type: caseType,
      });

      onClose();
      caseAdded &&
        caseAdded({
          ...actualCase,
          ...data,
          propertyData: propertyData,
          type: caseType,
        });
    } catch (error) {
      console.error("Erro ao editar case:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate: SubmitHandler<CaseFormData> = async (data) => {
    setLoading(true);
    try {
      const result = await caseService.duplicateCase({
        id: actualCase!.id,
        propertyName: data?.propertyName,
        name: data!.name,
        shared: data.shared,
      });
      const url = getCaseLink(actualCase?.type) + "/" + result.id;
      window.location.href = url;
      navigate(url);
    } catch (error) {
      console.error("Erro ao duplicar case:", error);
    } finally {
      onClose();
      setLoading(false);
    }
  };

  return (
    <Dialog
      title={editChoose ? "Editar proposta" : "Nova proposta"}
      open={open}
      onClose={onClose}
      actions={
        <>
          <Button
            type="submit"
            form="create-case-form"
            loading={loading}
            variant="solid"
            color="primary"
          >
            {editChoose ? "Salvar" : "Criar"}
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
        onSubmit={
          duplicate
            ? handleSubmit(handleDuplicate)
            : editChoose
            ? handleSubmit(handleEdit)
            : handleSubmit(handleCreate)
        }
        id="create-case-form"
        className="flex flex-col gap-5 w-full p-3 !w-[500px]"
      >
        <FormControl error={!!errors.name}>
          <FormLabel>Nome do estudo *</FormLabel>
          <Input
            id="name"
            placeholder="Digite o nome do case"
            {...register("name", {
              required: "Nome do case é obrigatório",
            })}
            error={!!errors.name}
          />
          {errors.name && (
            <FormHelperText>{errors.name.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={!!errors.name}>
          <FormLabel htmlFor="propertyName">Nome do imóvel</FormLabel>
          <Input
            id="propertyName"
            {...register("propertyName")}
            error={!!errors.propertyName}
          />
          {errors.propertyName && (
            <FormHelperText>{errors.propertyName.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <Controller
            name="shared"
            control={control}
            render={({ field }) => (
              <BooleanInput
                onChange={(e) => field.onChange(e.target.checked)}
                checked={field.value}
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

export default CaseFormModal;
