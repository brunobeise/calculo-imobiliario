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
  Checkbox,
} from "@mui/joy";
import { useForm, SubmitHandler } from "react-hook-form";
import { caseService, CaseStudy } from "@/service/caseService";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import PropertyDataDisplay from "../shared/PropertyDataDisplay";
import { useNavigate } from "react-router-dom";
import { CaseStudyTypeLinkMap } from "../shared/CaseCard";

interface CreateCaseModalProps {
  open: boolean;
  onClose: () => void;
  caseType: string;
  propertyData: PropertyData;
  editChoose: boolean;
  actualCase?: CaseStudy;
  caseAdded?: (newCase: {
    id: string;
    name: string;
    propertyData: PropertyData;
    type: string;
    createdAt: string;
    shared: boolean;
  }) => void;
}

interface CaseFormData {
  name: string;
  shared: boolean;
}

const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  open,
  onClose,
  caseType,
  caseAdded,
  propertyData,
  editChoose,
  actualCase,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<CaseFormData>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editChoose && actualCase) {
      setValue("name", actualCase?.name);
      setValue("shared", actualCase?.shared || false);
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
      const newCase = await caseService.updateCase(actualCase.id, {
        ...data,
        propertyData: propertyData,
        type: caseType,
      });

      onClose();
      caseAdded && caseAdded(newCase);
    } catch (error) {
      console.error("Erro ao editar case:", error);
    } finally {
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
          {editChoose ? "Editar Case" : "Criar Case"}
        </DialogTitle>
        <Divider />
        <DialogContent className="!p-2 !overflow-x-hidden">
          <form
            onSubmit={
              editChoose ? handleSubmit(handleEdit) : handleSubmit(handleCreate)
            }
            id="create-case-form"
            className="flex flex-col gap-5 w-full"
          >
            <FormControl error={!!errors.name}>
              <Typography component="label" htmlFor="name" mb={1}>
                Nome do Case *
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

            <FormControl>
              <Checkbox
                checked={watch("shared")}
                {...register("shared")}
                label="Compartilhar com colegas"
              />
            </FormControl>

            <PropertyDataDisplay propertyData={propertyData} />
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

export default CreateCaseModal;
