
import { Line } from "react-chartjs-2";

export function BreakEvenChart({
  profitValues,
  outstandingBalanceValues,
}: {
  profitValues: number[];
  outstandingBalanceValues: number[];
}) {
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
    },
  };

  const data = {
    labels: profitValues.map((_v, i) => i),
    datasets: [
      {
        label: "Lucro acumulado",
        data: profitValues,
        borderColor: "#0067c2",
        backgroundColor: "#0067c2",
        pointRadius: 0,
      },
      {
        label: "Saldo Devedor",
        data: outstandingBalanceValues,
        borderColor: "#1e476b",
        backgroundColor: "#1e476b",
        pointRadius: 0,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
