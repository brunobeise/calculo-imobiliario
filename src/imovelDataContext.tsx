import { ReactNode, createContext, useState } from "react";

export const ImovelDataContext = createContext<ImovelDataContextType>({
  imovelData: {} as ImovelData,
  setImovelData: () => {},
});

export type ImovelData = {
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
  patrimonioInvestido: number;
  taxaValorizaçãoDoImovel: number;
  saldoDevedor: number;
  taxaDeJuros: number;
};

export type ImovelDataContextType = {
  imovelData: ImovelData;
  setImovelData: (
    campo: keyof ImovelData,
    valor: ImovelData[keyof ImovelData]
  ) => void;
};

export const ImovelDataProvider = ({ children }: { children: ReactNode }) => {
  const [imovelData, setImovelState] = useState<ImovelData>({
    valorImovel: 180000,
    valorEntrada: 36000,
    valorParcela: 763.89,
    valorInicialAluguel: 700,
    valorAluguel: [700, 756, 816.48, 881.79, 952.34, 1028.52],
    valorImóvelValorizado: 285637,
    taxasFincancimento: 4000,
    rendimentoMensal: 1,
    saldoPessoal: 180000,
    anoFinal: 6,
    patrimonioInvestido: 0,
    taxaValorizaçãoDoImovel: 8,
    taxaDeJuros: 5.4,
    saldoDevedor: 133211.89,
  });

  const setImovelData = (
    campo: keyof ImovelData,
    valor: ImovelData[keyof ImovelData]
  ) => {
    setImovelState((prevState) => ({
      ...prevState,
      [campo]: valor,
    }));
  };

  return (
    <ImovelDataContext.Provider value={{ imovelData, setImovelData }}>
      {children}
    </ImovelDataContext.Provider>
  );
};
