import { forwardRef } from "react";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { User } from "@/types/userTypes";
import UserSignature from "@/components/user/UserSignature";
import ImageWithOverlay from "./components/preview/ImageWithOverlary";
import Summary from "./components/preview/Summary";
import ReportDivider from "./components/preview/ReportDivider";
import PaymentConditions from "./components/preview/PaymentConditions/PaymentConditions";
import ProjectionReturn from "./components/preview/ReturnProjection";
import ScenariosBuyAndSell from "./components/preview/ScenariosBuyAndSell";
import InitialDivisionCharts from "./components/preview/InitialDivisionCharts";
import PresentValue from "./components/preview/PresentValue";
import MonthlyReinvested from "./components/preview/MonthlyReinvested";
import PropertyDescription from "./components/preview/PropertyDescription";
import ConsideredData from "./components/preview/ConsideredData";
import DetailChartAnalysis from "./components/preview/DetailChartAnalysis";
import { calcCaseData } from "@/pages/parcelamentodireto/@id/Calculator";
import { ReportData } from "./ReportPreview";
import CalculationTable from "./components/preview/CalculationTable";

interface DirectFinancingReportPreviewProps {
  configData: ReportData;
  propertyData?: PropertyData;
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
  handlePaymentConditionsConfig?: (payload: {
    order: string[];
    downPaymentHeight: number;
    reinforcementsHeight: number;
    contructionInterestHeight: number;
  }) => void;
}

const DirectFinancingReportPreview = forwardRef<
  HTMLDivElement,
  DirectFinancingReportPreviewProps
>(
  (
    {
      configData,
      propertyData,
      handlePaymentConditionsConfig,
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
    }: DirectFinancingReportPreviewProps,
    ref
  ) => {
    if (!propertyData) return null;

    const caseData = calcCaseData(propertyData);

    const isPageViewActive = (index: number) => {
      if (configData.subType === "Simplificado") return true;
      return (
        index >= configData.reportConfig.pageViewMap.length ||
        configData.reportConfig.pageViewMap[index] === true
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

              <PropertyDescription
                photoViewer={configData.reportConfig.photoViewer}
                color={custom.primaryColor}
                secondary={custom.secondaryColor}
                configData={configData}
              />

              {configData.reportConfig.displaySummary && isAdvancedMode && (
                <Summary
                  secondary={custom.secondaryColor}
                  color={custom.primaryColor}
                  items={sections}
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
                highlightSumPaymentsValues={
                  configData.reportConfig.highlightSumPaymentsValues
                }
                propertyValue={configData.value}
                groupMonthlyInstallments={
                  configData.reportConfig.groupMonthlyInstallments
                }
                separateDocumentation={
                  configData.reportConfig.separateDocumentation
                }
                isAdvancedMode={isAdvancedMode}
                propertyData={propertyData}
                color={custom.primaryColor}
                secondary={custom.secondaryColor}
                hasBankFinancing={false}
                handlePaymentConditionsConfig={handlePaymentConditionsConfig}
                config={configData.reportConfig.paymentConditionsConfig}
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

          <p
            style={{ color: custom.secondaryColor }}
            className="text-xs my-4 flex items-center justify-center gap-1"
          >
            Feito com <span className="text-red-500">❤️</span> no{" "}
            <strong>ImobDeal</strong>
          </p>
        </div>
      </div>
    );
  }
);

export default DirectFinancingReportPreview;
