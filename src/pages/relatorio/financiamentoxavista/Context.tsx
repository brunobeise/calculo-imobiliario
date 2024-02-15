import dayjs from "dayjs";
import { ReactNode, createContext, useState } from "react";

export interface InputReportElement {
  active: boolean;
  activeSecondary?: boolean;
  content: string;
  color?: string;
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
  agentName: InputReportElement;
  agentCRECI: InputReportElement;
  propertyDetails: InputReportElement;
  preconditionsScenarios: InputReportElement;
  appreciationOfRent: InputReportElement;
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
        content:
          "https://k1planejamento.com.br/wp-content/uploads/2023/04/7.jpg",
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
          "Este documento foi meticulosamente preparado com o intuito de avaliar e comparar os impactos financeiros e os benefícios de longo prazo entre as duas principais abordagens de aquisição de um imóvel: financiamento e compra à vista.",
        active: true,
      },
      agentName: {
        active: true,
        content: "Pedro Regert",
      },
      agentCRECI: {
        active: true,
        content: "123871623",
      },
      propertyDetails: {
        active: true,
        content: "",
      },
      preconditionsScenarios: {
        active: true,
        content: `Reinvestimento Integral dos Rendimentos: Todos os rendimentos do aluguel e os retornos gerados serão completamente reinvestidos em produtos de renda fixa, sem exceções para despesas ou novos investimentos.

Uniformidade das Taxas de Rendimento: As taxas de rendimento, valorização do aluguel e valorização do imóvel serão as mesmas em ambos os cenários para garantir uma comparação equitativa.

Dedicação Exclusiva do Saldo para Investimento: Qualquer saldo remanescente será exclusivamente investido em renda fixa, mantendo os valores comparáveis e focados na análise.`,
      },
      appreciationOfRent: {
        active: true,
        activeSecondary: true,
        content:
          "À medida que o tempo passa, o valor do aluguel aumenta devido às tendências econômicas, e o valor de mercado do imóvel também valoriza no mesmo percentual do aluguel. Essa evolução é crucial para os cálculos em tabelas futuras, permitindo uma avaliação precisa do impacto financeiro ao longo do tempo.",
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
