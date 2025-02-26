/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Input,
  FormHelperText,
  FormControl,
  FormLabel,
  Button,
} from "@mui/joy";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import PictureInput from "../inputs/PictureInput";
import { uploadImage } from "@/lib/imgur";
import { userService } from "@/service/userService";
import { User } from "@/types/userTypes";
import Dialog from "../modals/Dialog";
import MaskInputPhone from "../inputs/masks/MaskInputPhone";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  userAdded?: () => void;
  editUser?: User;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  userAdded,
  editUser,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<User>();

  const [uploadLoading, setUploadLoading] = useState(false);

  const handleFormSubmit: SubmitHandler<User> = async (data) => {
    setUploadLoading(true);
    try {
      let uploadedPhoto = data.photo;

      if (data.photo && !data.photo.includes("res.cloudinary.com")) {
        uploadedPhoto = await uploadImage(data.photo);
      }

      const updatedData = {
        ...data,
        photo: uploadedPhoto,
      };
      if (editUser) {
        const { realEstate, realEstateId, _count, casesCount, ...data } =
          updatedData;
        await userService.editUser(editUser.id, data);
      } else await userService.createUser(updatedData);

      reset();
      onClose();
      userAdded && userAdded();
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    if (editUser) reset(editUser);
  }, [editUser, reset]);

  return (
    <Dialog
      actions={
        <>
          <Button
            type="submit"
            form="create-user-form"
            loading={uploadLoading}
            variant="solid"
            color="primary"
          >
            {editUser ? "Salvar" : "Criar"}
          </Button>
          <Button
            disabled={uploadLoading}
            variant="plain"
            color="neutral"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </>
      }
      title={editUser ? "Editar Usuário" : "Criar Usuário"}
      open={open}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        id="create-user-form"
        className="flex flex-col gap-5 w-full px-2"
      >
        <FormControl>
          <Controller
            control={control}
            name="photo"
            render={({ field }) => (
              <PictureInput
                value={[field.value]}
                label="Foto"
                onChange={field.onChange}
              />
            )}
          />
        </FormControl>
        <FormControl error={!!errors.fullName}>
          <FormLabel htmlFor="fullName">Nome Completo *</FormLabel>
          <Input
            id="fullName"
            placeholder="Digite o nome completo"
            {...register("fullName", {
              required: "Nome completo é obrigatório",
            })}
            error={!!errors.fullName}
          />
          {errors.fullName && (
            <FormHelperText>{errors.fullName.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={!!errors.email}>
          <FormLabel htmlFor="email">Email *</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="Digite o email"
            {...register("email", {
              required: "Email é obrigatório",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Formato de email inválido",
              },
            })}
            error={!!errors.email}
          />
          {errors.email && (
            <FormHelperText>{errors.email.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={!!errors.role}>
          <FormLabel htmlFor="role">Função *</FormLabel>
          <Input
            id="role"
            placeholder="Digite a função"
            {...register("role", { required: "Função é obrigatória" })}
            error={!!errors.role}
          />
          {errors.role && (
            <FormHelperText>{errors.role.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="creci">CRECI</FormLabel>
          <Input
            id="creci"
            placeholder="Digite o CRECI"
            {...register("creci")}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="address">Endereço</FormLabel>
          <Input
            id="address"
            placeholder="Digite o endereço"
            {...register("address")}
          />
        </FormControl>

        <FormControl error={!!errors.phone}>
          <FormLabel htmlFor="phone">Telefone *</FormLabel>
          <Input
            id="phone"
            slotProps={{
              input: {
                component: MaskInputPhone,
                onChange: (event) => setValue("phone", event.target.value), // Garante que o React Hook Form receba o valor limpo
                value: watch("phone") || "", // Mantém a sincronia do campo
              },
            }}
            placeholder="Digite o telefone"
            {...register("phone", {
              required: "Telefone é obrigatório",
              pattern: {
                value: /^\d{11}$/, // Regex para garantir que tenha exatamente 11 números
                message:
                  "Número inválido. O formato correto é DDD + número (11 dígitos).",
              },
            })}
            error={!!errors.phone}
          />
          {errors.phone && (
            <FormHelperText>{errors.phone.message}</FormHelperText>
          )}
        </FormControl>

        <div className="grid grid-cols-2 gap-x-5 gap-y-5">
          <FormControl>
            <FormLabel htmlFor="whatsapp">WhatsApp</FormLabel>
            <Input
              id="whatsapp"
              placeholder="link do WhatsApp"
              {...register("whatsapp")}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="instagram">Instagram</FormLabel>
            <Input
              id="instagram"
              placeholder="link do Instagram"
              {...register("instagram")}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="facebook">Facebook</FormLabel>
            <Input
              id="facebook"
              placeholder="link do Facebook"
              {...register("facebook")}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="linkedin">LinkedIn</FormLabel>
            <Input
              id="linkedin"
              placeholder="link do LinkedIn"
              {...register("linkedin")}
            />
          </FormControl>
        </div>
      </form>
    </Dialog>
  );
};

export default UserFormModal;
