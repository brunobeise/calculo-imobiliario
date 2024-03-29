import { numeroParaReal } from "@/lib/formatter";
import { FinancingOrCashDetailedTable } from "@/pages/financiamento/financiamentoxavista/Context";
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
            sx={{ "& thead th:nth-child-of-type(1)": { width: "50px" }, minWidth: 1000 }}
            borderAxis="x"
            color="neutral"
            size={matchesLG ? "md" : "sm"}
            stickyFooter={true}
            stickyHeader={true}
            variant="outlined"
          >
            <thead>
              <tr>
                <th style={{width: '60px'}}>Mês </th>
                <th>Capital</th>
                <th>Capital do Aluguel</th>
                <th>Valor do Aluguel</th>
                <th>Valor do Imóvel</th>
                <th>Rendimento do Capital</th>
                <th>Rendimento do Aluguel</th>
                <th>Saldo Devedor</th>
                <th>Patrimônio Líquido</th>
                <th>Lucro</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{numeroParaReal(item.initialCapital)}</td>
                  <td>{numeroParaReal(item.rentalIncomeCapital)}</td>
                  <td>{numeroParaReal(item.rentValue)}</td>

                  <td>{numeroParaReal(item.propertyValue)}</td>
                  <td>{numeroParaReal(item.initialCapitalYield)}</td>
                  <td>{numeroParaReal(item.rentalIncomeYield)}</td>
                  <td>{numeroParaReal(item.outstandingBalance)}</td>
                  <td>{numeroParaReal(item.finalValue)}</td>

                  <td>{numeroParaReal(item.monthlyProfit)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Sheet>
    </div>
  );
}
