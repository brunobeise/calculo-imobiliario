/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { PropertyData } from "../PropertyDataContext";
import { calcOutstandingBalance, calcInstallmentValue } from "@/lib/calcs";
import PropertyDataCardsFinancingPlanningSimple from "./PropertyDataCardsFinancingPlanningSimple";
import PropertyDataCardsFinancingPlanningAdvanced from "./PropertyDataCardsFinancingPlanningAdvanced";
import InstallmentSimulationModal from "@/components/modals/InstallmentSimulationModal";
import FinancingFeesDescriptionModal from "@/components/modals/FinancingFeesDescriptionModal";
import PropertyDataCardsDirectFinancingSimple from "./PropertyDataCardsDirectFinancingSimple";
import PropertyDataCardsDirectFinancingAdvanced from "./PropertyDataCardsDirectFinancingAdvanced";
import FinancingCorrectionModal, {
  FinancingCorrectionModalSubmit,
} from "@/components/modals/FinancingCorrectionModal";
import dayjs from "dayjs";
import { ProposalTypes } from "@/types/proposalTypes";

export interface PropertyDataCardsProps {
  propertyData: PropertyData;
  setPropertyData: (
    field: keyof PropertyData,
    value: PropertyData[keyof PropertyData]
  ) => void;
  installmentValueCalculatorLock: boolean;
  setInstallmentValueCalculatorLock: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  installmentSimulator: boolean;
  setInstallmentSimulator: React.Dispatch<React.SetStateAction<boolean>>;
  financingFeesDescriptionModal: boolean;
  setFinancingFeesDescriptionModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  financingCorrectionModal: boolean;
  setFinancingCorrectionModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeBoolean: (event: any) => void;
  handleChangeNumber: (id: string, value: string) => void;
  totalDischarges: number;
  totalFinanced: number;
  baseFinanced: number;
  taxValue: number;
}

export default function PropertyDataCards({
  type,
  mode,
  propertyData,
  setPropertyData,
}: {
  type: string;
  mode: string;
  propertyData: PropertyData;
  setPropertyData: (
    field: keyof PropertyData,
    value: PropertyData[keyof PropertyData]
  ) => void;
}) {
  const [installmentValueCalculatorLock, setInstallmentValueCalculatorLock] =
    useState(false);
  const [installmentSimulator, setInstallmentSimulator] = useState(false);
  const [financingFeesDescriptionModal, setFinancingFeesDescriptionModal] =
    useState(false);
  const [financingCorrectionModal, setFinancingCorrectionModal] =
    useState(false);

  const handleChangeBoolean = (event) => {
    const value = event.target.checked;
    const id = event.target.id;
    setPropertyData(id, value);
  };

  const handleChangeNumber = (id, value) => {
    setPropertyData(id, Number(value));
  };

  const totalDischarges = useMemo(() => {
    if (!propertyData) return 0;
    return propertyData.discharges
      .filter((d) => !d.isConstructionInterest)
      .reduce((acc, val) => acc + val.originalValue, 0);
  }, [propertyData]);

  const baseFinanced =
    (propertyData?.propertyValue || 0) -
    (propertyData?.downPayment || 0) -
    (totalDischarges || 0) -
    (propertyData?.subsidy || 0);

  const monthlyRate = (propertyData?.financingCorrectionRate || 0) / 100;
  const months =
    dayjs(propertyData?.initialFinancingMonth, "MM/YYYY").diff(
      dayjs(propertyData?.initialDate, "MM/YYYY"),
      "month"
    ) - 1;

  const totalFinanced = parseFloat(
    (baseFinanced * Math.pow(1 + monthlyRate, months)).toFixed(2)
  );

  useEffect(() => {
    if (!propertyData) return;

    const installmentValue =
      calcInstallmentValue(
        totalFinanced,
        propertyData.interestRate,
        propertyData.financingMonths,
        propertyData.amortizationType
      ) + 150;

    const outstandingBalance = calcOutstandingBalance(
      totalFinanced,
      propertyData.interestRate,
      propertyData.financingMonths,
      12 * propertyData.finalYear,
      propertyData.amortizationType
    );

    if (installmentValueCalculatorLock)
      setPropertyData("installmentValue", installmentValue);
    setPropertyData("outstandingBalance", outstandingBalance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    propertyData?.finalYear,
    propertyData?.initialRentValue,
    propertyData?.propertyValue,
    propertyData?.downPayment,
    propertyData?.interestRate,
    propertyData?.propertyAppreciationRate,
    propertyData?.financingMonths,
    propertyData?.discharges,
    propertyData?.amortizationType,
    installmentValueCalculatorLock,
  ]);

  const taxValue = useMemo(() => {
    if (!propertyData) return 0;
    const result =
      propertyData.installmentValue -
      calcInstallmentValue(
        totalFinanced,
        propertyData.interestRate,
        propertyData.financingMonths,
        propertyData.amortizationType
      );
    return Math.abs(result) < 0.01 ? 0 : result;
  }, [propertyData, totalFinanced]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sharedProps = {
    propertyData,
    setPropertyData,
    installmentValueCalculatorLock,
    setInstallmentValueCalculatorLock,
    installmentSimulator,
    setInstallmentSimulator,
    financingFeesDescriptionModal,
    setFinancingFeesDescriptionModal,
    financingCorrectionModal,
    setFinancingCorrectionModal,
    handleChangeBoolean,
    handleChangeNumber,
    totalDischarges,
    totalFinanced,
    baseFinanced,
    taxValue,
  };

  const Cards = useMemo(() => {
    if (mode === ProposalTypes.ParcelamentoDireto && type === "Avançado") {
      return <PropertyDataCardsDirectFinancingAdvanced {...sharedProps} />;
    }
    if (mode === ProposalTypes.ParcelamentoDireto && type === "Simplificado") {
      return <PropertyDataCardsDirectFinancingSimple {...sharedProps} />;
    }
    if (mode === ProposalTypes.FinancamentoBancário && type === "Avançado") {
      return <PropertyDataCardsFinancingPlanningAdvanced {...sharedProps} />;
    }
    if (
      mode === ProposalTypes.FinancamentoBancário &&
      type === "Simplificado"
    ) {
      return <PropertyDataCardsFinancingPlanningSimple {...sharedProps} />;
    }
  }, [mode, sharedProps, type]);

  return (
    <>
      <div className="md:px-10">{Cards}</div>
      <InstallmentSimulationModal
        onClose={() => setInstallmentSimulator(false)}
        open={installmentSimulator}
        totalFinanced={totalFinanced}
        onSimulate={(v) => setPropertyData("installmentValue", v)}
      />
      <FinancingFeesDescriptionModal
        open={financingFeesDescriptionModal}
        onClose={() => setFinancingFeesDescriptionModal(false)}
        onSubmit={(v) => setPropertyData("financingFeesDescription", v)}
        value={propertyData?.financingFeesDescription}
      />
      <FinancingCorrectionModal
        studyDate={propertyData.initialDate}
        startDate={propertyData.initialFinancingMonth}
        totalfinanced={baseFinanced}
        value={propertyData.financingCorrectionRate}
        open={financingCorrectionModal}
        onClose={() => setFinancingCorrectionModal(false)}
        onSubmit={(v: FinancingCorrectionModalSubmit) => {
          handleChangeNumber("financingCorrectionRate", v.monthlyRate);
          setPropertyData("financingCorrectionDescription", v.description);
        }}
        description={propertyData.financingCorrectionDescription}
      />
    </>
  );
}
