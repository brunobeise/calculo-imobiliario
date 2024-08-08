/* eslint-disable @typescript-eslint/no-explicit-any */
import { numeroParaReal } from "@/lib/formatter";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "chartjs-plugin-datalabels";
Chart.register(...registerables);

interface InitialEquityDivisionChartProps {
  labels: string[];
  values: number[];
}

export default function InitialEquityDivisionChart({
  labels = [],
  values = [],
}: InitialEquityDivisionChartProps) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: values,
        backgroundColor: ["#04335d", "#0057a3", "#007fef"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    layout: {
      padding: {
        bottom: 20, // Ajusta a margem inferior para dar espaço para a legenda
      },
    },
    plugins: {
      datalabels: {
        color: "#fff",
        formatter: (value: number) => {
          return numeroParaReal(value);
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || "";

            if (label === "Taxas") {
              label = "Taxas do Financiamento";
            }

            if (label === "Renda Fixa") {
              label = "Valor investido em renda fixa";
            }

            if (label === "Entrada") {
              label = "Entrada do Financiamento";
            }

            label += ": ";

            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(context.parsed);
            }
            return label;
          },
        },
      },
      legend: {
        display: false,
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return data.labels.map((label: any, i: number) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                return {
                  text: label,
                  fillStyle: style.backgroundColor,
                  hidden: !chart.getDataVisibility(i),
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <Pie data={data} options={options} />
      <div className="flex justify-around mt-4  w-full">
        {labels.map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-12 h-4"
              style={{
                backgroundColor: data.datasets[0].backgroundColor[index],
              }}
            ></div>
            <span className="mt-1 text-[13px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
