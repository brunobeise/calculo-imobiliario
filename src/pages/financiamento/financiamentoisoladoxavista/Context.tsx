import { ReactNode, createContext, useState } from "react";

export const caseDataContext = createContext<caseDataContextType>({
  caseData: {} as IsolatedFinanceOrCashData,
  setCaseData: () => {},
});

export interface IsolatedFinancingOrCashDetailedTable {
  totalCapital: number;
  initialCapital: number; 
  initialCapitalYield: number; 
  rentValue: number; 
  rentalAmount: number;
  outstandingBalance: number; 
  finalValue: number;
  monthlyProfit: number;
  propertyValue: number;
}

export type IsolatedFinanceOrCashData = {
  inCash: {
    totalProfit: number;
    totalProfitPercent: number;
    investedEquityFinal: number;
    totalFinalEquity: number;
    breakEven: number;
    detailedTable: IsolatedFinancingOrCashDetailedTable[];
  };
  financing: {
    investedEquityFinal: number;
    totalProfit: number;
    totalProfitPercent: number;
    totalFinalEquity: number;
    breakEven?: number;
    detailedTable: IsolatedFinancingOrCashDetailedTable[];
  };
};

export type caseDataContextType = {
  caseData: IsolatedFinanceOrCashData;
  setCaseData: (
    campo: keyof IsolatedFinanceOrCashData,
    valor: IsolatedFinanceOrCashData[keyof IsolatedFinanceOrCashData]
  ) => void;
};

export const IsolatedFinanceOrInCashCaseDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [caseData, setCaseState] = useState<IsolatedFinanceOrCashData>({
    inCash: {
      totalProfit: 192892.99,
      totalProfitPercent: 107.16,
  
      investedEquityFinal: 0,
      totalFinalEquity: 372892,
      breakEven: 66,
      detailedTable: [],
    },
    financing: {
    
      totalProfit: 265328.91,
      totalProfitPercent: 147.4,
      investedEquityFinal: 0,
      totalFinalEquity: 425637,
      breakEven: 66,
      detailedTable: [],
    },
  });

  const setCaseData = (
    key: keyof IsolatedFinanceOrCashData,
    value: IsolatedFinanceOrCashData[keyof IsolatedFinanceOrCashData]
  ) => {
    setCaseState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <caseDataContext.Provider value={{ caseData, setCaseData }}>
      {children}
    </caseDataContext.Provider>
  );
};
