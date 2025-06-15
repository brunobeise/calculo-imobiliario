import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  UseFormHandleSubmit,
  UseFormClearErrors,
  FieldErrors,
  Control,
  Controller,
  UseFormSetError,
} from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
} from "@mui/joy";
import BooleanInputSwitch from "@/components/inputs/SwitchInput";
import { PortfolioWhatsappPreview } from "./PortfolioWhatsappPreview";
import PictureInput from "@/components/inputs/PictureInput";
import { Portfolio } from "@/types/portfolioTypes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LinkInput from "@/components/inputs/LinkInput";
import InfoTooltip from "@/components/ui/InfoTooltip";

interface PortfolioConfigProps {
  register: UseFormRegister<Portfolio>;
  setValue: UseFormSetValue<Portfolio>;
  setError: UseFormSetError<Portfolio>;
  watch: UseFormWatch<Portfolio>;
  handleSubmit: UseFormHandleSubmit<Portfolio>;
  clearErrors: UseFormClearErrors<Portfolio>;
  errors: FieldErrors<Portfolio>;
  control: Control<Portfolio>;
  onSubmit: (data: Portfolio) => void;
  loading: boolean;
  isOverLimit: boolean;
  portfolioId: string;
}

export default function PortfolioConfig({
  register,
  setValue,
  watch,
  handleSubmit,
  clearErrors,
  errors,
  control,
  onSubmit,
  portfolioId,
  setError,
}: PortfolioConfigProps) {
  const userData = useSelector((state: RootState) => state.user.userData);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-6 px-4 pb-4 w-full h-full pt-6"
      >
        <div className="flex-1 md:mb-0 grid grid-cols-2 gap-4 h-min">
          <div className="col-span-2">
            <Controller
              name="mainPhoto"
              control={control}
              render={({ field }) => (
                <>
                  <PictureInput
                    label="Imagem de capa"
                    value={field.value ? [field.value] : []}
                    onChange={(v) => {
                      field.onChange(v);
                      clearErrors("mainPhoto");
                    }}
                    multiple={false}
                  />
                  {!field.value && (
                    <p className="text-xs text-gray-500 mt-1">
                      Se não selecionar uma imagem, será usada a imagem do
                      primeiro item do portfólio automaticamente.
                    </p>
                  )}
                </>
              )}
            />
            {errors.mainPhoto && (
              <FormHelperText>{errors.mainPhoto.message}</FormHelperText>
            )}
          </div>
          <FormControl error={!!errors.name}>
            <FormLabel>
              Nome *{" "}
              <InfoTooltip text="Nome do portfólio, para controle interno" />
            </FormLabel>
            <Input {...register("name", { required: "Campo obrigatório" })} />
            {errors.name && (
              <FormHelperText>{errors.name.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl error={!!errors.title}>
            <FormLabel>
              Título{" "}
              <InfoTooltip text="O título será exibido na pré-visualização da mensagem, e no tobo da aba do navegador." />
            </FormLabel>
            <Input
              placeholder={
                watch("clientName")
                  ? `Portfólio para ${watch("clientName")}`
                  : `Portfólio personalizado - ${userData?.fullName}`
              }
              {...register("title")}
            />
            {errors.title && (
              <FormHelperText>{errors.title.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl className="col-span-2" error={!!errors.clientName}>
            <FormLabel>Cliente</FormLabel>
            <Input {...register("clientName")} />
          </FormControl>
          <FormControl error={!!errors.description}>
            <FormLabel>
              Descrição
              <InfoTooltip text="Será exibido na pré-visualização da mensagem" />
            </FormLabel>
            <Textarea
              minRows={3}
              {...register("description")}
              placeholder={`Confira o portfólio completo preparado por ${userData?.fullName}, com imóveis e propostas...`}
            />
            {errors.description && (
              <FormHelperText>{errors.description.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl error={!!errors.messageText}>
            <FormLabel>
              Texto da mensagem{" "}
              <InfoTooltip text="Use para criar um padrão de envio. Clique no link de copiar na pré-visualização ao lado, para enviar a mensagem para o cliente de forma ágil." />
            </FormLabel>
            <Textarea
              minRows={3}
              {...register("messageText")}
              placeholder="Texto que será enviado na mensagem"
            />
            {errors.messageText && (
              <FormHelperText>{errors.messageText.message}</FormHelperText>
            )}
          </FormControl>

          <Controller
            name="link"
            control={control}
            render={({ field, fieldState }) => (
              <LinkInput
                label="Link personalizado"
                type="portfolio"
                resourceId={portfolioId}
                error={fieldState.error?.message}
                startDecorator="app.imobdeal.com.br/portfolio/"
                value={field.value}
                onChange={field.onChange}
                handleError={(hasError: boolean) => {
                  if (hasError) {
                    setError("link", {
                      type: "manual",
                      message: "Link inválido",
                    });
                  } else {
                    clearErrors("link");
                  }
                }}
              />
            )}
          />

          <div className="col-span-2">
            <BooleanInputSwitch
              label="Solicitar Nome"
              checked={watch("requestName")}
              onChange={(v) => setValue("requestName", v)}
              infoTooltip="Quando ativado, ao abrir o link será exibida uma caixa para o usuário digitar seu nome antes de visualizar a proposta. Essa informação será solicitada apenas uma vez. Recomendado para quando o link será enviado para mais de uma pessoa, permitindo identificar quem visualizou."
            />
          </div>
        </div>

        <div className="w-[320px]">
          <PortfolioWhatsappPreview
            image={
              watch("mainPhoto") ||
              watch("items")[0]?.case?.mainPhoto ||
              watch("items")[0]?.building?.mainPhoto
            }
            title={
              watch("title") ||
              (watch("clientName")
                ? "Portfólio para " + watch("clientName")
                : `Portfólio personalizado - ${userData?.fullName}`)
            }
            description={
              watch("description") ||
              `Confira o portfólio completo preparado por ${userData?.fullName}, com imóveis e propostas...`
            }
            link={`app.imobdeal.com.br`}
            time="16:10"
            layout="horizontal"
          />
          <PortfolioWhatsappPreview
            image={
              watch("mainPhoto") ||
              watch("items")[0]?.case?.mainPhoto ||
              watch("items")[0]?.building?.mainPhoto
            }
            title={watch("name") || "Portfólio para Carlos Schroeder"}
            description={
              watch("messageText") ||
              `Olá [Nome do Cliente],

Preparei um portfólio especial com imóveis que combinam com o que você está buscando.
São opções selecionadas para você conhecer melhor cada imóvel e suas características e localização.`
            }
            link={`app.imobdeal.com.br/portfolio/${
              watch("link") || portfolioId
            }`}
            time="16:10"
          />
        </div>
      </form>
    </>
  );
}
