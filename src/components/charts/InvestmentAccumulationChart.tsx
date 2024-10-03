/* eslint-disable @typescript-eslint/no-explicit-any */
import { toBRL } from "@/lib/formatter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export function InvestmentAccumulationChart(props: {
  accumulatedValues: number[];
}) {
  const accumulatedData = {
    labels: props.accumulatedValues.map((_v, i) => i + 1),
    datasets: [
      {
        fill: false,
        label: "Total Acumulado",
        data: props.accumulatedValues,
        borderColor: "#ff6347",
        backgroundColor: "#ff6347",
        pointRadius: 0,
      },
    ],
  };

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
          label: function (context: any) {
            return "Montante do mês: " + toBRL(context.parsed.y);
          },
        },
      },
    },
  };

  return (
    <>
      <Line options={options} data={accumulatedData} />
    </>
  );
}
