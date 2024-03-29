import dayjs from "dayjs";
import { ReactNode, createContext, useState } from "react";

export interface InputReportElement {
  active: boolean;
  activeSecondary?: boolean;
  content?: string;
  color?: string;
  translateX?: number
  translateY?: number
  
}

export type FinanceOrCashReportContextState = {
  financeOrCashReportState: FinanceOrCashReportContextType;
  setFinanceOrCashReportState: (
    key: keyof FinanceOrCashReportContextType,
    value: FinanceOrCashReportContextType[keyof FinanceOrCashReportContextType]
  ) => void;
};

export const FinanceOrCashReportContext =
  createContext<FinanceOrCashReportContextState>({
    financeOrCashReportState: {} as FinanceOrCashReportContextType,
    setFinanceOrCashReportState: () => {},
  });

export type FinanceOrCashReportContextType = {
  coverType: number;
  propertyPicture: InputReportElement;
  companyLogo1: InputReportElement;
  companyLogo2: InputReportElement;
  propertyName: InputReportElement;
  title: InputReportElement;
  subtitle: InputReportElement;
  createdAt: InputReportElement;
  presentation: InputReportElement;
  calculation: InputReportElement;
  agentDetails: InputReportElement;
  propertyDetails: InputReportElement;
  preconditionsScenarios: InputReportElement;
  appreciationOfRent: InputReportElement;
  financingTitle: InputReportElement;
  financingDivisionCharts: InputReportElement;
  financingMonthlyInvestmentGrowthChart: InputReportElement;
  financingCompleteAnalysis: InputReportElement;
  inCashTitle: InputReportElement;
  inCashDivisionCharts: InputReportElement;
  inCashMonthlyInvestmentGrowthChart: InputReportElement;
  inCashCompleteAnalysis: InputReportElement;
};

export const FinanceOrCashReportProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [financeOrCashReportState, setFinanceOrCashReportState] =
    useState<FinanceOrCashReportContextType>({
      coverType: 1,
      propertyPicture: {
        content: "https://i.imgur.com/gyLifQC.jpg",
        active: true,
      },
      companyLogo1: {
        content: "https://i.imgur.com/ISI36yZ.png",
        active: true,
      },
      companyLogo2: {
        content: "https://i.imgur.com/5Nz5u7Q.png",
        active: true,
      },
      propertyName: {
        content: "Residencial Luxo Azul",
        active: true,
        color: "#ffffff",
      },
      title: {
        content:
          "Análise Comparativa de Aquisição: Financiamento vs. Compra à Vista",
        active: true,
      },
      subtitle: {
        content:
          "Uma visão detalhada do Residencial Luxo Azul: Avaliando os impactos financeiros e benefícios a longo prazo das opções de compra",
        active: true,
      },
      createdAt: {
        content: dayjs().format("YYYY-MM-DD"),
        active: true,
      },
      presentation: {
        content:
          "A análise revela que, com foco no lucro final, o financiamento do imóvel se mostra a opção mais vantajosa em comparação com a compra à vista. Observa-se um retorno significativamente maior no cenário de financiamento. Esse resultado enfatiza a importância de considerar estratégias de financiamento como uma alternativa eficaz para maximizar os retornos financeiros em investimentos imobiliários.",
        active: true,
      },
      calculation: {
        active: true,
        content: "",
      },
      agentDetails: {
        active: true,
      },
      propertyDetails: {
        active: true,
        content: "",
      },
      preconditionsScenarios: {
        active: true,
        content: `
Reinvestimento Integral dos Rendimentos e Dedicação Exclusiva do Saldo para Investimento: Todos os rendimentos do aluguel e os retornos gerados serão completamente reinvestidos em produtos de renda fixa, sem exceções para despesas ou novos investimentos. Adicionalmente, qualquer saldo remanescente será exclusivamente dedicado ao investimento em renda fixa, mantendo os valores comparáveis e focados na análise.`,
      },
      appreciationOfRent: {
        active: true,
        activeSecondary: true,
        content:
          "À medida que o tempo passa, o valor do aluguel aumenta devido às tendências econômicas, e o valor de mercado do imóvel também valoriza no mesmo percentual do aluguel. Essa evolução é crucial para os cálculos em tabelas futuras, permitindo uma avaliação precisa do impacto financeiro ao longo do tempo.",
      },
      financingTitle: {
        content: "Análise do Financiamento:",
        active: true,
      },
      financingDivisionCharts: {
        active: true,
      },
      financingMonthlyInvestmentGrowthChart: {
        active: true,
        content:
          "Todo mês, somamos o aluguel e os rendimentos da renda fixa para pagar as parcelas. O que sobra é reinvestido. Com o aumento periódico do aluguel e parcelas fixas, o montante na renda fixa tende a crescer ao longo do tempo:",
      },
      financingCompleteAnalysis: {
        active: true,
      },
      inCashTitle: {
        content: "Análise da Compra À Vista:",
        active: true,
      },
      inCashDivisionCharts: {
        active: true,
      },
      inCashMonthlyInvestmentGrowthChart: {
        active: true,
        content:
          "Todo mês, somamos o aluguel e os rendimentos da renda fixa para pagar as parcelas. O que sobra é reinvestido. Com o aumento periódico do aluguel e parcelas fixas, o montante na renda fixa tende a crescer ao longo do tempo:",
      },
      inCashCompleteAnalysis: {
        active: true,
      },
    });

  const updateFinanceOrCashReportState = (
    key: keyof FinanceOrCashReportContextType,
    value: FinanceOrCashReportContextType[keyof FinanceOrCashReportContextType]
  ) => {
    setFinanceOrCashReportState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <FinanceOrCashReportContext.Provider
      value={{
        financeOrCashReportState,
        setFinanceOrCashReportState: updateFinanceOrCashReportState,
      }}
    >
      {children}
    </FinanceOrCashReportContext.Provider>
  );
};
