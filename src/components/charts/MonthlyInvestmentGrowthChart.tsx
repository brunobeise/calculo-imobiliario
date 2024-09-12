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

export function MonthlyInvestmentGrowthChart(props: {
  rentValues: number[];
  initialCapitalYields: number[];
  installmentValues: number[];
  monthlyInvestmentValues?: number[];
}) {
  const allValuesAreZero = (arr: number[]) => arr.every((value) => value === 0);


  const calculatedData = props.rentValues.map(
    (rentValue, index) =>
      rentValue +
      props.initialCapitalYields[index] -
      props.installmentValues[index]
  );

  // Definindo o label dinamicamente com base nos dados de rendimento
  const label = allValuesAreZero(props.initialCapitalYields)
    ? "Aluguel - Parcela"
    : "Rendimento + Aluguel - Parcela";

  const options = {
    responsive: true,
    labels: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return "Montante do mês: " + toBRL(context.parsed.y);
          },
        },
      },
    },
  };

  const data = {
    labels: calculatedData.map((_v, i) => i),
    datasets: [
      {
        fill: false, // Removendo o preenchimento
        label: label, // Usando o label dinâmico
        data: calculatedData,
        borderColor: "#002f57",
        backgroundColor: "#002f57",
        pointRadius: 0,
      },
    ],
  };

  // Adicionando a linha do MonthlyInvestment, caso seja passada
  if (
    props.monthlyInvestmentValues &&
    props.monthlyInvestmentValues.length > 0
  ) {
    data.datasets.push({
      fill: false,
      label: "Investimento Mensal (VP)",
      data: props.monthlyInvestmentValues,
      borderColor: "#ff6347", // Cor diferente para distinguir
      backgroundColor: "#ff6347",
      pointRadius: 0,
    });
  }

  return <Line options={options} data={data} />;
}
