import { useRef, useState } from "react";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { Proposal } from "@/types/proposalTypes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DirectFinancingReportPreview from "./DirectFinancingReportPreview";
import FinancingPlanningReportPreview from "./FinancingPlanningReportPreview";
import ReportMenu from "./components/ReportMenu";
import {
  Divider,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  ListItemDecorator,
  Radio,
  RadioGroup,
  Textarea,
} from "@mui/joy";
import { LuBox } from "react-icons/lu";
import { FaCalculator } from "react-icons/fa6";
import LinkBuildingButton from "@/components/shared/VinculateBuildingButton";
import PictureInput from "@/components/inputs/PictureInput";
import ItemListInput from "@/components/inputs/ItemListInput";
import { ReportConfig } from "@/types/reportConfigTypes";
import BooleanInput from "@/components/inputs/BooleanInput";
import BooleanInputSwitch from "@/components/inputs/SwitchInput";
import SessionsDrawer from "@/components/session/SessionsDrawer";
import CurrencyInput from "@/components/inputs/CurrencyInput";

interface ReportPreviewProps {
  propertyData: PropertyData;
  proposal: Proposal;
  onClose: () => void;
  onChange: (configData: ReportData) => void;
  context: "financingPlanning" | "directFinancing";
}

export interface ReportData {
  mainPhoto: string;
  description: string;
  propertyName: string;
  additionalPhotos: string[];
  features: string[];
  suites?: string;
  bathrooms?: string;
  bedrooms?: string;
  parkingSpaces?: string;
  builtArea?: string;
  landArea?: string;
  address?: string;
  cod?: string;
  subType: string;
  buildingId?: string;
  value?: number;
  reportConfig: ReportConfig;
}

