import { ReactNode, createContext, useState } from "react";
import { Discharge } from "./PropertyDataDischargesControl";

export const propertyDataContext = createContext<PropertyDataContextType>({
  propertyData: undefined,
  setPropertyData: () => {},
  setMultiplePropertyData: () => {},
});

export type PropertyData = {
  propertyValue: number;
  downPayment: number;
  subsidy: number;
  installmentValue: number;
  initialRentValue: number;
  initialRentMonth: string;
  initialFinancingMonth: string;
  inCashFees: number;
  financingFees: number;
  financingFeesDate: string;
  annualYieldRate: number;
  rentMonthlyYieldRate: number;
  personalBalance: number;
  finalYear: number;
  financingMonths: number;
  propertyAppreciationRate: number;
  rentAppreciationRate: number;
  outstandingBalance: number;
  interestRate: number;
  brokerageFee: number;
  PVDiscountRate: number;
  isHousing: boolean;
  investTheRest: boolean;
  discharges: Discharge[];
  initialDate: string;
  cdi?: number;
  amortizationType: "SAC" | "PRICE";
  considerCapitalGainsTax: boolean;
  financingFeesDescription: string;
};

export type PropertyDataContextType = {
  propertyData: PropertyData | undefined;
  setPropertyData: (
    field: keyof PropertyData,
    value: PropertyData[keyof PropertyData]
  ) => void;
  setMultiplePropertyData: (values: Partial<PropertyData>) => void;
};

export const PropertyDataProvider = ({ children }: { children: ReactNode }) => {
  const [propertyData, setPropertyDataState] = useState<PropertyData>();

  const setPropertyData = (
    field: keyof NonNullable<PropertyData>,
    value: PropertyData[keyof NonNullable<PropertyData>]
  ) => {
    setPropertyDataState((prevState) => {
      if (!prevState) return prevState;
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  const setMultiplePropertyData = (values: Partial<PropertyData>) => {
    setPropertyDataState((prevState) => {
      return {
        ...prevState,
        ...values,
      };
    });
  };

  return (
    <propertyDataContext.Provider
      value={{ propertyData, setPropertyData, setMultiplePropertyData }}
    >
      {children}
    </propertyDataContext.Provider>
  );
};
