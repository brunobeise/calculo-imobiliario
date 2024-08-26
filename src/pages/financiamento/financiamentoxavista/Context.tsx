import { ReactNode, createContext, useState } from "react";

export const caseDataContext = createContext<caseDataContextType>({
  caseData: {} as FinanceOrCashData,
  setCaseData: () => {},
});

export interface FinancingOrCashDetailedTable {
  totalCapital: number; // A soma dos dois capitais: capital inicial e capital de renda de aluguel
  initialCapital: number; // Capital inicial investido ou restante após a compra
  initialCapitalYield: number; // Rendimento gerado a partir do capital inicial
  rentValue: number; // Valor do aluguel para o período
  rentalAmount: number; // Total gerado a partir do aluguel
  outstandingBalance: number; // Saldo devedor no caso de financiamento
  finalValue: number; // Valor final após adicionar os rendimentos ao capital
  rentalIncomeCapital: number; // Capital gerado a partir da renda de aluguel
  rentalIncomeYield: number; // Rendimento gerado a partir do capital de renda de aluguel
  monthlyProfit: number;
  interestPaid: number;
  propertyValue: number;
}

export type FinanceOrCashData = {
  inCash: {
    totalProfit: number;
    totalProfitPercent: number;
    investedEquity: number;
    investedEquityFinal: number;
    totalFinalEquity: number;
    breakEven: number;
    detailedTable: FinancingOrCashDetailedTable[];
    capitalGainsTax: number;
    finalRow: FinancingOrCashDetailedTable;
    brokerageFee: number;
  };
  financing: {
    investedEquityFinal: number;
    totalProfit: number;
    totalProfitPercent: number;
    investedEquity: number;
    totalFinalEquity: number;
    breakEven?: number;
    detailedTable: FinancingOrCashDetailedTable[];
    capitalGainsTax: number;
    finalRow: FinancingOrCashDetailedTable;
    brokerageFee: number;
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
      breakEven: 66,
      detailedTable: [],
      capitalGainsTax: 0,
      brokerageFee: 0,
      finalRow: {} as FinancingOrCashDetailedTable,
    },
    financing: {
      investedEquity: 293863.08,
      totalProfit: 265328.91,
      totalProfitPercent: 147.4,
      investedEquityFinal: 0,
      totalFinalEquity: 425637,
      breakEven: 66,
      detailedTable: [],
      capitalGainsTax: 0,
      brokerageFee: 0,
      finalRow: {} as FinancingOrCashDetailedTable,
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
