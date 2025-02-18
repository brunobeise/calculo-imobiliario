/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

interface DonutChartProps {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string[];
  }[];
  tooltipFormatter?: (value: number) => string;
  height?: number;
  absoluteLegends?: boolean;
}

export function DonutChart({
  labels,
  datasets,
  tooltipFormatter = (value) => `Propostas: ${value}`,
  absoluteLegends = false,
}: DonutChartProps) {
  const colors = datasets[0]?.backgroundColor || [
    "#002f57",
    "#004e93",
    "#103759",
    "#1e90ff",
    "#00bfff",
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "white" as const,
        font: {
          weight: "bold" as const,
          size: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return tooltipFormatter(context.parsed);
          },
        },
      },
    },
    cutout: "50%",
  };

  const data = {
    labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: colors,
      borderWidth: 2,
      borderColor: "#fff",
    })),
  };

  return (
    <div className={`flex flex-col items-center`}>
      <div className={`${absoluteLegends ? "ps-24" : "px-20"}`}>
        <Doughnut options={options} data={data} />
      </div>
      <div
        className={`${
          absoluteLegends ? "absolute" : "mt-5"
        }  grid grid-cols-1  gap-4 w-full text-primary text-nowrap`}
      >
        {labels.map((label, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-gray-700 text-md font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
