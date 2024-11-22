/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import { FinancingPlanningDetailedTable } from "./CaseData";
import DetailedTableComponent from "@/components/structure/DetailedTableStructure";
import { useContext } from "react";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";

interface TabelaRendimentoProps {
  detailedTable: FinancingPlanningDetailedTable[];
}

export default function DetailedTable(props: TabelaRendimentoProps) {
  const rows = props.detailedTable;
  const { propertyData } = useContext(propertyDataContext);

  if (!propertyData) return null;

  const columns = [
    {
      title: "Mês",
      dataIndex: "month",
      render: (_value: any, _: any, index: number) =>
        dayjs(propertyData.initialDate, "MM/YYYY")
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
