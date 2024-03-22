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
  interestPaid: number;
  finalValue: number;
  monthlyProfit: number;
  propertyValue: number;
  rentalShortfall: number;
}

export type IsolatedFinanceOrCashData = {
  inCash: {
    totalProfit: number;
    totalProfitPercent: number;
    investedEquityFinal: number;
    totalFinalEquity: number;
    breakEven: number;
    totalRentalShortfall: number;
    totalInterestPaid: number;
    detailedTable: IsolatedFinancingOrCashDetailedTable[];
    capitalGainsTax: number;
  };
  financing: {
    investedEquityFinal: number;
    totalProfit: number;
    totalProfitPercent: number;
    totalFinalEquity: number;
    breakEven?: number;
    totalRentalShortfall: number;
    totalInterestPaid: number;
    detailedTable: IsolatedFinancingOrCashDetailedTable[];
    capitalGainsTax: number;
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
      totalRentalShortfall: 0,
      totalInterestPaid: 0,
      totalProfit: 192892.99,
      totalProfitPercent: 107.16,
      investedEquityFinal: 0,
      totalFinalEquity: 372892,
      breakEven: 0,
      detailedTable: [],
      capitalGainsTax: 0
    },
    financing: {
      totalProfit: 265328.91,
      totalRentalShortfall: 38547.84,
      totalInterestPaid: 0,
      totalProfitPercent: 147.4,
      investedEquityFinal: 0,
      totalFinalEquity: 425637,
      breakEven: 66,
      detailedTable: [],
      capitalGainsTax: 0
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
