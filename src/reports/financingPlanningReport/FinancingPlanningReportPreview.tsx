import { forwardRef } from "react";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { FinancingPlanningData } from "@/pages/planejamentofinanciamento/@id/CaseData";
import CalculationTable from "../components/preview/CalculationTable";
import { User } from "@/types/userTypes";
import UserSignature from "@/components/user/UserSignature";
import ImageWithOverlay from "../components/preview/ImageWithOverlary";
import Summary from "../components/preview/Summary";
import ReportDivider from "../components/preview/ReportDivider";
import PaymentConditions from "../components/preview/PaymentConditions";
import ProjectionReturn from "../components/preview/ReturnProjection";
import ScenariosBuyAndSell from "../components/preview/ScenariosBuyAndSell";
import UnderstandFinancing from "../components/preview/UnderstandFinancing";
import InitialDivisionCharts from "../components/preview/InitialDivisionCharts";
import PresentValue from "../components/preview/PresentValue";
import MonthlyReinvested from "../components/preview/MonthlyReinvested";
import PropertyDescription from "../components/preview/PropertyDescription";
import ConsideredData from "../components/preview/ConsideredData";
import DetailChartAnalysis from "../components/preview/DetailChartAnalysis";
import { ReportData } from "../components/ReportConfig";

interface FinancingPlanningReportPreviewProps {
  configData: ReportData;
  propertyData?: PropertyData;
  caseData?: FinancingPlanningData;
  user?: User;
  preview?: boolean;
  custom: {
    headerType: number;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  };
  page1Ref?: React.RefObject<HTMLDivElement>;
  page2Ref?: React.RefObject<HTMLDivElement>;
  page3Ref?: React.RefObject<HTMLDivElement>;
  page4Ref?: React.RefObject<HTMLDivElement>;
  page5Ref?: React.RefObject<HTMLDivElement>;
  page6Ref?: React.RefObject<HTMLDivElement>;
  page7Ref?: React.RefObject<HTMLDivElement>;
  page8Ref?: React.RefObject<HTMLDivElement>;
}

const FinancingPlanningReportPreview = forwardRef<
  HTMLDivElement,
  FinancingPlanningReportPreviewProps
