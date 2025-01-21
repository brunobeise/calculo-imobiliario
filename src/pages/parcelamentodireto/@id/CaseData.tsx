import { ReactNode, createContext, useState } from "react";

export const caseDataContext = createContext<caseDataContextType>({
  caseData: {} as DirectFinancingData,
  setCaseData: () => {},
});

export interface DirectFinancingDetailedTable {
  totalCapital: number;
  initialCapital: number;
  initialCapitalYield: number;
  rentValue: number;
  rentalAmount: number;
  outstandingBalance: number;
  finalValue: number;
  monthlyProfit: number;
  propertyValue: number;
  rentalShortfall: number;
  investmentExcess: number;
  investmentExcessPresentValue: number;
}

export type DirectFinancingData = {
  totalInvestment: number;
  investedEquityFinal: number;
  totalProfit: number;
  totalProfitPercent: number;
  totalFinalEquity: number;
  breakEven?: number;
  totalRentalShortfall: number;

  detailedTable: DirectFinancingDetailedTable[];
  capitalGainsTax: number;
  finalRow: DirectFinancingDetailedTable;
  investedEquityPresentValue: number;
  brokerageFee: number;
};

export type caseDataContextType = {
  caseData: DirectFinancingData;
  setCaseData: (value: DirectFinancingData) => void;
};

export const DirectFinancingCaseDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [caseData, setCaseState] = useState<DirectFinancingData>({
    totalInvestment: 187742.84,
    totalProfit: 265328.91,
    totalRentalShortfall: 38547.84,
    totalProfitPercent: 147.4,
    investedEquityFinal: 0,
    totalFinalEquity: 425637,
    breakEven: 66,
    detailedTable: [],
    capitalGainsTax: 0,
    investedEquityPresentValue: 0,
    finalRow: {} as DirectFinancingDetailedTable,
    brokerageFee: 0,
  });

  const setCaseData = (value: DirectFinancingData) => setCaseState(value);
  return (
    <caseDataContext.Provider value={{ caseData, setCaseData }}>
      {children}
    </caseDataContext.Provider>
  );
};
