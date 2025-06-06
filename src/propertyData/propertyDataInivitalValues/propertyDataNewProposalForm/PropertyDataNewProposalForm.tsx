import { useState } from "react";
import Stepper from "@mui/joy/Stepper";
import Step from "@mui/joy/Step";
import StepIndicator, { stepIndicatorClasses } from "@mui/joy/StepIndicator";
import { Button, Card } from "@mui/joy";
import PropertyDataStep1 from "./PropertyDataStep1";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import PropertyDataStep2 from "./PropertyDataStep2";
import dayjs from "dayjs";
import PropertyDataStep3 from "./PropertyDataStep3";
import PropertyDataStep5 from "./PropertyDataStep5";
import PropertyDataStep4 from "./PropertyDataStep4";
import PropertyDataStep6 from "./PropertyDataStep6";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Building } from "@/types/buildingTypes";

interface PropertyDataNewProposalFormProps {
  finish: (p?: PropertyData) => void;
  subType: string;
  type: string;
  initialData?: PropertyData;
  building: Building;
  setBuilding: (b: Building) => void;
}

export default function PropertyDataNewProposalForm({
  finish,
  subType,
  initialData,
  type,
  building,
  setBuilding,
}: PropertyDataNewProposalFormProps) {
  const [activeStep, setActiveStep] = useState(0);

  const defaultData = {
    discharges: [],
    initialDate: dayjs().format("MM/YYYY"),
    initialFinancingMonth: dayjs().add(1, "month").format("MM/YYYY"),
    initialRentMonth: dayjs().add(1, "month").format("MM/YYYY"),
    financingFeesDate: dayjs().format("MM/YYYY"),
    downPayment: 0,
    financingFees: 0,
  } as PropertyData;

  const [formData, setFormData] = useState<PropertyData>(
    initialData ? { ...defaultData, ...initialData } : defaultData
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setForm = (key: keyof PropertyData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    if (activeStep !== steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
      return;
    }
    finish(formData);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const isAdvancedMode = subType === "Avançado";

  const steps = isAdvancedMode
    ? [
        { label: "Início do Estudo" },
        { label: "Informações do Imóvel" },
        { label: "Pagamento" },
        { label: "Detalhes do Financiamento" },
        { label: "Aluguel" },
        { label: "Valorização e Rentabilidade" },
      ]
    : [{ label: "Início" }, { label: "Pagamento" }, { label: "Financiamento" }];

  const disableNextButton = () => {
    if (isAdvancedMode)
      return (
        (activeStep === 0 && !formData.finalYear) ||
        (activeStep === 1 && !formData.propertyValue) ||
        (activeStep === 1 && !formData.propertyAppreciationRate) ||
        (activeStep === 2 && !formData.downPayment) ||
        (type === "financingPlanning" &&
          activeStep === 3 &&
          !formData.interestRate) ||
        (type === "financingPlanning" &&
          activeStep === 3 &&
          !formData.installmentValue) ||
        (type === "financingPlanning" &&
          activeStep === 3 &&
          formData.financingFees === undefined) ||
        (type === "financingPlanning" &&
          activeStep === 3 &&
          !formData.financingMonths) ||
        (activeStep === 4 &&
          !formData.isHousing &&
          !formData.initialRentValue) ||
        (activeStep === 4 &&
          !formData.isHousing &&
          !formData.rentAppreciationRate) ||
        (activeStep === 5 &&
          formData.investTheRest &&
          !formData.annualYieldRate)
      );
    else
      return (
        (activeStep === 0 && !formData.propertyValue) ||
        (type === "financingPlanning" &&
          activeStep === 2 &&
          !formData.installmentValue) ||
        (activeStep === 2 && formData.financingFees === undefined)
      );
  };

  return (
    <div className="flex items-center gap-10">
      <div className="hidden md:flex flex-col items-start gap-5">
        <Button
          onClick={() => finish()}
          startDecorator={<IoIosArrowRoundBack className="text-xl" />}
          variant="plain"
        >
          Voltar
        </Button>
        <Stepper
          orientation="vertical"
          size="lg"
          sx={{
            "--StepIndicator-size": "2.5rem",
            "--Step-connectorInset": "0px",
            "--Step-connectorThickness": "3px",
            [`& .${stepIndicatorClasses.root}`]: {
              borderWidth: 4,
            },
          }}
        >
          {steps.map((step, index) => (
            <Step
              key={index}
              completed={activeStep > index}
              indicator={
                <StepIndicator
                  variant={activeStep !== index ? "outlined" : "solid"}
                  color={activeStep !== index ? "neutral" : "primary"}
                >
                  {index + 1}
                </StepIndicator>
              }
            >
              <div className="h-[2.5rem] text-left flex items-center">
                <span className={`font-bold text-sm`}>{step.label}</span>
              </div>
            </Step>
          ))}
        </Stepper>
      </div>

      <Card className="w-[320px] md:w-[500px] shadow-lg p-4 flex flex-col justify-between h-[540px] overflow-y-auto">
        <form className="flex-grow">
          {isAdvancedMode ? (
            <>
              {activeStep === 0 && (
                <PropertyDataStep1 form={formData} setForm={setForm} />
              )}
              {activeStep === 1 && (
                <PropertyDataStep2
                  building={building}
                  setBuilding={(b) => setBuilding(b)}
                  form={formData}
                  setForm={setForm}
                />
              )}
              {activeStep === 2 && (
                <PropertyDataStep3 form={formData} setForm={setForm} />
              )}
              {activeStep === 3 && (
                <PropertyDataStep4
                  type={type}
                  form={formData}
                  setForm={setForm}
                />
              )}
              {activeStep === 4 && (
                <PropertyDataStep5 form={formData} setForm={setForm} />
              )}
              {activeStep === 5 && (
                <PropertyDataStep6 form={formData} setForm={setForm} />
              )}
            </>
          ) : (
            <>
              {activeStep === 0 && (
                <PropertyDataStep2
                  building={building}
                  setBuilding={(b) => setBuilding(b)}
                  simplificated
                  form={formData}
                  setForm={setForm}
                />
              )}
              {activeStep === 1 && (
                <PropertyDataStep3 form={formData} setForm={setForm} />
              )}
              {activeStep === 2 && (
                <PropertyDataStep4
                  type={type}
                  simplificated
                  form={formData}
                  setForm={setForm}
                />
              )}
              {activeStep === 3 && (
                <PropertyDataStep4
                  type={type}
                  form={formData}
                  setForm={setForm}
                />
              )}
              {activeStep === 4 && (
                <PropertyDataStep5 form={formData} setForm={setForm} />
              )}
              {activeStep === 5 && (
                <PropertyDataStep6 form={formData} setForm={setForm} />
              )}
            </>
          )}
        </form>

        <div className="flex justify-between mt-auto">
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Voltar
          </Button>
          <Button disabled={disableNextButton()} onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
