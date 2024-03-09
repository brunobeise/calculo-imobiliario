import { ReactNode, createContext, useState } from "react";

export const propertyDataContext = createContext<propertyDataContextType>({
  propertyData: {} as PropertyData,
  setpropertyData: () => {},
});

export type PropertyData = {
  propertyValue: number;
  downPayment: number;
  installmentValue: number;
  initialRentValue: number;
  rentValue: number[];
  appreciatedPropertyValue: number;
  financingFees: number;
  monthlyYieldRate: number;
  rentMonthlyYieldRate: number;
  personalBalance: number;
  finalYear: number;
  financingYears: number;
  investedEquity: number;
  propertyAppreciationRate: number;
  outstandingBalance: number;
  interestRate: number;
  totalProfit: number;
  totalProfitPercent: number;
};

export type propertyDataContextType = {
  propertyData: PropertyData;
  setpropertyData: (
    campo: keyof PropertyData,
    valor: PropertyData[keyof PropertyData]
  ) => void;
};

export const PropertyDataProvider = ({ children }: { children: ReactNode }) => {
  const [propertyData, setImovelState] = useState<PropertyData>({
    propertyValue: 180000,
    downPayment: 36000,
    installmentValue: 763.89,
    initialRentValue: 700,
    rentValue: [700, 756, 816.48, 881.79, 952.34, 1028.52],
    appreciatedPropertyValue: 285637,
    financingYears: 35,
    financingFees: 4000,
    monthlyYieldRate: 1,
    rentMonthlyYieldRate: 0.8,
    personalBalance: 180000,
    finalYear: 6,
    investedEquity: 293863.08,
    propertyAppreciationRate: 8,
    interestRate: 5.4,
    outstandingBalance: 133211.89,
    totalProfit: 265328.91,
    totalProfitPercent: 147.4,
  });

  const setpropertyData = (
    campo: keyof PropertyData,
    valor: PropertyData[keyof PropertyData]
  ) => {
    setImovelState((prevState) => ({
      ...prevState,
      [campo]: valor,
    }));
  };

  return (
    <propertyDataContext.Provider value={{ propertyData, setpropertyData }}>
      {children}
    </propertyDataContext.Provider>
  );
};
