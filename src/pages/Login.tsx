import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginService } from "@/service/loginService";
import logo from "@/assets/imobDeal.png";

interface LoginFormInputs {
  email: string;
  password: string;
  newPassword?: string;
  verificationCode?: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [awaitingCode, setAwaitingCode] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      if (awaitingCode) {
        await loginService.verifyCode(data.email, data.verificationCode || "");
        setLoading(false);
        setIsFirstAccess(true);
        setAwaitingCode(false);
        setForgotPassword(false);
      } else if (forgotPassword) {
        await loginService.resetPassword(data.email);
        setAwaitingCode(true);
        setLoading(false);
      } else if (!isFirstAccess) {
        const response = await loginService.login(data.email, data.password);

        if (response.isFirstAccess) {
          setIsFirstAccess(true);
          reset({ password: "", newPassword: "", email: data.email });
        } else {
          window.location.reload();
        }
      } else if (isFirstAccess && data.newPassword) {
        await loginService.setPassword(data.email, data.newPassword);
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
          <div className="flex items-center flex-col">
            <img className="w-[120px]" src={logo} />
            <span className="text-primary">
              Imob<span className="font-bold">Deal</span>
            </span>
          </div>
        </div>
        {!isFirstAccess && !forgotPassword && (
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

        {isFirstAccess && !forgotPassword && (
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

        {forgotPassword &&
          (awaitingCode ? (
            <FormControl>
              <FormLabel>Código de verificação</FormLabel>
              <Input
                {...register("verificationCode", {
                  required: "Digite seu código de verificação",
                })}
                id="verificationCode"
                placeholder="digite o código enviado por e-mail"
                value={watch("verificationCode") || ""}
              />
            </FormControl>
          ) : (
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
          ))}

        <div>
          <Button
            type="submit"
            sx={{ mt: 1 /* margin top */ }}
            loading={loading}
            className="w-full"
          >
            {isFirstAccess
              ? "Definir Senha"
              : forgotPassword
              ? awaitingCode
                ? "Verificar Código"
                : "Enviar e-mail de confirmação"
              : "Entrar"}
          </Button>
          {!forgotPassword && !isFirstAccess && (
            <div className="text-center mt-4 text-grayText">
              <small
                onClick={() => setForgotPassword(true)}
                className="cursor-pointer"
              >
                Esqueceu sua senha?
              </small>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
