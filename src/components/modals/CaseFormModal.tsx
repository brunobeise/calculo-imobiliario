import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  ModalDialog,
  Input,
  FormHelperText,
  FormControl,
  Typography,
} from "@mui/joy";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { caseService } from "@/service/caseService";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import PropertyDataDisplay from "../shared/PropertyDataDisplay";
import { navigate } from "vike/client/router";
import { Proposal } from "@/types/proposalTypes";
import BooleanInput from "../inputs/BooleanInput";
import { CaseStudyTypeLinkMap, getCaseLink } from "@/lib/maps";

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
  subType,
  duplicate,
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

  const handleCreate: SubmitHandler<CaseFormData> = async (data) => {
    setLoading(true);
    try {
      const newCase = await caseService.createCase({
        ...data,
        propertyData: propertyData,
        type: caseType,
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
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        role="dialog"
        aria-labelledby="create-case-title"
        sx={{ width: { xs: "90%", sm: 500 } }}
      >
        <DialogTitle id="create-case-title">
          {editChoose ? "Editar estudo" : "Novo estudo"}
        </DialogTitle>
        <Divider />
        <DialogContent className="!p-2 !overflow-x-hidden">
          <form
            onSubmit={
              duplicate
                ? handleSubmit(handleDuplicate)
                : editChoose
                ? handleSubmit(handleEdit)
                : handleSubmit(handleCreate)
            }
            id="create-case-form"
            className="flex flex-col gap-5 w-full"
          >
            <FormControl error={!!errors.name}>
              <Typography component="label" htmlFor="name" mb={1}>
                Nome do estudo *
              </Typography>
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
              <Typography component="label" htmlFor="propertyName" mb={1}>
                Nome do imóvel
              </Typography>
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
                  />
                )}
              />
            </FormControl>

            <PropertyDataDisplay
              subType={subType}
              propertyData={propertyData}
            />
          </form>
        </DialogContent>
        <Divider />
        <DialogActions>
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
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default CaseFormModal;
