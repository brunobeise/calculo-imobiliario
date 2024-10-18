import { useContext, useState } from "react";
import Stepper from "@mui/joy/Stepper";
import Step from "@mui/joy/Step";
import StepIndicator, { stepIndicatorClasses } from "@mui/joy/StepIndicator";
import { Button, Card } from "@mui/joy";
import PropertyDataStep1 from "./PropertyDataStep1";
import {
  PropertyData,
  propertyDataContext,
} from "@/propertyData/PropertyDataContext";
import PropertyDataStep2 from "./PropertyDataStep2";
import dayjs from "dayjs";
import PropertyDataStep3 from "./PropertyDataStep3";
import PropertyDataStep5 from "./PropertyDataStep5";
import PropertyDataStep4 from "./PropertyDataStep4";
import PropertyDataStep6 from "./PropertyDataStep6";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function PropertyDataNewCaseForm({
  finish,
}: {
  finish: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const { setMultiplePropertyData } = useContext(propertyDataContext);
  const [form, setform] = useState<PropertyData>({
    discharges: [],
    initialDate: dayjs().format("MM/YYYY"),
    initialFinancingMonth: dayjs().add(1, "month").format("MM/YYYY"),
    initialRentMonth: dayjs().add(1, "month").format("MM/YYYY"),
  } as unknown as PropertyData);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setForm = (key: string, value: any) => {
    setform({
      ...form,
      [key]: value,
    });
  };

  const steps = [
    { label: "Início do Estudo" },
    { label: "Informações do Imóvel" },
    { label: "Entrada" },
    { label: "Detalhes do Financiamento" },
    { label: "Aluguel" },
    { label: "Valorização e Rentabilidade" },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
      return;
    }

    setMultiplePropertyData(form);
    finish();
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const disableNextButton = () => {
    return (
      (activeStep === 0 && !form.finalYear) ||
      (activeStep === 1 && !form.propertyValue) ||
      (activeStep === 1 && !form.subsidy) ||
      (activeStep === 1 && !form.propertyAppreciationRate) ||
      (activeStep === 2 && !form.downPayment) ||
      (activeStep === 3 && !form.interestRate) ||
      (activeStep === 3 && !form.installmentValue) ||
      (activeStep === 3 && !form.financingFees) ||
      (activeStep === 3 && !form.financingYears) ||
      (activeStep === 4 && !form.isHousing && !form.initialRentValue) ||
      (activeStep === 4 && !form.isHousing && !form.rentAppreciationRate) ||
      (activeStep === 5 && form.investTheRest && !form.monthlyYieldRate) ||
      (activeStep === 5 && !form.PVDiscountRate) ||
      (activeStep === 5 && !form.brokerageFee)
    );
  };

  return (
    <div className="flex items-center gap-10">
      <div className="flex flex-col items-start gap-5">
        <Button
          onClick={finish}
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
              <div className="h-[2.5rem] text-center flex items-center">
                <span className={`font-bold text-sm`}>{step.label}</span>
              </div>
            </Step>
          ))}
        </Stepper>
      </div>

      <Card className="w-[500px] shadow-lg mt-5 p-4 flex flex-col justify-between h-[540px] overflow-y-auto">
        <form className="flex-grow">
          {activeStep === 0 && (
            <PropertyDataStep1 form={form} setForm={setForm} />
          )}
          {activeStep === 1 && (
            <PropertyDataStep2 form={form} setForm={setForm} />
          )}
          {activeStep === 2 && (
            <PropertyDataStep3 form={form} setForm={setForm} />
          )}
          {activeStep === 3 && (
            <PropertyDataStep4 form={form} setForm={setForm} />
          )}
          {activeStep === 4 && (
            <PropertyDataStep5 form={form} setForm={setForm} />
          )}
          {activeStep === 5 && (
            <PropertyDataStep6 form={form} setForm={setForm} />
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
