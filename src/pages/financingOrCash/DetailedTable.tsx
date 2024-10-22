import { toBRL } from "@/lib/formatter";
import { FinancingOrCashDetailedTable } from "@/pages/financingOrCash/CaseData";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface TabelaRendimentoProps {
  detailedTable: FinancingOrCashDetailedTable[];
}

export default function DetailedTable(props: TabelaRendimentoProps) {
  const rows = props.detailedTable || [];
  const theme = useTheme();
  const matchesLG = useMediaQuery(theme.breakpoints.up("lg"));

  const shouldDisplayColumn = {
    initialCapital: rows.some((item) => item.initialCapital !== 0),
    rentalIncomeCapital: rows.some((item) => item.rentalIncomeCapital !== 0),
    rentValue: rows.some((item) => item.rentValue !== 0),
    propertyValue: rows.some((item) => item.propertyValue !== 0),
    initialCapitalYield: rows.some((item) => item.initialCapitalYield !== 0),
    rentalIncomeYield: rows.some((item) => item.rentalIncomeYield !== 0),
    outstandingBalance: rows.some((item) => item.outstandingBalance !== 0),
    finalValue: rows.some((item) => item.finalValue !== 0),
    monthlyProfit: rows.some((item) => item.monthlyProfit !== 0),
  };

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
                <th style={{ width: "60px" }}>Mês</th>
                {shouldDisplayColumn.initialCapital && <th>Capital</th>}
                {shouldDisplayColumn.rentalIncomeCapital && (
                  <th>Capital do Aluguel</th>
                )}
                {shouldDisplayColumn.rentValue && <th>Valor do Aluguel</th>}
                {shouldDisplayColumn.propertyValue && <th>Valor do Imóvel</th>}
                {shouldDisplayColumn.initialCapitalYield && (
                  <th>Rendimento do Capital</th>
                )}
                {shouldDisplayColumn.rentalIncomeYield && (
                  <th>Rendimento do Aluguel</th>
                )}
                {shouldDisplayColumn.outstandingBalance && (
                  <th>Saldo Devedor</th>
                )}
                {shouldDisplayColumn.finalValue && <th>Patrimônio Líquido</th>}
                {shouldDisplayColumn.monthlyProfit && <th>Lucro</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {shouldDisplayColumn.initialCapital && (
                    <td>{toBRL(item.initialCapital)}</td>
                  )}
                  {shouldDisplayColumn.rentalIncomeCapital && (
                    <td>{toBRL(item.rentalIncomeCapital)}</td>
                  )}
                  {shouldDisplayColumn.rentValue && (
                    <td>{toBRL(item.rentValue)}</td>
                  )}
                  {shouldDisplayColumn.propertyValue && (
                    <td>{toBRL(item.propertyValue)}</td>
                  )}
                  {shouldDisplayColumn.initialCapitalYield && (
                    <td>{toBRL(item.initialCapitalYield)}</td>
                  )}
                  {shouldDisplayColumn.rentalIncomeYield && (
                    <td>{toBRL(item.rentalIncomeYield)}</td>
                  )}
                  {shouldDisplayColumn.outstandingBalance && (
                    <td>{toBRL(item.outstandingBalance)}</td>
                  )}
                  {shouldDisplayColumn.finalValue && (
                    <td>{toBRL(item.finalValue)}</td>
                  )}
                  {shouldDisplayColumn.monthlyProfit && (
                    <td>{toBRL(item.monthlyProfit)}</td>
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
