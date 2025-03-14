import { toBRL } from "@/lib/formatter";
import SectionTitle from "./SectionTitle";
import { GrLineChart } from "react-icons/gr";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import dayjs from "dayjs";

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
}

const CalculationTable = ({
  propertyData,
  caseData,
  color,
  secondary,
}: CalculationTableProps) => {
  const hasNonZeroRent = caseData.detailedTable.some(
    (item) => item.rentValue !== 0
  );

  return (
    <>
      <SectionTitle
        color={color}
        secondary={secondary}
        title={"Valorização do Imóvel"}
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
            >
              Ano
            </th>
            <th
              style={{ borderColor: secondary }}
              className={`px-4 py-3 ${
                hasNonZeroRent ? "border-r" : ""
              } border-b text-left`}
            >
              <div className="flex flex-col">
                <strong>Valorização Imóvel</strong>
                <span className="text-sm font-normal">
                  {propertyData.propertyAppreciationRate}%
                </span>
              </div>
            </th>
            {hasNonZeroRent && (
              <>
                <th
                  style={{ borderColor: secondary }}
                  className="px-4 py-3 border-r border-b text-left"
                >
                  <div className="flex flex-col">
                    <strong>Projeção Aluguel</strong>
                    <span className="text-sm font-normal">
                      {propertyData.rentAppreciationRate}%
                    </span>
                  </div>
                </th>
                <th
                  style={{ borderColor: secondary }}
                  className="px-4 py-3 border-b text-left"
                >
                  <div className="flex flex-col">
                    <strong>Diferença</strong>
                    <span className="text-sm font-normal">
                      aluguel - parcela
                    </span>
                  </div>
                </th>
              </>
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
                    {dayjs(propertyData.initialDate, "MM/YYYY")
                      .add((i - 1) / 12, "year")
                      .locale("pt-br")
                      .format("YYYY")}
                  </td>
                  <td
                    style={{ color, borderColor: secondary }}
                    className={`px-4 py-3  border-t ${
                      hasNonZeroRent ? "border-r" : ""
                    }`}
                  >
                    {toBRL(
                      item.propertyValue *
                        (1 + propertyData.propertyAppreciationRate / 100)
                    )}
                  </td>
                  {hasNonZeroRent && (
                    <>
                      <td
                        style={{ color, borderColor: secondary }}
                        className="px-4 py-3 border-r border-t"
                      >
                        {toBRL(item.rentValue)}
                      </td>
                      <td
                        style={{ color, borderColor: secondary }}
                        className="px-4 py-3 border-t"
                      >
                        {toBRL(item.rentalAmount)}
                      </td>
                    </>
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
