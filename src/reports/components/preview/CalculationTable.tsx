import { toBRL } from "@/lib/formatter";
import SectionTitle from "./SectionTitle";
import { GrLineChart } from "react-icons/gr";
import { PropertyData } from "@/propertyData/PropertyDataContext";

interface CalculationTableProps {
  propertyData: PropertyData;
  caseData: {
    detailedTable: {
      propertyValue: number;
      rentValue: number;
      rentalAmount: number;
    }[];
  };
  color: string;
  secondary: string;
  displayRentalAmount?: boolean;
}

const CalculationTable = ({
  propertyData,
  caseData,
  color,
  secondary,
  displayRentalAmount = true,
}: CalculationTableProps) => {
  return (
    <>
      <SectionTitle
        color={color}
        secondary={secondary}
        title={"Valorização do Imóvel e Projeção do Aluguel"}
        icon={<GrLineChart />}
      />
      <table
        style={{ color, outlineColor: secondary, borderColor: secondary }}
        className="min-w-full outline outline-1 rounded-3xl"
      >
        <thead>
          <tr>
            <th
              style={{ borderColor: secondary }}
              className="px-4 py-3 border-r border-b text-left"
            ></th>
            <th
              style={{ borderColor: secondary }}
              className="px-4 py-3 border-r border-b text-left"
            >
              <div className="flex flex-col">
                <strong>Valorização Imóvel</strong>
                <span className="text-sm font-normal">
                  {propertyData.propertyAppreciationRate}%
                </span>
              </div>
            </th>
            <th
              style={{ borderColor: secondary }}
              className={`px-4 py-3 text-left ${
                !displayRentalAmount ? "" : "border-r"
              }`}
            >
              <div className="flex flex-col">
                <strong>Projeção Aluguel</strong>
                <span className="text-sm font-normal">
                  {propertyData.rentAppreciationRate}%
                </span>
              </div>
            </th>
            {displayRentalAmount && (
              <th
                style={{ borderColor: secondary }}
                className={`px-4 py-3 border-b text-left ${
                  displayRentalAmount ? "" : "border-r"
                }`}
              >
                <div className="flex flex-col">
                  <strong>Diferença</strong>
                  <span className="text-sm font-normal">aluguel - parcela</span>
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {caseData.detailedTable.map((item, i) => {
            if ((i - 1) % 12 === 0)
              return (
                <tr style={{ color }} key={i}>
                  <td
                    style={{ color, borderColor: secondary }}
                    className="px-4 py-3 border-r border-t font-bold"
                  >
                    Ano {(i - 1) / 12 + 1}
                  </td>
                  <td
                    style={{ color, borderColor: secondary }}
                    className="px-4 py-3 border-r border-t"
                  >
                    {toBRL(
                      item.propertyValue *
                        (1 + propertyData.propertyAppreciationRate / 100)
                    )}
                  </td>
                  <td
                    style={{ color, borderColor: secondary }}
                    className={`px-4 py-3 border-t ${
                      displayRentalAmount ? "border-r" : ""
                    }`}
                  >
                    {toBRL(item.rentValue)}
                  </td>
                  {displayRentalAmount && (
                    <td
                      style={{ color, borderColor: secondary }}
                      className="px-4 py-3 border-t"
                    >
                      {toBRL(item.rentalAmount)}
                    </td>
                  )}
                </tr>
              );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CalculationTable;
