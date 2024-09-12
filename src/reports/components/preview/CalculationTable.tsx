import { toBRL } from "@/lib/formatter";

interface CalculationTableProps {
  propertyData: {
    propertyAppreciationRate: number;
    rentMonthlyYieldRate: number;
  };
  caseData: {
    detailedTable: {
      propertyValue: number;
      rentValue: number;
      rentalAmount: number;
    }[];
  };
}

const CalculationTable = ({ propertyData, caseData }: CalculationTableProps) => {
  return (
    <table className="min-w-full">
      <thead className="text-primary">
        <tr>
          <th className="px-4 py-2 border-r border-b border-primary text-left"></th>
          <th className="px-4 py-2 border-r border-b border-primary text-left">
            <div className="flex flex-col">
              <strong>Valorização Imóvel</strong>
              <span className="text-sm font-normal">
                conservador {propertyData.propertyAppreciationRate}%
              </span>
            </div>
          </th>
          <th className="px-4 py-2 border-r border-b border-primary text-left">
            <div className="flex flex-col">
              <strong>Projeção Aluguel</strong>
              <span className="text-sm font-normal">
                regular {propertyData.rentMonthlyYieldRate * 10}%
              </span>
            </div>
          </th>
          <th className="px-4 py-2 border-b border-primary text-left">
            <div className="flex flex-col">
              <strong>Diferença</strong>
              <span className="text-sm font-normal">aluguel - parcela</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {caseData.detailedTable.map((item, i) => {
          if ((i - 1) % 12 === 0)
            return (
              <tr className="text-primary" key={i}>
                <td className="px-4 py-2 border-r border-primary">
                  Ano {((i - 1) / 12) + 1}
                </td>
                <td className="px-4 py-2 border-r border-primary">
                  {toBRL(item.propertyValue * (1 + propertyData.propertyAppreciationRate / 100))}
                </td>
                <td className="px-4 py-2 border-r border-primary">
                  {toBRL(item.rentValue)}
                </td>
                <td className="px-4 py-2 border-primary">
                  {toBRL(item.rentalAmount)}
                </td>
              </tr>
            );
        })}
      </tbody>
    </table>
  );
};

export default CalculationTable;
