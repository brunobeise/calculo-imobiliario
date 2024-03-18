import { ReactNode, createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getInitialValues } from "./propertyDataInivitalValues";

export const propertyDataContext = createContext<propertyDataContextType>({
  propertyData: {} as PropertyData,
  setpropertyData: () => {},
  setMultiplePropertyData: () => {},
});

export type PropertyData = {
  propertyValue: number;
  downPayment: number;
  installmentValue: number;
  initialRentValue: number;
  appreciatedPropertyValue: number;
  inCashFees: number;
  financingFees: number;
  monthlyYieldRate: number;
  rentMonthlyYieldRate: number;
  personalBalance: number;
  finalYear: number;
  financingYears: number;
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
  setMultiplePropertyData: (valores: Partial<PropertyData>) => void;
};

export const PropertyDataProvider = ({ children }: { children: ReactNode }) => {
  

  const location = useLocation();

  const [propertyData, setImovelState] = useState<PropertyData>(
    getInitialValues(location.pathname)
  );

  useEffect(() => {
    const initialValues = getInitialValues(location.pathname);
    setImovelState(initialValues);
  }, [location.pathname]);
  

  
  const setpropertyData = (
    campo: keyof PropertyData,
    valor: PropertyData[keyof PropertyData]
  ) => {
    setImovelState((prevState) => ({
      ...prevState,
      [campo]: valor,
    }));
  };

   const setMultiplePropertyData = (valores: Partial<PropertyData>) => {
     setImovelState((prevState) => ({
       ...prevState,
       ...valores,
     }));
   };

  return (
    <propertyDataContext.Provider
      value={{ propertyData, setpropertyData, setMultiplePropertyData }}
    >
      {children}
    </propertyDataContext.Provider>
  );
};
