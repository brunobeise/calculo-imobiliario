/* eslint-disable @typescript-eslint/no-explicit-any */
import { toBRL } from "@/lib/formatter";
import { Pie } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
import chroma from "chroma-js";

interface InitialEquityDivisionChartProps {
  labels: string[];
  values: number[];
  color: string;
}

export default function InitialEquityDivisionChart({
  labels = [],
  values = [],
  color = "#3498db",
}: InitialEquityDivisionChartProps) {
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
        backgroundColor: (() => {
          const luminance = chroma(color).luminance();

          if (luminance > 0.9) {
            return [
              color,
              chroma(color).darken(1).hex(),
              chroma(color).darken(2).hex(),
            ];
          } else if (luminance < 0.1) {
            return [
              color,
              chroma(color).brighten(1).hex(),
              chroma(color).brighten(2).hex(),
            ];
          } else {
            return [
              color,
              chroma(color).brighten(0.8).hex(),
              chroma(color).darken(0.8).hex(),
            ];
          }
        })(),

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
        color: chroma(color).luminance() > 0.7 ? "#000000" : "#FFFFFF",
        formatter: (value: number, context: any) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}\n${toBRL(value)}`;
        },
        font: {
          size: 10,
          weight: "bold" as const,
        },

        padding: 5,
        backgroundColor: chroma(color).darken(0.3).hex(),
        borderRadius: 4,
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
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {filteredData.filteredValues.length > 0 ? (
        <div className="w-full flex flex-col items-center">
          <Pie className="w-full h-full" data={data} options={options} />
          <div className="flex justify-around mt-4 me-4">
            {filteredData.filteredLabels.map((label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-12 h-4 mx-6"
                  style={{
                    backgroundColor: data.datasets[0].backgroundColor[index],
                  }}
                ></div>
                <span className="mt-1 text-[13px] text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <span>Nenhum dado disponível</span>
      )}
    </div>
  );
}
