import { Line } from "react-chartjs-2";


interface ComparativeTotalEquityGrowthProps {
  inCashValues: number[];
  financingValues: number[]
  finalYear: number
}
export default function ComparativeTotalEquityGrowth(props: ComparativeTotalEquityGrowthProps) {

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return `Total assets: ${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
  };

  const data = {
    labels: Array.from(
      { length: props.finalYear * 12 },
      (_, i) => i + 1
    ),
    datasets: [
      {
        label: "Patrimônio (À Vista)",
        data: props.inCashValues,
        borderColor: "#0073d7",
        backgroundColor: "#0073d7",
        pointRadius: 0,
      },
      {
        label: "Patrimônio (Financiamento)",
        data: props.financingValues,
        borderColor: "#1e476b",
        backgroundColor: "#1e476b",
        pointRadius: 0,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
