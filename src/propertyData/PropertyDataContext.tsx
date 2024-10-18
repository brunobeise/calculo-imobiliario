import { ReactNode, createContext, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
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
  monthlyYieldRate: number;
  rentMonthlyYieldRate: number;
  personalBalance: number;
  finalYear: number;
  financingYears: number;
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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const useSaveData = searchParams.get("useSaveData") === "true";

  const useSaveDataMap = {
    "/financialplanning": JSON.parse(
      localStorage.getItem("financingPlanningPropertyData") || "{}"
    ),
  };

  // Initialize propertyData state, allowing undefined
  const [propertyData, setPropertyDataState] = useState<PropertyData>(
    useSaveData
      ? useSaveDataMap[location.pathname as keyof typeof useSaveDataMap]
      : undefined
  );

  // Effect to update propertyData when location changes
  // useEffect(() => {
  //   if (location.pathname === "/") return;
  //   if (location.pathname === "/user") return;
  //   if (location.pathname === "/realty") return;

  //   const initialValues = useSaveData
  //     ? useSaveDataMap[location.pathname as keyof typeof useSaveDataMap]
  //     : getInitialValues(location.pathname);

  //   setPropertyDataState(initialValues);
  // }, [location.pathname]);

  // Function to set individual property data
  const setPropertyData = (
    field: keyof NonNullable<PropertyData>, // Garantimos que o campo só seja usado se não for undefined
    value: PropertyData[keyof NonNullable<PropertyData>] // Garantimos que o valor corresponde ao tipo da propriedade
  ) => {
    setPropertyDataState((prevState) => {
      if (!prevState) return prevState; // Se prevState for undefined, não faz nada
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  // Function to set multiple properties at once
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
