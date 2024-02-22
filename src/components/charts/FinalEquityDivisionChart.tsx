/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { numeroParaReal } from "@/lib/formatter";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface InitialEquityDivisionChharProps {
  labels: string[];
  values: number[];
}

export default function FinalEquityDivisionChart({
  labels = [],
  values = [],
}: InitialEquityDivisionChharProps) {
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
    plugins: {
      datalabels: {
        color: "#fff", // Define a cor do texto dos labels
        formatter: (value: any) => {
          return numeroParaReal(value);
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || "";

            if (label === "Valor do Imóvel") {
              label = "Valor do imóvel valorizado: ";
            }

            if (label === "Renda Fixa") {
              label = "Montante final na renda fixa: ";
            }

            if (label === "Saldo Devedor") {
              label = "Saldo devedor final: ";
            }

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
    },
  };

  return <Pie data={data} options={options} />;
}
