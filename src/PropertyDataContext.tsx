import { ReactNode, createContext, useState } from "react";

export const propertyDataContext = createContext<propertyDataContextType>({
  propertyData: {} as propertyData,
  setpropertyData: () => {},
});

export type propertyData = {
  valorImovel: number;
  valorEntrada: number;
  valorParcela: number;
  valorInicialAluguel: number;
  valorAluguel: number[];
  valorImóvelValorizado: number;
  taxasFincancimento: number;
  rendimentoMensal: number;
  saldoPessoal: number;
  anoFinal: number;
  anosFinanciamento: number;
  patrimonioInvestido: number;
  taxaValorizaçãoDoImovel: number;
  saldoDevedor: number;
  taxaDeJuros: number;
};

export type propertyDataContextType = {
  propertyData: propertyData;
  setpropertyData: (
    campo: keyof propertyData,
    valor: propertyData[keyof propertyData]
  ) => void;
};

export const PropertyDataProvider = ({ children }: { children: ReactNode }) => {
  const [propertyData, setImovelState] = useState<propertyData>({
    valorImovel: 180000,
    valorEntrada: 36000,
    valorParcela: 763.89,
    valorInicialAluguel: 700,
    valorAluguel: [700, 756, 816.48, 881.79, 952.34, 1028.52],
    valorImóvelValorizado: 285637,
    anosFinanciamento: 35,
    taxasFincancimento: 4000,
    rendimentoMensal: 1,
    saldoPessoal: 180000,
    anoFinal: 6,
    patrimonioInvestido: 0,
    taxaValorizaçãoDoImovel: 8,
    taxaDeJuros: 5.4,
    saldoDevedor: 133211.89,
  });

  const setpropertyData = (
    campo: keyof propertyData,
    valor: propertyData[keyof propertyData]
  ) => {
    setImovelState((prevState) => ({
      ...prevState,
      [campo]: valor,
    }));
  };

  return (
    <propertyDataContext.Provider value={{ propertyData, setpropertyData }}>
      {children}
    </propertyDataContext.Provider>
  );
};
