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

export function CDIComparation(props: {
  cdiRate: number;
  initialCapital: number;
  monthlyContributions: number[];
  profitValues: number[];
}) {
  const { cdiRate, initialCapital, monthlyContributions } = props;

  const accumulatedValues = [initialCapital];
  let currentCapital = initialCapital;

  monthlyContributions.forEach((contribution) => {
    const discharge = contribution < 0 ? contribution * -1 : 0;
    const monthlyCdiRate = Math.pow(1 + cdiRate / 100, 1 / 12) - 1;
    const interest = currentCapital * monthlyCdiRate; 
    currentCapital += discharge + interest;
    accumulatedValues.push(currentCapital);
  });

  const data = {
    labels: monthlyContributions.map((_v, i) => i + 1),
    datasets: [
      {
        fill: false,
        label: "Capital Investido no CDI",
        data: accumulatedValues,
        borderColor: "#ff6347",
        backgroundColor: "#ff6347",
        pointRadius: 0,
      },
      {
        fill: false,
        label: "Patrimônio Investimento Imobiliário",
        data: props.profitValues,
        borderColor: "#002f57",
        backgroundColor: "#002f57",
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
            return "Montante acumulado: " + toBRL(context.parsed.y);
          },
        },
      },
    },
  };

  return <Line options={options} data={data} />;
}
