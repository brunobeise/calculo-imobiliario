/* eslint-disable @typescript-eslint/no-explicit-any */
import { numeroParaReal } from "@/lib/formatter";
import { Pie } from "react-chartjs-2";

interface InitialEquityDivisionChharProps {
  labels: string[];
  values: number[];
}

export default function InitialEquityDivisionChart({
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
              label = "Entarda do Financiamento";
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
    },
  };

  return <Pie data={data} options={options} />;
}
