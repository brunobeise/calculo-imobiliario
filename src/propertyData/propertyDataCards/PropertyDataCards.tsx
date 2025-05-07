/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useMemo, useState } from "react";
import { propertyDataContext, PropertyData } from "../PropertyDataContext";
import { calcOutstandingBalance, calcInstallmentValue } from "@/lib/calcs";
import PropertyDataCardsFinancingPlanningSimple from "./PropertyDataCardsFinancingPlanningSimple";
import PropertyDataCardsFinancingPlanningAdvanced from "./PropertyDataCardsFinancingPlanningAdvanced";
import InstallmentSimulationModal from "@/components/modals/InstallmentSimulationModal";
import FinancingFeesDescriptionModal from "@/components/modals/FinancingFeesDescriptionModal";
import PropertyDataCardsDirectFinancingSimple from "./PropertyDataCardsDirectFinancingSimple";
import PropertyDataCardsDirectFinancingAdvanced from "./PropertyDataCardsDirectFinancingAdvanced";

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
  handleChangeBoolean: (event: any) => void;
  handleChangeNumber: (id: string, value: string) => void;
  totalDischarges: number;
  totalFinanced: number;
  taxValue: number;
}

export default function PropertyDataCards({
  type,
  mode,
}: {
  type: string;
  mode: string;
}) {
  const { propertyData, setPropertyData } = useContext(propertyDataContext);
  const [installmentValueCalculatorLock, setInstallmentValueCalculatorLock] =
    useState(false);
  const [installmentSimulator, setInstallmentSimulator] = useState(false);
  const [financingFeesDescriptionModal, setFinancingFeesDescriptionModal] =
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

  const totalFinanced =
    (propertyData?.propertyValue || 0) -
    (propertyData?.downPayment || 0) -
    (totalDischarges || 0) -
    (propertyData?.subsidy || 0);

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
    handleChangeBoolean,
    handleChangeNumber,
    totalDischarges,
    totalFinanced,
    taxValue,
  };

  const Cards = useMemo(() => {
    if (mode === "directFinancing" && type === "Avançado") {
      return <PropertyDataCardsDirectFinancingAdvanced {...sharedProps} />;
    }
    if (mode === "directFinancing" && type === "Simplificado") {
      return <PropertyDataCardsDirectFinancingSimple {...sharedProps} />;
    }
    if (mode === "financingPlanning" && type === "Avançado") {
      return <PropertyDataCardsFinancingPlanningAdvanced {...sharedProps} />;
    }
    if (mode === "financingPlanning" && type === "Simplificado") {
      return <PropertyDataCardsFinancingPlanningSimple {...sharedProps} />;
    }
  }, [mode, sharedProps, type]);

  return (
    <>
      {" "}
      <div className="md:px-10 mt-4">{Cards}</div>
      <InstallmentSimulationModal
        onClose={() => setInstallmentSimulator(false)}
        open={installmentSimulator}
        onSimulate={(v) => setPropertyData("installmentValue", v)}
      />
      <FinancingFeesDescriptionModal
        open={financingFeesDescriptionModal}
        onClose={() => setFinancingFeesDescriptionModal(false)}
        onSubmit={(v) => setPropertyData("financingFeesDescription", v)}
        value={propertyData.financingFeesDescription}
      />
    </>
  );
}
