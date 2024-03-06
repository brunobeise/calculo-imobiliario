import { PropertyData } from "@/PropertyDataContext";
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

export function ComparativeMonthlyInvestmentGrowthChart({
  propertyData,
}: {
  propertyData: PropertyData;
}) {
  const inCashValues = [];
  const financingValues = [];

  let accumulatedCapitalInCash =
    propertyData.personalBalance - propertyData.propertyValue;
  let accumulatedCapitalFinancing =
    propertyData.personalBalance -
    propertyData.financingFees -
    propertyData.downPayment;

  let rentValue = propertyData.initialRentValue;

  for (let month = 1; month <= propertyData.finalYear * 12; month++) {
    const yearIndex = Math.floor((month - 1) / 12);

    if (month % 12 === 1 || month === 1) {
      rentValue = propertyData.rentValue![yearIndex];
    }

    // InCash calculations
    const inCashRentAmount = Number(rentValue.toFixed(2));
    let inCashMonthlyProfit = 0;
    if (accumulatedCapitalInCash >= 0) {
      inCashMonthlyProfit = Number(
        ((accumulatedCapitalInCash * propertyData.monthlyIncome) / 100).toFixed(
          2
        )
      );
    }
    const finalValueInCash = Number(
      (
        accumulatedCapitalInCash +
        inCashMonthlyProfit +
        inCashRentAmount
      ).toFixed(2)
    );
    inCashValues.push(inCashMonthlyProfit + inCashRentAmount);
    accumulatedCapitalInCash = finalValueInCash;

    // Financing calculations
    const financingRentAmount = Number(
      (rentValue - propertyData.installmentValue).toFixed(2)
    );
    let financingMonthlyProfit = 0;
    if (accumulatedCapitalFinancing >= 0) {
      financingMonthlyProfit = Number(
        (
          (accumulatedCapitalFinancing * propertyData.monthlyIncome) /
          100
        ).toFixed(2)
      );
    }
    const finalValueFinancing = Number(
      (
        accumulatedCapitalFinancing +
        financingMonthlyProfit +
        financingRentAmount
      ).toFixed(2)
    );
    financingValues.push(financingMonthlyProfit + financingRentAmount);
    accumulatedCapitalFinancing = finalValueFinancing;
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
    labels: Array.from(
      { length: propertyData.finalYear * 12 },
      (_, i) => i + 1
    ),
    datasets: [
      {
        label: "Aluguel + Rendimento - Parcela (À Vista)",
        data: inCashValues,
        borderColor: "#0067c2",
        backgroundColor: "#0067c2",
        pointRadius: 0,
      },
      {
        label: "Aluguel + Rendimento - Parcela (Financiamento)",
        data: financingValues,
        borderColor: "#1e476b",
        backgroundColor: "#1e476b",
        pointRadius: 0,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
