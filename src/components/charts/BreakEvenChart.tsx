import { PropertyData } from "@/PropertyDataContext";
import { calcOutstandingBalance } from "@/lib/calcs";
import { numeroParaReal } from "@/lib/formatter";
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

export function BreakEvenChart({
  propertyData,
  context,
}: {
  propertyData: PropertyData;
  context: "inCash" | "financing";
}) {
  const financingValues = breakEvenRows();

  function breakEvenRows() {
    const rows: {
      month: number;
      profit: number;
      outstandingBalance: number;
    }[] = [];

    const initialCapital =
      context === "financing"
        ? propertyData.personalBalance -
          propertyData.financingFees -
          propertyData.downPayment
        : propertyData.personalBalance - propertyData.propertyValue;

    let accumulatedCapital = initialCapital;

    let rentValue = propertyData.initialRentValue;

    for (let month = 1; month <= propertyData.finalYear * 12; month++) {
      const yearIndex = Math.floor((month - 1) / 12);

      if (month % 12 === 1 || month === 1) {
        rentValue = propertyData.rentValue![yearIndex];
      }

      const rentalAmount =
        context === "financing"
          ? Number(rentValue - propertyData.installmentValue)
          : Number(rentValue);

      let monthlyProfit = 0;
      if (accumulatedCapital >= 0 || context === "financing") {
        monthlyProfit = Number(
          (accumulatedCapital * propertyData.monthlyIncome) / 100
        );
      }

      const finalValue = Number(
        accumulatedCapital + monthlyProfit + rentalAmount
      );

      const outstandingBalance = calcOutstandingBalance(
        propertyData.propertyValue - propertyData.downPayment, // financed amount
        propertyData.interestRate,
        propertyData.financingYears,
        month - 1
      );

      rows.push({
        month,
        profit: finalValue - initialCapital,
        outstandingBalance,
      });

      accumulatedCapital = finalValue;
    }

    return rows;
  }

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
            return "Montante do mês: " + numeroParaReal(context.parsed.y);
          },
        },
      },
    },
  };

  const data = {
    labels: financingValues.map((_v, i) => i),
    datasets: [
      {
        label: "Lucro acumulado",
        data: financingValues.map((v) => v.profit),
        borderColor: "#0067c2",
        backgroundColor: "#0067c2",
        pointRadius: 0,
      },
      {
        label: "Saldo Devedor",
        data: financingValues.map((v) => v.outstandingBalance),
        borderColor: "#1e476b",
        backgroundColor: "#1e476b",
        pointRadius: 0,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
