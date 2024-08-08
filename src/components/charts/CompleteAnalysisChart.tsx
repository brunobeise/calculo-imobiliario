import { Line } from "react-chartjs-2";

export default function CompleteAnalysisChart(props: {
  propertyValues: number[];
  outstandingBalanceValues?: number[];
  investedEquityValues: number[];
}) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 12,
        },
      },
      datalabels: {
        display: false,
      },
    },
  };

  const data = {
    labels: props.propertyValues.map((_v, i) => i),
    datasets: [
      {
        label: "Valor do Imóvel",
        data: props.propertyValues,
        borderColor: "#0073d7",
        backgroundColor: "#0073d7",
        pointRadius: 0,
      },

      {
        label: "Patrimônio Renda Fixa",
        data: props.investedEquityValues,
        borderColor: "#1e476b",
        backgroundColor: "#1e476b",
        pointRadius: 0,
      },
    ],
  };

  if (
    props.outstandingBalanceValues &&
    props.outstandingBalanceValues.length > 0
  ) {
    data.datasets.push({
      label: "Saldo Devedor",
      data: props.outstandingBalanceValues,
      borderColor: "#a41d3f",
      backgroundColor: "#a41d3f",
      pointRadius: 0,
    });
  }

  return <Line options={options} data={data} />;
}
