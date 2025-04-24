import {
  Divider,
  List,
  ListItem,
  ListItemDecorator,
  Radio,
  RadioGroup,
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
  const handlePageViewToggle = (index: number, checked: boolean) => {
    const newMap = [...configData.reportConfig.pageViewMap];
    newMap[index] = checked;
    onChange({
      ...configData,
      reportConfig: {
        ...configData.reportConfig,
        pageViewMap: newMap,
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <h5 className="font-bold text-xl">Configurações</h5>

      <RadioGroup
        aria-label="subType"
        name="subType"
        value={configData.subType}
        onChange={(e) => onChange({ ...configData, subType: e.target.value })}
      >
        <List
          orientation="horizontal"
          className="!grid !grid-cols-2 !mb-5"
          sx={{
            "--List-gap": "0.5rem",
            "--ListItem-paddingY": "1rem",
            "--ListItem-radius": "8px",
            "--ListItemDecorator-size": "32px",
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
        <div className="grid grid-cols-1 gap-y-5 mb-5">
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
              checked={!!configData.reportConfig.pageViewMap[index]}
              onChange={(v) => handlePageViewToggle(index, v.target.checked)}
            />
          ))}
          <Divider />
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-5">
        <BooleanInputSwitch
          label="Separar Documentação"
          checked={configData.reportConfig?.separateDocumentation}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...configData.reportConfig,
                separateDocumentation: v,
              },
            })
          }
        />

        <BooleanInputSwitch
          label="Agrupar Parcelas Mensais"
          checked={configData.reportConfig?.groupMonthlyInstallments}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...configData.reportConfig,
                groupMonthlyInstallments: v,
              },
            })
          }
        />

        <BooleanInputSwitch
          label="Exibir Tempo de Financiamento"
          checked={configData.reportConfig?.displayFinancingTime}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...configData.reportConfig,
                displayFinancingTime: v,
              },
            })
          }
        />

        <BooleanInputSwitch
          label="Visualizador de Fotos"
          checked={configData.reportConfig?.photoViewer}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...configData.reportConfig,
                photoViewer: v,
              },
            })
          }
        />

        <BooleanInputSwitch
          label="Solicitar Nome"
          checked={configData.reportConfig?.requestName}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...configData.reportConfig,
                requestName: v,
              },
            })
          }
        />

        <BooleanInputSwitch
          label="Exibir soma dos pagamentos"
          checked={configData.reportConfig?.highlightSumPaymentsValues}
          onChange={(v) =>
            onChange({
              ...configData,
              reportConfig: {
                ...configData.reportConfig,
                highlightSumPaymentsValues: v,
              },
            })
          }
        />

        {configData.subType === "Avançado" && (
          <BooleanInputSwitch
            label="Mostrar Sumário"
            checked={configData.reportConfig?.displaySummary}
            onChange={(v) =>
              onChange({
                ...configData,
                reportConfig: {
                  ...configData.reportConfig,
                  displaySummary: v,
                },
              })
            }
          />
        )}
      </div>
    </div>
  );
}
