/* eslint-disable @typescript-eslint/no-explicit-any */
import { FinancingPlanningDetailedTable } from "./CaseData";
import DetailedTableComponent from "@/components/structure/DetailedTableStructure";

interface TabelaRendimentoProps {
  detailedTable: FinancingPlanningDetailedTable[];
}

export default function DetailedTable(props: TabelaRendimentoProps) {
  const rows = props.detailedTable;

  const columns = [
    {
      title: "Mês",
      dataIndex: "month",
      render: (_value: any, _: any, index: number) => index + 1,
    },
    { title: "Capital", dataIndex: "initialCapital" },
    { title: "Valor do Aluguel", dataIndex: "rentValue" },
    { title: "Aluguel - Parcela", dataIndex: "rentalAmount" },
    { title: "Valor do Imóvel", dataIndex: "propertyValue" },
    { title: "Rendimento do Capital", dataIndex: "initialCapitalYield" },
    { title: "Investimento Excedente Acumulado", dataIndex: "rentalShortfall" },
    {
      title: "Investimento Mensal (VP)",
      dataIndex: "investmentExcessPresentValue",
    },
    { title: "Saldo Devedor", dataIndex: "outstandingBalance" },
    { title: "Patrimônio Líquido", dataIndex: "finalValue" },
    { title: "Lucro", dataIndex: "monthlyProfit" },
  ];

  return (
    <DetailedTableComponent
      columns={columns}
      rows={rows}
      rowKey={(_record, index) => index}
    />
  );
}
