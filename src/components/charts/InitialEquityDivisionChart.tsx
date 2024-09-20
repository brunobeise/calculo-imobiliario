/* eslint-disable @typescript-eslint/no-explicit-any */
import { toBRL } from "@/lib/formatter";
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
  // Filtra valores e labels, removendo aqueles cujo valor é zero
  const filteredData = values.reduce(
    (acc, value, index) => {
      if (value !== 0) {
        acc.filteredValues.push(value);
        acc.filteredLabels.push(labels[index]);
      }
      return acc;
    },
    { filteredValues: [] as number[], filteredLabels: [] as string[] }
  );

  const data = {
    labels: filteredData.filteredLabels,
    datasets: [
      {
        label: "",
        data: filteredData.filteredValues,
        backgroundColor: ["#04335d", "#0057a3", "#007fef"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    layout: {
      padding: {
        bottom: 20,
      },
    },
    plugins: {
      datalabels: {
        color: "#fff",
        formatter: (value: number) => {
          return toBRL(value);
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
    <div className="flex flex-col items-center justify-center">
      {filteredData.filteredValues.length > 0 ? (
        <>
          <Pie data={data} options={options} />
          <div className="flex justify-around mt-4  w-[110%]">
            {filteredData.filteredLabels.map((label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-12 h-4"
                  style={{
                    backgroundColor: data.datasets[0].backgroundColor[index],
                  }}
                ></div>
                <span className="mt-1 text-[13px] text-center bg-white">{label}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <span>Nenhum dado disponível</span>
      )}
    </div>
  );
}
