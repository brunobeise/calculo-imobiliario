import { numeroParaReal } from "@/lib/formatter";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FinancingPlanningDetailedTable } from "./CaseData";
import { useContext, useMemo } from "react";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";

interface TabelaRendimentoProps {
  detailedTable: FinancingPlanningDetailedTable[];
}

export default function DetailedTable(props: TabelaRendimentoProps) {
  const rows = props.detailedTable || [];
  const theme = useTheme();
  const matchesLG = useMediaQuery(theme.breakpoints.up("lg"));
  const { propertyData } = useContext(propertyDataContext);

  const visibleColumns = useMemo(() => {
    const columnVisibility = {
      initialCapital:
        !propertyData.isHousing && rows.some((row) => row.initialCapital !== 0),
      rentValue:
        !propertyData.isHousing && rows.some((row) => row.rentValue !== 0),
      initialCapitalYield:
        !propertyData.isHousing &&
        rows.some((row) => row.initialCapitalYield !== 0),
      rentalShortfall: rows.some((row) => row.rentalShortfall !== 0),
      outstandingBalance: rows.some((row) => row.outstandingBalance !== 0),
      finalValue: rows.some((row) => row.finalValue !== 0),
      monthlyProfit: rows.some((row) => row.monthlyProfit !== 0),
    };

    return columnVisibility;
  }, [rows, propertyData.isHousing]);

  return (
    <div className="col-span-12 lg:px-2">
      <h2 className="text-xl text-center font-bold my-2">Tabela Detalhada</h2>
      <Sheet
        sx={{
          height: 500,
          backgroundColor: "transparent",
          overflowX: "auto",
        }}
      >
        <div style={{ minWidth: 600 }}>
          <Table
            className="text-left"
            sx={{
              "& thead th:nth-child-of-type(1)": { width: "50px" },
              minWidth: 1000,
            }}
            borderAxis="x"
            color="neutral"
            size={matchesLG ? "md" : "sm"}
            stickyFooter={true}
            stickyHeader={true}
            variant="outlined"
          >
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Mês </th>
                {visibleColumns.initialCapital && <th>Capital</th>}
                {visibleColumns.rentValue && <th>Valor do Aluguel</th>}
                <th>Aluguel - Parcela</th>
                <th>Valor do Imóvel</th>
                {visibleColumns.initialCapitalYield && (
                  <th>Rendimento do Capital</th>
                )}
                {visibleColumns.rentalShortfall && (
                  <th>Investimento Excedente</th>
                )}
                {visibleColumns.outstandingBalance && <th>Saldo Devedor</th>}
                {visibleColumns.finalValue && <th>Patrimônio Líquido</th>}
                {visibleColumns.monthlyProfit && <th>Lucro</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {visibleColumns.initialCapital && (
                    <td>{numeroParaReal(item.initialCapital)}</td>
                  )}
                  {visibleColumns.rentValue && (
                    <td>{numeroParaReal(item.rentValue)}</td>
                  )}
                  <td>{numeroParaReal(item.rentalAmount)}</td>
                  <td>{numeroParaReal(item.propertyValue)}</td>
                  {visibleColumns.initialCapitalYield && (
                    <td>{numeroParaReal(item.initialCapitalYield)}</td>
                  )}
                  {visibleColumns.rentalShortfall && (
                    <td>{numeroParaReal(item.rentalShortfall)}</td>
                  )}
                  {visibleColumns.outstandingBalance && (
                    <td>{numeroParaReal(item.outstandingBalance)}</td>
                  )}
                  {visibleColumns.finalValue && (
                    <td>{numeroParaReal(item.finalValue)}</td>
                  )}
                  {visibleColumns.monthlyProfit && (
                    <td>{numeroParaReal(item.monthlyProfit)}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Sheet>
    </div>
  );
}
