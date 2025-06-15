/* eslint-disable @typescript-eslint/no-explicit-any */
import { Doughnut } from "react-chartjs-2";

interface DonutChartProps {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string[];
  }[];
  tooltipFormatter?: (value: number) => string;
  width?: number;
  datalabelsOptions?: Partial<any>;
}

export function DonutChart({
  labels,
  datasets,
  tooltipFormatter = (value) => `Propostas: ${value}`,
  width,
  datalabelsOptions,
}: DonutChartProps) {
  const colors = datasets[0]?.backgroundColor || [
    "#002f57",
    "#004e93",
    "#0088b8",
    "#008d9b",
    "#008e78",
    "#efdf00",
    "#e28a07",
    "#a9351b",
    "#6b2a89",
  ];

  const defaultDatalabels = {
    color: "white" as const,
    font: {
      weight: "bold" as const,
      size: 12,
    },
    display: (context: any) => {
      const dataset = context.chart.data.datasets[0];
      const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
      const percent = (context.dataset.data[context.dataIndex] / total) * 100;
      return percent > 4;
    },
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        ...defaultDatalabels,
        ...datalabelsOptions,
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
    <div className={`flex items-start h-min w-min relative`}>
      <div
        className={`flex flex-col gap-x-8 gap-y-2 w-full text-primary w-max max-w-[300px] me-10`}
      >
        {labels.map((label, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span
              className="w-4 h-4 rounded-full flex-shrink-0 me-2"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-gray-700 text-md font-medium">{label}</span>
          </div>
        ))}
      </div>
      <div>
        <Doughnut width={width} options={options} data={data} />
      </div>
    </div>
  );
}
