import {
  Divider,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemDecorator,
  Option,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/joy";
import { FaCalculator } from "react-icons/fa6";
import { LuBox } from "react-icons/lu";
import BooleanInput from "@/components/inputs/BooleanInput";
import BooleanInputSwitch from "@/components/inputs/SwitchInput";
import { ReportData } from "../ReportPreview";

interface ConfigSectionProps {
  configData: ReportData;
  onChange: (data: ReportData) => void;
}

export default function ConfigSection({
  configData,
  onChange,
}: ConfigSectionProps) {
  const { reportConfig } = configData;

  const handlePageViewToggle = (index: number, checked: boolean) => {
    const newMap = [...reportConfig.pageViewMap];
    newMap[index] = checked;
    onChange({
      ...configData,
      reportConfig: {
        ...reportConfig,
        pageViewMap: newMap,
      },
    });
  };

  const handleDownPaymentTypeChange = (value: string | null) => {
    onChange({
      ...configData,
      reportConfig: {
        ...reportConfig,
        PaymentConditionsConfig: {
          ...reportConfig.PaymentConditionsConfig,
          downPaymentCustomType: value || "",
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <h5 className="font-bold text-xl">Configurações</h5>

      {/* SUBTIPO */}
      <RadioGroup
        aria-label="subType"
        name="subType"
        value={configData.subType}
        onChange={(e) => onChange({ ...configData, subType: e.target.value })}
      >
        <List
          orientation="horizontal"
          className="!grid !grid-cols-2"
          sx={{
            "--List-gap": "0.5rem",
            "--ListItem-paddingY": "1rem",
            "--ListItem-radius": "8px",
            "--ListItemDecorator-size": "32px",
            textWrap: 'nowrap'
          }}
        >
          {["Simplificado", "Avançado"].map((label, i) => (
            <ListItem variant="outlined" key={label} sx={{ boxShadow: "sm" }}>
              <ListItemDecorator>
                {i === 0 ? <LuBox /> : <FaCalculator />}
              </ListItemDecorator>
              <Radio
                overlay
                value={label}
                label={label}
                sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                slotProps={{
                  action: ({ checked }) => ({
                    sx: (theme) =>
                      checked
                        ? {
                            inset: -1,
                            border: "2px solid",
                            borderColor: theme.vars.palette.primary[500],
                          }
                        : {},
                  }),
                }}
              />
            </ListItem>
          ))}
        </List>
      </RadioGroup>

      {configData.subType !== "Simplificado" && (
        <>
          <Typography level="title-md">Exibição de Páginas</Typography>
          <div className="grid grid-cols-1 gap-y-3">
            {[
              "Introdução",
              "Pagamento e retorno esperado",
              "Cálculo do investimento",
              "Divisão do capital",
              "Conversão para valor presente",
              "Reinvestimento em Renda Fixa",
              "Análise Gráfica Detalhada",
              "Descrição do imóvel",
            ].map((label, index) => (
              <BooleanInput
                key={label}
                label={label}
                checked={!!reportConfig.pageViewMap[index]}
                onChange={(v) => handlePageViewToggle(index, v.target.checked)}
              />
            ))}
          </div>
          <Divider />
        </>
      )}

      <Typography level="title-md">Condição de Pagamento</Typography>
      <div className="flex flex-col gap-4">
        <FormControl>
          <FormLabel>Tipo de entrada:</FormLabel>
          <Select
            value={
              reportConfig?.PaymentConditionsConfig?.downPaymentCustomType ?? ""
            }
            onChange={(_, value) => handleDownPaymentTypeChange(value ?? "")}
            placeholder="Tipo de entrada"
          >
            <Option value="">Padrão</Option>
            <Option value="signal">Parcelamento com sinal</Option>
          </Select>
        </FormControl>
        <BooleanInputSwitch
          label="Exibir soma dos pagamentos"
          checked={reportConfig.highlightSumPaymentsValues}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...reportConfig,
                highlightSumPaymentsValues: v,
              },
            })
          }
        />
        <BooleanInputSwitch
          label="Separar Documentação"
          checked={reportConfig.separateDocumentation}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...reportConfig,
                separateDocumentation: v,
              },
            })
          }
        />
        <BooleanInputSwitch
          label="Agrupar Parcelas Mensais"
          checked={reportConfig.groupMonthlyInstallments}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...reportConfig,
                groupMonthlyInstallments: v,
              },
            })
          }
        />
      </div>

      <Divider />

      <Typography level="title-md">Configurações Gerais</Typography>
      <div className="grid grid-cols-1 gap-y-4">
        <BooleanInputSwitch
          label="Exibir Tempo de Financiamento"
          checked={reportConfig.displayFinancingTime}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...reportConfig,
                displayFinancingTime: v,
              },
            })
          }
        />
        <BooleanInputSwitch
          label="Visualizador de Fotos"
          checked={reportConfig.photoViewer}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...reportConfig,
                photoViewer: v,
              },
            })
          }
        />
        <BooleanInputSwitch
          label="Solicitar Nome"
          checked={reportConfig.requestName}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...reportConfig,
                requestName: v,
              },
            })
          }
        />

        {configData.subType === "Avançado" && (
          <BooleanInputSwitch
            label="Mostrar Sumário"
            checked={reportConfig.displaySummary}
            onChange={(v) =>
              onChange({
                ...configData,
                reportConfig: {
                  ...reportConfig,
                  displaySummary: v,
                },
              })
            }
          />
        )}
      </div>

      <Divider />
    </div>
  );
}
