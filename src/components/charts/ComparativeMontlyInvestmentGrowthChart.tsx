import { toBRL } from "@/lib/formatter";
import { Line } from "react-chartjs-2";

interface ComparativeMonthlyInvestmentGrowthChartProps {
  financingValues: number[];
  inCashValues: number[];
  finalYear: number;
}

export function ComparativeMonthlyInvestmentGrowthChart(
  props: ComparativeMonthlyInvestmentGrowthChartProps
) {
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
    labels: Array.from({ length: props.finalYear * 12 }, (_, i) => i + 1),
    datasets: [
      {
        label: "RENDIMENTO CAPITAL + ALUGUEL - PARCELA FINANCIAMENTO",
        data: props.inCashValues,
        borderColor: "#0067c2",
        backgroundColor: "#0067c2",
        pointRadius: 0,
      },
      {
        label: "RENDIMENTO CAPITAL + ALUGUEL",
        data: props.financingValues,
        borderColor: "#1e476b",
        backgroundColor: "#1e476b",
        pointRadius: 0,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
