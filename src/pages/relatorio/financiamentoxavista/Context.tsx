import { ReactNode, createContext, useState } from "react";

export interface InputReportElement {
  active: boolean;
  content: string;
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
        content: "05 de Fevereiro de 2024",
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
