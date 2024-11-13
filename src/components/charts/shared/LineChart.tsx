/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { toBRL } from "@/lib/formatter";

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

interface LineChartProps {
  labels: (string | number)[];
  datasets: {
    label?: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
  showLegend?: boolean;
  tooltipFormatter?: (value: number) => string;
  height?: number;
}

export function LineChart({
  labels,
  datasets,
  showLegend = true,
  tooltipFormatter = (value) => `Valor: ${toBRL(value)}`,
  height,
}: LineChartProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: showLegend,
        position: "top" as const,
      },
      datalabels: {
        align: "end" as const,
        anchor: "end" as const,
        backgroundColor: function (context: any) {
          return context.dataset.backgroundColor;
        },
        color: "white" as const,
        font: {
          weight: "bold" as const,
          size: 12,
        },
        padding: {
          top: 6,
          bottom: 6,
          left: 6,
          right: 6,
        }, // Configuração de padding para manter a forma redonda
        borderRadius: 20, // Um valor alto para garantir o formato circular

        display: function (context: any) {
          return context.dataset.data[context.dataIndex] !== 0;
        },
      },
      
      tooltip: {
        callbacks: {
          label: (context: any) => tooltipFormatter(context.parsed.y),
        },
      },
    },
    layout: {
      padding: {
        top: 36,
        right: 16,
        bottom: 16,
        left: 8,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
    
  };

  const data = {
    labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      borderColor: dataset.borderColor || "#002f57",
      backgroundColor: dataset.backgroundColor || "#002f57",
      borderWidth: 2,
      pointBackgroundColor: "white",
      pointBorderColor: "#002f57",
      pointRadius: 4,
    })),
  };

  return (
    <Line
      height={height ? `${height}px` : undefined}
      options={options}
      data={data}
    />
  );
}
