import { toBRL } from "@/lib/formatter";

import { Line } from "react-chartjs-2";

export function MonthlyInvestmentGrowthChart(props: {
  rentValues: number[];
  initialCapitalYields: number[];
  installmentValues: number[];
  monthlyInvestmentValues?: number[];
  color: string;
}) {
  const allValuesAreZero = (arr: number[]) => arr.every((value) => value === 0);

  const calculatedData = props.rentValues.map(
    (rentValue, index) =>
      rentValue +
      props.initialCapitalYields[index] -
      props.installmentValues[index]
  );

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
        fill: false,
        label: label,
        data: calculatedData,
        borderColor: props.color,
        backgroundColor: props.color,
        pointRadius: 0,
      },
    ],
  };

  if (
    props.monthlyInvestmentValues &&
    props.monthlyInvestmentValues.length > 0
  ) {
    data.datasets.push({
      fill: false,
      label: "Investimento Mensal (VP)",
      data: props.monthlyInvestmentValues,
      borderColor: "#ff6347",
      backgroundColor: "#ff6347",
      pointRadius: 0,
    });
  }

  return <Line options={options} data={data} />;
}
