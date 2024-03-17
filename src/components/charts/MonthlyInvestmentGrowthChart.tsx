import { numeroParaReal } from "@/lib/formatter";
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

export function MonthlyInvestmentGrowthChart(props: {
  data: number[];
}) {
  

  const options = {
    responsive: true,
    labels: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return "Montante do mês: " + numeroParaReal(context.parsed.y);
          },
        },
      },
    },
  };

  const data = {
    labels: props.data.map((_v, i) => i),
    datasets: [
      {
        fill: true,
        label: "Rendimento + Aluguel - Parcela",
        data: props.data,
        borderColor: "#002f57",
        backgroundColor: "#002e57e1",
        pointRadius: 0,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
