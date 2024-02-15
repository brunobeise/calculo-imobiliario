import TablePropertyAppreciation from "@/components/shared/tables/TablePropertyAppreciation";
import TableRentAppreciation from "@/components/shared/tables/TableRentAppreciation";
import { numeroParaReal } from "@/lib/formatter";
import { propertyDataContext } from "@/PropertyDataContext";
import { useContext } from "react";

export default function PropertyDetails() {
  const { propertyData } = useContext(propertyDataContext);

  const {
    anoFinal,
    rendimentoMensal,
    saldoDevedor,
    saldoPessoal,
    taxaDeJuros,
    taxasFincancimento,
    valorEntrada,
    valorImovel,
    valorInicialAluguel,
    valorParcela,
    taxaValorizaçãoDoImovel,
    anosFinanciamento,
  } = propertyData;

  const InfoItemReais = ({ text, value }: { text: string; value: number }) => (
    <p>
      {text}
      {"  "}
      <span className="font-bold">{numeroParaReal(value)}</span>
    </p>
  );

  const InfoItemPercent = ({
    text,
    value,
  }: {
    text: string;
    value: number;
  }) => (
    <p>
      {text}
      {"  "}
      <span className="font-bold">{value + "%"}</span>
    </p>
  );

  const InfoItemYears = ({ text, value }: { text: string; value: number }) => (
    <p>
      {text}
      {"  "}
      <span className="font-bold">{value + " Anos"}</span>
    </p>
  );

  return (
    <div className=" px-12">
      <h3 className="text-xl font-bold text-center leading-7 mb-5">
        Dados considerados para o comparativo:
      </h3>
      <div className="grid grid-cols-2 gap-10">
        <div>
          <InfoItemReais text="Saldo inicial:" value={saldoPessoal} />
          <InfoItemReais text="Valor do imóvel:" value={valorImovel} />

          <InfoItemReais
            text="Valor inicial do Aluguel:"
            value={valorInicialAluguel}
          />

          <InfoItemPercent
            text="Valorização anual do imóvel:"
            value={taxaValorizaçãoDoImovel}
          />

          <InfoItemPercent
            text="Rendimento médio mensal:"
            value={rendimentoMensal}
          />

          <InfoItemYears text="Cálculo feito em:" value={anoFinal} />
        </div>
        <div>
          <InfoItemReais text="Valor da entrada:" value={valorEntrada} />
          <InfoItemReais
            text="Taxas do financiamento:"
            value={taxasFincancimento}
          />
          <InfoItemPercent text="CET do financiamento:" value={taxaDeJuros} />
          <InfoItemYears
            text="Tempo do financiamento:"
            value={anosFinanciamento}
          />

          <InfoItemReais text="Valor da Parcela:" value={valorParcela} />

          <InfoItemReais
            text={`Saldo devedor em ${anoFinal} Anos:`}
            value={saldoDevedor}
          />
        </div>
      </div>
      <h3 className="text-xl font-bold text-center leading-7 mt-10 mb-5">
        Precondições para comparação dos cenários:
      </h3>
      <ul className="list-decimal">
        <li>
          <strong>Reinvestimento Integral dos Rendimentos:</strong> Todos os
          rendimentos do aluguel e os retornos gerados serão completamente
          reinvestidos em produtos de renda fixa, sem exceções para despesas ou
          novos investimentos.
        </li>
        <li>
          <strong>Uniformidade das Taxas de Rendimento:</strong> As taxas de
          rendimento, valorização do aluguel e valorização do imóvel serão as
          mesmas em ambos os cenários para garantir uma comparação equitativa.
        </li>
        <li>
          <strong>Dedicação Exclusiva do Saldo para Investimento:</strong>{" "}
          Qualquer saldo remanescente será exclusivamente investido em renda
          fixa, mantendo os valores comparáveis e focados na análise.
        </li>
      </ul>
      <h3 className="text-xl font-bold text-center leading-7 mb-5">
        Valorização do aluguel e do imóvel:
      </h3>
      <p>
        À medida que o tempo avança, observa-se um incremento no valor do
        aluguel, refletindo as tendências econômicas. O valor de mercado do
        imóvel também experimenta uma valorização, seguindo o mesmo percentual
        estabelecido para o aluguel. Essa progressão é fundamental para os
        cálculos apresentados nas tabelas subsequentes, garantindo uma avaliação
        precisa do impacto financeiro ao longo do tempo.
      </p>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <TablePropertyAppreciation />
        <TableRentAppreciation />
      </div>
    </div>
  );
}
