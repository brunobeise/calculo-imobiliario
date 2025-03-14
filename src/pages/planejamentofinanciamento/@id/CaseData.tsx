import { ReactNode, createContext, useState } from "react";

export const caseDataContext = createContext<caseDataContextType>({
  caseData: {} as FinancingPlanningData,
  setCaseData: () => {},
});

export interface FinancingPlanningDetailedTable {
  totalCapital: number;
  initialCapital: number;
  initialCapitalYield: number;
  installmentValue: number;
  rentValue: number;
  rentalAmount: number;
  outstandingBalance: number;
  interestPaid: number;
  finalValue: number;
  monthlyProfit: number;
  propertyValue: number;
  rentalShortfall: number;
  investmentExcess: number;
  investmentExcessPresentValue: number;
}

export type FinancingPlanningData = {
  totalInvestment: number;
  investedEquityFinal: number;
  totalProfit: number;
  totalProfitPercent: number;
  totalFinalEquity: number;
  breakEven?: number;
  totalRentalShortfall: number;
  totalInterestPaid: number;
  detailedTable: FinancingPlanningDetailedTable[];
  capitalGainsTax: number;
  finalRow: FinancingPlanningDetailedTable;
  investedEquityPresentValue: number;
  brokerageFee: number;
};

export type caseDataContextType = {
  caseData: FinancingPlanningData;
  setCaseData: (value: FinancingPlanningData) => void;
};

export const FinancingPlanningCaseDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [caseData, setCaseState] = useState<FinancingPlanningData>({
    totalInvestment: 187742.84,
    totalProfit: 265328.91,
    totalRentalShortfall: 38547.84,
    totalInterestPaid: 0,
    totalProfitPercent: 147.4,
    investedEquityFinal: 0,
    totalFinalEquity: 425637,
    breakEven: 66,
    detailedTable: [],
    capitalGainsTax: 0,
    investedEquityPresentValue: 0,
    finalRow: {} as FinancingPlanningDetailedTable,
    brokerageFee: 0,
  });

  const setCaseData = (value: FinancingPlanningData) => setCaseState(value);
  return (
    <caseDataContext.Provider value={{ caseData, setCaseData }}>
      {children}
    </caseDataContext.Provider>
  );
};
