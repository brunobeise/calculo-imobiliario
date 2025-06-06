/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import DetailedTableComponent from "@/components/structure/DetailedTableStructure";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import { DirectFinancingDetailedTable } from "../calculators/DirectFinancingCalculator";

interface TabelaRendimentoProps {
  detailedTable: DirectFinancingDetailedTable[];
  propertyData: PropertyData;
}

export default function DetailedTable(props: TabelaRendimentoProps) {
  const rows = props.detailedTable;

  const columns = [
    {
      title: "Mês",
      dataIndex: "month",
      render: (_value: any, _: any, index: number) =>
        dayjs(props.propertyData.initialDate, "MM/YYYY")
          .add(index + 1, "month")
          .format("MMM/YYYY"),
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