>(
  (
    {
      configData,
      propertyData,
      caseData,
      user,
      preview,
      page1Ref,
      page2Ref,
      page3Ref,
      page4Ref,
      page5Ref,
      page6Ref,
      page7Ref,
      page8Ref,
      custom,
    }: FinancingPlanningReportPreviewProps,
    ref
  ) => {
    if (!propertyData) return null;
    if (!caseData) return null;

    const isPageViewActive = (index: number) => {
      if (configData.subType === "Simplificado") return true;
      return (
        index >= configData.pageViewMap.length ||
        configData.pageViewMap[index] === true
      );
    };

    const isAdvancedMode = configData.subType === "Avançado";

    const sections = [
      {
        title: "Pagamento e Retorno Esperado",
        description:
          "Detalha as opções de pagamento e apresenta uma estimativa de retorno financeiro.",
        active: isPageViewActive(1),
      },
      {
        title: "Cálculo do Investimento",
        description:
          "Explica o cálculo envolvido na compra e uma venda possível do imóvel.",
        active: isPageViewActive(2),
      },
      {
        title: "Análise Detalhada",
        description:
          "Avaliação detalhada das condições financeiras e viabilidade do investimento.",
        active: isPageViewActive(3),
      },
      {
        title: "Descrição do Imóvel",
        description:
          "Fotos e informações sobre o imóvel, incluindo localização, características e diferenciais.",
        active: isPageViewActive(7),
      },
    ];

    return (
      <div
        ref={ref}
        className={`lg:max-w-[210mm] !min-w-[675px] w-full shadow ${
          !preview
            ? " absolute scale-[0.58] xl:scale-100 top-0 left-[50%] xl:left-[50%] translate-x-[-50%]"
            : ""
        }`}
        style={{
          transformOrigin: "top center",
          backgroundColor: custom.backgroundColor,
        }}
      >
        <div className="flex flex-col items-center w-full !m-0 overflow-x-hidden">
          {isPageViewActive(0) && (
            <div ref={page1Ref} className="w-full">
              <UserSignature
                type={custom.headerType || 1}
                userData={user}
                desc={configData.propertyName}
                primaryColor={custom.primaryColor}
                secondaryColor={custom.secondaryColor}
                backgroundColor={custom.backgroundColor}
              />
              <ImageWithOverlay
                mainPhoto={configData.mainPhoto}
                description={configData.description}
                overlayHeight={200}
                className="h-[460px]"
              />
              {isAdvancedMode ? (
                <Summary
                  secondary={custom.secondaryColor}
                  color={custom.primaryColor}
                  items={sections}
                />
              ) : (
                <PropertyDescription
                  color={custom.primaryColor}
                  secondary={custom.secondaryColor}
                  configData={configData}
                />
              )}
            </div>
          )}

          {isPageViewActive(1) && (
            <div id="section2" className="w-full" ref={page2Ref}>
              {isAdvancedMode && (
                <ReportDivider
                  bars={23}
                  title="Pagamento e retorno esperado"
                  color={custom.primaryColor}
                />
              )}
              <PaymentConditions
                isAdvancedMode={isAdvancedMode}
                propertyData={propertyData}
                color={custom.primaryColor}
                secondary={custom.secondaryColor}
              />
              {isAdvancedMode && (
                <ProjectionReturn
                  caseData={caseData}
                  propertyData={propertyData}
                  color={custom.primaryColor}
                  secondary={custom.secondaryColor}
                />
              )}
            </div>
          )}

          {isPageViewActive(2) && isAdvancedMode && (
            <div id="section3" className="w-full" ref={page3Ref}>
              <ReportDivider
                bars={27}
                title="Cálculo do investimento"
                color={custom.primaryColor}
              />
              <div className="w-full px-12 my-10">
                <CalculationTable
                  color={custom.primaryColor}
                  secondary={custom.secondaryColor}
                  propertyData={propertyData}
                  caseData={caseData}
                />
              </div>

              <ScenariosBuyAndSell
                propertyData={propertyData}
                caseData={caseData}
                color={custom.primaryColor}
                secondary={custom.secondaryColor}
              />
              <UnderstandFinancing
                background={custom.backgroundColor}
                propertyData={propertyData}
                color={custom.primaryColor}
                secondary={custom.secondaryColor}
              />
            </div>
          )}

          {isPageViewActive(3) && isAdvancedMode && (
            <div id="section4" ref={page4Ref}>
              <ReportDivider
                bars={31}
                title="Análise Detalhada"
                color={custom.primaryColor}
              />
              <InitialDivisionCharts
                propertyData={propertyData}
                color={custom.primaryColor}
                secondary={custom.secondaryColor}
                caseData={caseData}
              />
            </div>
          )}

          {caseData.detailedTable[0].rentalAmount < 0 &&
            isPageViewActive(4) &&
            isAdvancedMode && (
              <div ref={page5Ref}>
                <PresentValue
                  propertyData={propertyData}
                  color={custom.primaryColor}
                  secondary={custom.secondaryColor}
                  caseData={caseData}
                />
              </div>
            )}

          {caseData.finalRow.totalCapital > 0 &&
            isPageViewActive(5) &&
            isAdvancedMode && (
              <div ref={page6Ref}>
                <MonthlyReinvested
                  propertyData={propertyData}
                  color={custom.primaryColor}
                  secondary={custom.secondaryColor}
                  caseData={caseData}
                />
              </div>
            )}

          {isPageViewActive(6) && isAdvancedMode && (
            <div ref={page7Ref} className="w-full">
              <DetailChartAnalysis
                secondary={custom.secondaryColor}
                color={custom.primaryColor}
                caseData={caseData}
              />
            </div>
          )}

          {isPageViewActive(7) && isAdvancedMode && (
            <div id="section5" ref={page8Ref} className="w-full">
              <ReportDivider
                bars={30}
                title="Descrição do Imóvel"
                color={custom.primaryColor}
              />
              <PropertyDescription
                color={custom.primaryColor}
                secondary={custom.secondaryColor}
                configData={configData}
              />

              <ReportDivider
                bars={29}
                title="Dados Considerados"
                color={custom.primaryColor}
              />
              <ConsideredData
                color={custom.primaryColor}
                secondary={custom.secondaryColor}
                propertyData={propertyData}
                caseData={caseData}
              />
            </div>
          )}

          <div className="flex justify-center my-10 w-full">
            <img
              className="max-w-[150px] max-h-[100px]"
              src={user?.realEstate?.logo}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default FinancingPlanningReportPreview;