export default function ReportPreview({
  proposal,
  propertyData,
  context,
  onChange,
}: ReportPreviewProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const userData = useSelector((state: RootState) => state.user.userData);
  const realEstateData = useSelector(
    (state: RootState) => state.realEstate.realEstateData
  );

  const configData = {
    propertyName: proposal.propertyName || "",
    mainPhoto: proposal.mainPhoto || "",
    description: proposal.description || "",
    additionalPhotos: proposal.additionalPhotos,
    features: proposal.features,
    address: proposal.address,
    bathrooms: proposal.bathrooms,
    bedrooms: proposal.bedrooms,
    builtArea: proposal.builtArea,
    cod: proposal.cod,
    landArea: proposal.landArea,
    parkingSpaces: proposal.parkingSpaces,
    suites: proposal.suites,
    subType: proposal.subType,
    buildingId: proposal.buildingId,
    value: proposal.value,
    reportConfig: proposal.reportConfig,
  };

  const [activeItem, setActiveItem] = useState("property");

  const handleDrop = (image: string, source: string) => {
    console.log("Imagem recebida:", image, "de", source);
    console.log("ConfigData antes da alteração:", configData);

    if (source === "Foto Principal") {
      const updatedAdditionalPhotos = [
        ...configData.additionalPhotos,
        configData.mainPhoto,
      ].filter(Boolean); // Remove valores falsos (null, undefined, "")

      console.log("Nova lista de fotos adicionais:", updatedAdditionalPhotos);

      onChange({
        ...configData,
        mainPhoto: image,
        additionalPhotos: updatedAdditionalPhotos,
      });

      console.log("ConfigData atualizado (Foto Principal):", {
        mainPhoto: image,
        additionalPhotos: updatedAdditionalPhotos,
      });
    } else if (source === "Fotos Adicionais") {
      const newAdditionalPhotos = configData.additionalPhotos.filter(
        (img) => img !== image
      );

      if (configData.mainPhoto) {
        newAdditionalPhotos.push(configData.mainPhoto);
      }

      console.log(
        "Nova lista de fotos adicionais (após troca):",
        newAdditionalPhotos
      );

      onChange({
        ...configData,
        mainPhoto: image,
        additionalPhotos: newAdditionalPhotos,
      });

      console.log("ConfigData atualizado (Fotos Adicionais):", {
        mainPhoto: image,
        additionalPhotos: newAdditionalPhotos,
      });
    }
  };

  const handlePaymentConditionsConfig = (payload: {
    order: string[];
    downPaymentHeight: number;
    reinforcementsHeight: number;
    contructionInterestHeight: number;
  }) => {
    onChange({
      ...configData,
      reportConfig: {
        ...configData.reportConfig,
        paymentConditionsConfig: payload,
      },
    });
  };

  const renderPreview = () => {
    if (context === "directFinancing")
      return (
        <DirectFinancingReportPreview
          custom={{
            backgroundColor: realEstateData?.backgroundColor || "",
            primaryColor: realEstateData?.primaryColor || "",
            secondaryColor: realEstateData?.secondaryColor || "",
            headerType: realEstateData?.headerType || 1,
          }}
          preview
          propertyData={propertyData}
          configData={configData}
          ref={componentRef}
          user={userData}
          handlePaymentConditionsConfig={handlePaymentConditionsConfig}
        />
      );

    if (context === "financingPlanning")
      return (
        <FinancingPlanningReportPreview
          custom={{
            backgroundColor: realEstateData?.backgroundColor || "",
            primaryColor: realEstateData?.primaryColor || "",
            secondaryColor: realEstateData?.secondaryColor || "",
            headerType: realEstateData?.headerType || 1,
          }}
          preview
          propertyData={propertyData}
          configData={configData}
          ref={componentRef}
          user={userData}
          handlePaymentConditionsConfig={handlePaymentConditionsConfig}
        />
      );
  };

  const renderConfig = () => {
    if (activeItem === "property")
      return (
        <div className="flex flex-col gap-5">
          <h5 className="font-bold text-xl">Imóvel</h5>
          <LinkBuildingButton
            buildingId={configData.buildingId}
            buildingName={configData.propertyName}
            buildingPhoto={configData.mainPhoto}
            onUnlink={() => onChange({ ...configData, buildingId: null })}
            onLink={(building) => {
              console.log(building.bedrooms);

              onChange({
                ...configData,
                mainPhoto: building.mainPhoto,
                description: building.description,
                propertyName: building.propertyName,
                additionalPhotos: building.additionalPhotos,
                features: building.features,
                suites: building.suites,
                bedrooms: building.bedrooms,
                bathrooms: building.bathrooms,
                parkingSpaces: building.parkingSpaces,
                builtArea: building.builtArea,
                landArea: building.landArea,
                address: building.address,
                cod: building.cod,
                value: building.value,
                buildingId: building.id,
              });
            }}
          />
          <div className="grid grid-cols-2 gap-5">
            <FormControl className="col-span-2">
              <FormLabel component="label" htmlFor="propertyName">
                Nome
              </FormLabel>
              <Input
                id="propertyName"
                onChange={(e) =>
                  onChange({ ...configData, propertyName: e.target.value })
                }
                value={configData.propertyName}
              />
            </FormControl>

            <FormControl className="col-span-2">
              <CurrencyInput
                infoTooltip=""
                noHeight
                label="Valor Original"
                onChange={(e) =>
                  onChange({ ...configData, value: Number(e.target.value) })
                }
                value={configData.value}
              />
            </FormControl>

            <FormControl className="col-span-2">
              <FormLabel component="label" htmlFor="description">
                Descrição
              </FormLabel>
              <Textarea
                id="description"
                onChange={(e) =>
                  onChange({ ...configData, description: e.target.value })
                }
                value={configData.description}
              />
            </FormControl>

            <FormControl className="col-span-2">
              <FormLabel component="label" htmlFor="address">
                Endereço
              </FormLabel>
              <Input
                id="address"
                onChange={(e) =>
                  onChange({ ...configData, address: e.target.value })
                }
                value={configData.address}
              />
            </FormControl>

            <FormControl>
              <FormLabel component="label" htmlFor="bedrooms">
                Quartos
              </FormLabel>
              <Input
                id="bedrooms"
                onChange={(e) =>
                  onChange({ ...configData, bedrooms: e.target.value })
                }
                value={configData.bedrooms}
              />
            </FormControl>

            <FormControl>
              <FormLabel component="label" htmlFor="suites">
                Suites
              </FormLabel>
              <Input
                id="suites"
                onChange={(e) =>
                  onChange({ ...configData, suites: e.target.value })
                }
                value={configData.suites}
              />
            </FormControl>

            <FormControl>
              <FormLabel component="label" htmlFor="bathrooms">
                Banheiros
              </FormLabel>
              <Input
                id="bathrooms"
                onChange={(e) =>
                  onChange({ ...configData, bathrooms: e.target.value })
                }
                value={configData.bathrooms}
              />
            </FormControl>

            <FormControl>
              <FormLabel component="label" htmlFor="parkingSpaces">
                Vagas
              </FormLabel>
              <Input
                id="parkingSpaces"
                onChange={(e) =>
                  onChange({ ...configData, parkingSpaces: e.target.value })
                }
                value={configData.parkingSpaces}
              />
            </FormControl>

            <FormControl>
              <FormLabel component="label" htmlFor="builtArea">
                Área Construída (m²)
              </FormLabel>
              <Input
                id="builtArea"
                onChange={(e) =>
                  onChange({ ...configData, builtArea: e.target.value })
                }
                value={configData.builtArea}
              />
            </FormControl>

            <FormControl>
              <FormLabel component="label" htmlFor="landArea">
                Área do Terreno (m²)
              </FormLabel>
              <Input
                id="landArea"
                onChange={(e) =>
                  onChange({ ...configData, landArea: e.target.value })
                }
                value={configData.landArea}
              />
            </FormControl>
            {/* 
            <FormControl error={!!errors.cod}>
              <FormLabel component="label" htmlFor="cod">
                Código
              </FormLabel>
              <Input
                id="cod"
                onChange={(e) =>
                  onChange({ ...configData, cod: e.target.value })
                }
                value={configData.cod}
              />
            </FormControl> */}
          </div>
          <ItemListInput
            label="Características "
            items={configData.features}
            onChange={(items) => onChange({ ...configData, features: items })}
          />
        </div>
      );

    if (activeItem === "config")
      return (
        <div className="flex flex-col gap-2">
          <h5 className="font-bold text-xl">Configurações</h5>
          <RadioGroup
            aria-label="subType"
            name="subType"
            onChange={(e) =>
              onChange({ ...configData, subType: e.target.value })
            }
            value={configData.subType}
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
              {["Simplificado", "Avançado"].map((item, index) => (
                <ListItem
                  variant="outlined"
                  key={item}
                  sx={{ boxShadow: "sm" }}
                >
                  <ListItemDecorator>
                    {[<LuBox />, <FaCalculator />][index]}
                  </ListItemDecorator>
                  <Radio
                    overlay
                    value={item}
                    label={item}
                    sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                    slotProps={{
                      action: ({ checked }) => ({
                        sx: (theme) => ({
                          ...(checked && {
                            inset: -1,
                            border: "2px solid",
                            borderColor: theme.vars.palette.primary[500],
                          }),
                        }),
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
                  key={index}
                  label={label}
                  onChange={(v) =>
                    onChange({
                      ...configData,
                      reportConfig: {
                        ...configData.reportConfig,
                        pageViewMap: [
                          ...configData.reportConfig.pageViewMap.slice(
                            0,
                            index
                          ),
                          v.target.checked,
                          ...configData.reportConfig.pageViewMap.slice(
                            index + 1
                          ),
                        ],
                      },
                    })
                  }
                  checked={
                    index >= configData.reportConfig.pageViewMap?.length ||
                    configData.reportConfig.pageViewMap[index] === true
                  }
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
                checked={configData.reportConfig.displaySummary}
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

            {/* 
            <BooleanInputSwitch
              label="Exibir Botão de aceite"
              checked={configData.reportConfig?.displayAccepted}
              onChange={(v) =>
                onChange({
                  ...configData,
                  reportConfig: {
                    ...configData.reportConfig,
                    displayAccepted: v,
                  },
                })
              }
            />
            <BooleanInputSwitch
              label="Salvar Sessões"
              checked={configData.reportConfig?.saveSessions}
              onChange={(v) =>
                onChange({
                  ...configData,
                  reportConfig: {
                    ...configData.reportConfig,
                    saveSessions: v,
                  },
                })
              }
            /> */}
          </div>
        </div>
      );

    if (activeItem === "images")
      return (
        <div className="flex flex-col gap-5">
          <h5 className="font-bold text-xl">Imagens</h5>
          <PictureInput
            label="Foto Principal"
            value={[configData.mainPhoto]}
            onChange={(v) => onChange({ ...configData, mainPhoto: v })}
            onDrop={(image, source) => handleDrop(image, source)}
          />
          <PictureInput
            label="Fotos Adicionais"
            multiple
            value={configData.additionalPhotos}
            onChange={(v) =>
              onChange({
                ...configData,
                additionalPhotos: v.split(","),
              })
            }
            onDrop={(image, source) => handleDrop(image, source)}
          />
        </div>
      );
  };

  return (
    <>
      <div className=" gap-5 flex w-full relative justify-between pr-8 xl:pr-0">
        <ReportMenu activeItem={activeItem} onSelectItem={setActiveItem}>
          {renderConfig()}
        </ReportMenu>

        <div className="mt-5 pr-4">{renderPreview()}</div>
        <div className="hidden xl:block w-[420px] uw:w-[520px]"></div>
        <SessionsDrawer caseId={proposal.id} />
      </div>
    </>
  );
}
