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

  const allValuesAreZero = (arr: number[]) => arr.every((value) => value === 0);

  const datasets = [];

  if (!allValuesAreZero(props.propertyValues)) {
    datasets.push({
      label: "Valor do Imóvel",
      data: props.propertyValues,
      borderColor: "#0073d7",
      backgroundColor: "#0073d7",
      pointRadius: 0,
    });
  }

  if (!allValuesAreZero(props.investedEquityValues)) {
    datasets.push({
      label: "Patrimônio Renda Fixa",
      data: props.investedEquityValues,
      borderColor: "#1e476b",
      backgroundColor: "#1e476b",
      pointRadius: 0,
    });
  }

  if (
    props.outstandingBalanceValues &&
    props.outstandingBalanceValues.length > 0 &&
    !allValuesAreZero(props.outstandingBalanceValues)
  ) {
    datasets.push({
      label: "Saldo Devedor",
      data: props.outstandingBalanceValues,
      borderColor: "#a41d3f",
      backgroundColor: "#a41d3f",
      pointRadius: 0,
    });
  }

  const data = {
    labels: props.propertyValues.map((_v, i) => i),
    datasets,
  };

  return <Line options={options} data={data} />;
}
