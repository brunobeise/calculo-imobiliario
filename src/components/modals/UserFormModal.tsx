import React, { useState } from "react";
import {
  Divider,
  Input,
  FormHelperText,
  FormControl,
  Typography,
  Button,
} from "@mui/joy";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import PictureInput from "../inputs/PictureInput";
import { uploadImage } from "@/lib/imgur";
import { userService } from "@/service/userService";
import { User } from "@/types/userTypes";
import Dialog from "./Dialog";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  userAdded?: (user: User) => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  userAdded,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
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

      const newUser = await userService.createUser(updatedData);

      reset();
      onClose();
      userAdded && userAdded(newUser);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
    } finally {
      setUploadLoading(false);
    }
  };

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
            Criar
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
      title="Criar Usuário"
      open={open}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        id="create-user-form"
        className="flex flex-col gap-5 w-full px-2"
      >
        <FormControl error={!!errors.fullName}>
          <Typography component="label" htmlFor="fullName" mb={1}>
            Nome Completo *
          </Typography>
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
          <Typography component="label" htmlFor="email" mb={1}>
            Email *
          </Typography>
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
          <Typography component="label" htmlFor="role" mb={1}>
            Função *
          </Typography>
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
          <Typography component="label" htmlFor="creci" mb={1}>
            CRECI
          </Typography>
          <Input
            id="creci"
            placeholder="Digite o CRECI"
            {...register("creci")}
          />
        </FormControl>

        <FormControl>
          <Typography component="label" htmlFor="address" mb={1}>
            Endereço
          </Typography>
          <Input
            id="address"
            placeholder="Digite o endereço"
            {...register("address")}
          />
        </FormControl>

        <FormControl>
          <Controller
            control={control}
            name="photo"
            render={({ field }) => (
              <PictureInput bordered label="Foto" onChange={field.onChange} />
            )}
          />
        </FormControl>

        <FormControl error={!!errors.phone}>
          <Typography component="label" htmlFor="phone" mb={1}>
            Telefone *
          </Typography>
          <Input
            id="phone"
            placeholder="Digite o telefone"
            {...register("phone", { required: "Telefone é obrigatório" })}
            error={!!errors.phone}
          />
          {errors.phone && (
            <FormHelperText>{errors.phone.message}</FormHelperText>
          )}
        </FormControl>

        <div className="grid grid-cols-2 gap-x-5 gap-y-5">
          <FormControl>
            <Typography component="label" htmlFor="whatsapp" mb={1}>
              WhatsApp
            </Typography>
            <Input
              id="whatsapp"
              placeholder="link do WhatsApp"
              {...register("whatsapp")}
            />
          </FormControl>

          <FormControl>
            <Typography component="label" htmlFor="instagram" mb={1}>
              Instagram
            </Typography>
            <Input
              id="instagram"
              placeholder="link do Instagram"
              {...register("instagram")}
            />
          </FormControl>

          <FormControl>
            <Typography component="label" htmlFor="facebook" mb={1}>
              Facebook
            </Typography>
            <Input
              id="facebook"
              placeholder="link do Facebook"
              {...register("facebook")}
            />
          </FormControl>

          <FormControl>
            <Typography component="label" htmlFor="linkedin" mb={1}>
              LinkedIn
            </Typography>
            <Input
              id="linkedin"
              placeholder="link do LinkedIn"
              {...register("linkedin")}
            />
          </FormControl>
        </div>
      </form>

      <Divider />
    </Dialog>
  );
};

export default UserFormModal;
