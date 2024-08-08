/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartOptions, CoreScaleOptions, Scale } from "chart.js";
import { Line } from "react-chartjs-2";

interface ComparativePercentageGrowthProps {
  inCashValues: number[];
  financingValues: number[]
  finalYear: number
}

export default function ComparativePercentageGrowthChart(props: ComparativePercentageGrowthProps) {

  const options: ChartOptions<"line"> = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Percentage growth: ${context.parsed.y.toFixed(2)}%`;
          },
        },
      },
    },

    scales: {
      y: {
        ticks: {
          callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: string | number
          ) {
            // If the tickValue is a number, format it as a string with a percentage sign
            if (typeof tickValue === "number") {
              return `${tickValue.toFixed(2)}%`;
            }
            // Otherwise, return the tickValue as it is
            return tickValue;
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
        label: "Crescimento (À Vista)",
        data: props.inCashValues,
        borderColor: "#0073d7",
        backgroundColor: "#0073d7",
        pointRadius: 0,
      },
      {
        label: "Crescimento (Financiamento)",
        data: props.financingValues,
        borderColor: "#1e476b",
        backgroundColor: "#1e476b",
        pointRadius: 0,
      },
    ],
  };

  return <Line options={options} data={data} />;
}

