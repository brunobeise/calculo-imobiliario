import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginService } from "@/service/loginService";

interface LoginFormInputs {
  email: string;
  password: string;
  newPassword?: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      if (!isFirstAccess) {
        const response = await loginService.login(data.email, data.password);

        if (response.isFirstAccess) {
          setIsFirstAccess(true);
          setUserId(response.user.id);
          reset({ password: "", newPassword: "" });
        } else {
          window.location.reload();
        }
      } else if (userId && data.newPassword) {
        await loginService.setPassword(userId, data.newPassword);
        window.location.reload();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-[400px] flex flex-col gap-10 rounded-sm shadow-lg p-5 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div>
          <Typography className="text-center" level="h3" component="h1">
            <b>Cálculo Imobiliário</b>
          </Typography>
        </div>
        {!isFirstAccess && (
          <>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                {...register("email", { required: "Digite seu e-mail" })}
                type="email"
                placeholder="seu@email.com"
                disabled={isFirstAccess}
              />
              {errors.email && (
                <Typography level="body-sm" color="danger">
                  {errors.email.message}
                </Typography>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Senha</FormLabel>
              <Input
                placeholder="*Deixe vazio se for o primeiro acesso"
                {...register("password")}
                type="password"
                disabled={isFirstAccess && !errors.password}
              />
              {errors.password && (
                <Typography level="body-sm" color="danger">
                  {errors.password.message}
                </Typography>
              )}
            </FormControl>
          </>
        )}

        {isFirstAccess && (
          <FormControl>
            <FormLabel>Nova Senha</FormLabel>
            <Input
              {...register("newPassword", {
                required: "Cadastre uma senha para continuar",
              })}
              type="password"
              placeholder="Defina uma senha para continuar"
            />
            {errors.newPassword && (
              <Typography level="body-sm" color="danger">
                {errors.newPassword.message}
              </Typography>
            )}
          </FormControl>
        )}
        <Button type="submit" sx={{ mt: 1 /* margin top */ }} loading={loading}>
          {isFirstAccess ? "Definir Senha" : "Entrar"}
        </Button>
      </div>
    </form>
  );
}
