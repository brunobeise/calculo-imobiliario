import { useForm, Controller } from "react-hook-form";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  FormLabel,
} from "@mui/joy";
import PictureInput from "@/components/inputs/PictureInput";
import { uploadImage } from "@/lib/imgur";
import logo from "@/assets/imobDeal.png";
import { realEstateService } from "@/service/realEstateService";
import { useState } from "react";
import { useAuth } from "@/auth";
import { navigate } from "vike/client/router";
import MaskInputPhone from "@/components/inputs/masks/MaskInputPhone";

interface OnboardingFormData {
  name: string;
  email: string;
  phone: string;
  realEstateName: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
}

export default function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    defaultValues: {
      primaryColor: "#103759",
      secondaryColor: "#004e93",
    },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setLoading(true);
      let uploadLogo = data.logo;
      if (data.logo && !data.logo.includes("res.cloudinary.com")) {
        uploadLogo = await uploadImage(data.logo);
      }

      const finalData = { ...data, logo: uploadLogo };
      const success = await realEstateService.createOnboarding(finalData);
      if (success) {
        reset();
      }
    } finally {
      setLoading(false);
    }
  };

  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user.admin) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex justify-center flex-col items-center h-screen">
      <div className="flex items-center mb-10 flex-col">
        <img className="w-[120px]" src={logo} />
        <span className="text-primary">
          Imob<span className="font-bold">Deal</span>
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 w-full"
        style={{ width: "1000px" }}
      >
        <h5 className="col-span-2 font-bold">Dono da imobiliaria</h5>
        <FormControl error={!!errors.name}>
          <FormLabel htmlFor="name">Nome:</FormLabel>
          <Input
            id="name"
            {...register("name", { required: "Nome é obrigatório" })}
            error={!!errors.name}
          />
          {errors.name && (
            <FormHelperText>{errors?.name?.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={!!errors.phone}>
          <FormLabel htmlFor="phone">Telefone *</FormLabel>
          <Input
            id="phone"
            slotProps={{
              input: {
                component: MaskInputPhone,
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

        <FormControl className="col-span-2" error={!!errors.email}>
          <FormLabel htmlFor="email">E-mail:</FormLabel>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "E-mail é obrigatório" })}
            error={!!errors.email}
          />
          {errors.email && (
            <FormHelperText>{errors.email.message}</FormHelperText>
          )}
        </FormControl>

        <h5 className="col-span-2 font-bold mt-5">Imobiliária</h5>

        <div className="col-span-2  grid grid-cols-2 gap-10 w-full">
          <div className="flex flex-col gap-3">
            <FormControl error={!!errors.realEstateName}>
              <FormLabel htmlFor="realEstateName">
                Nome da Imobiliária:
              </FormLabel>
              <Input
                id="realEstateName"
                {...register("realEstateName", {
                  required: "Nome da imobiliária é obrigatório",
                })}
                error={!!errors.realEstateName}
              />
              {errors.realEstateName && (
                <FormHelperText>{errors.realEstateName.message}</FormHelperText>
              )}
            </FormControl>

            <div className="grid grid-cols-2 gap-5">
              <FormControl error={!!errors.primaryColor}>
                <FormLabel htmlFor="primaryColor">Cor Primária:</FormLabel>
                <Input
                  id="primaryColor"
                  type="color"
                  {...register("primaryColor", {
                    required: "Cor primária é obrigatória",
                  })}
                  error={!!errors.primaryColor}
                />
                {errors.primaryColor && (
                  <FormHelperText>{errors.primaryColor.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl error={!!errors.secondaryColor}>
                <FormLabel htmlFor="secondaryColor">Cor Secundária:</FormLabel>
                <Input
                  id="secondaryColor"
                  type="color"
                  {...register("secondaryColor", {
                    required: "Cor secundária é obrigatória",
                  })}
                  error={!!errors.secondaryColor}
                />
                {errors.secondaryColor && (
                  <FormHelperText>
                    {errors.secondaryColor.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
          </div>
          <div className="flex flex-col">
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <PictureInput
                  label="Logo:"
                  value={field.value ? [field.value] : []}
                  onChange={(v) => field.onChange(v)}
                />
              )}
            />
          </div>
        </div>
        <div className="col-span-2 flex justify-center mt-10">
          <Button loading={loading} type="submit" className="w-[300px]">
            Cadastrar
          </Button>
        </div>
      </form>
    </div>
  );
}
