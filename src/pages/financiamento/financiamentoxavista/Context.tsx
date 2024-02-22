import { ReactNode, createContext, useState } from "react";

export const caseDataContext = createContext<caseDataContextType>({
  caseData: {} as FinanceOrCashData,
  setCaseData: () => {},
});

export type FinanceOrCashData = {
  inCash: {
    totalProfit: number;
    totalProfitPercent: number;
    investedEquity: number;
    investedEquityFinal: number;
    totalFinalEquity: number;
  };
  financing: {
    investedEquityFinal: number;
    totalProfit: number;
    totalProfitPercent: number;
    investedEquity: number;
    totalFinalEquity: number;
  };
};

export type caseDataContextType = {
  caseData: FinanceOrCashData;
  setCaseData: (
    campo: keyof FinanceOrCashData,
    valor: FinanceOrCashData[keyof FinanceOrCashData]
  ) => void;
};

export const FinanceOrInCashCaseDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [caseData, setCaseState] = useState<FinanceOrCashData>({
    inCash: {
      totalProfit: 192892.99,
      totalProfitPercent: 107.16,
      investedEquity: 87255.99,
      investedEquityFinal: 0,
      totalFinalEquity: 372892,
    },
    financing: {
      investedEquity: 293863.08,
      totalProfit: 265328.91,
      totalProfitPercent: 147.4,
      investedEquityFinal: 0,
      totalFinalEquity: 425637,
    },
  });

  const setCaseData = (
    campo: keyof FinanceOrCashData,
    valor: FinanceOrCashData[keyof FinanceOrCashData]
  ) => {
    setCaseState((prevState) => ({
      ...prevState,
      [campo]: valor,
    }));
  };

  return (
    <caseDataContext.Provider value={{ caseData, setCaseData }}>
      {children}
    </caseDataContext.Provider>
  );
};
